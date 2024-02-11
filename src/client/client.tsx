declare const setup: {
	setupFrontendStore: (ctx: Window) => { store: any; destroy: () => void };
	renderDevtools: (store: any, container: HTMLElement) => void;
};

if(process.env.NODE_ENV === 'development') {
	// Must use require here as import statements are only allowed at the top of a file.
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require("preact/debug");

	// see profile_editor_provider.ts:DEBUG
	if(window['__PREACT_DEVTOOLS__']) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		(window as any).process = { env: { NODE_ENV: 'production' } };
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const { store } = setup.setupFrontendStore(window);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		store.theme.$ = 'dark';
		const devtools = document.createElement('div');
		devtools.style.position = 'absolute';
		devtools.style.width = '50%';
		devtools.style.zIndex = '999';
		devtools.style.height = '200px';
		devtools.style.overflow = 'auto';
		document.body.appendChild(devtools);
		setup.renderDevtools(store, devtools);
	}
}

import { render } from 'preact';
import styles from './client.module.css';
import { CpuProfileLayout } from './layout';
import { IProfileModel, buildModel, createLenses, GetMemory } from './model';
import { profileShrinkler, Stats } from '../backend/shrinkler';
import { VsCodeApi } from './vscodeApi';
import { ISetCodeLenses, ICpuProfileRaw, IErrorMessage, IAmigaProfileSplit } from './types';
import { DisplayUnit } from './display';
import { ObjdumpView } from './objdump';
import { SavestateView } from './savestate';

// from HTML page
declare const OBJDUMP: string;
declare const PROFILE_URL: string;
declare const SAVESTATE: string;
declare let PROFILES: ICpuProfileRaw[];
declare let MODELS: IProfileModel[];

let container: HTMLDivElement = null;

async function Profiler() {
	document.body.style.overflow = 'hidden';
	const loader = document.createElement('div');
	loader.setAttribute('class', styles.spinner);

	document.body.appendChild(loader);
	try {
		console.time('fetch');
		const response = await fetch(PROFILE_URL);
		console.timeEnd('fetch');
		if(!response.ok)
			throw new Error(`${response.status} ${response.statusText}`);
		console.time('json');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const obj = await response.json();
		console.timeEnd('json');

		if((obj as Stats).hunks) { // shrinklerstats
			console.log("Shrinkler");
			PROFILES = [ profileShrinkler(obj as Stats) ];
			MODELS.push(buildModel(PROFILES[0]));
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		} else if(obj['$id'] === 'IAmigaProfileSplit') {
			// split multi-frame profile
			const split = obj as IAmigaProfileSplit;
			PROFILES = [ split.firstFrame ];
			PROFILES[0].screenshot = split.screenshots[0];
			for(let i = 1; i < split.numFrames; i++) {
				// dummy
				PROFILES.push({ screenshot: split.screenshots[i], nodes: [], startTime: 0, endTime: 0 });
			}
			// build model for first profile
			MODELS.push(buildModel(PROFILES[0]));
		} else {
			// regular single or multi-frame profile
			PROFILES = obj as ICpuProfileRaw[];
			MODELS.push(buildModel(PROFILES[0]));
			for(let i = 1; i < PROFILES.length; i++) {
				const memory = GetMemory(MODELS[i-1].memory, PROFILES[i-1].$amiga.dmaRecords);
				MODELS.push(buildModel(PROFILES[i], memory));
			}
		}

		// TODO: set lenses when frame changed in layout.tsx
		if(MODELS[0].amiga) {
			const lenses = createLenses(MODELS[0], DisplayUnit.PercentFrame);
			VsCodeApi.postMessage<ISetCodeLenses>({
				type: 'setCodeLenses',
				lenses
			});
		}

		container = document.createElement('div');
		container.classList.add(styles.wrapper);
		document.body.appendChild(container);
		render(<CpuProfileLayout numFramesLoaded={1} />, container);

		// load rest of frames
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if(obj['$id'] === 'IAmigaProfileSplit') {
			console.time('extra frames');
			const split = obj as IAmigaProfileSplit;
			for(let i = 1; i < split.numFrames; i++) {
				const url = PROFILE_URL.replace('.amigaprofile', `_${i.toString().padStart(2, '0')}.amigaprofile`);
				console.time('fetch');
				const response = await fetch(url);
				console.timeEnd('fetch');
				console.time('json');
				PROFILES[i] = { screenshot: split.screenshots[i], ...await response.json() as ICpuProfileRaw };
				console.timeEnd('json');
				const memory = GetMemory(MODELS[i-1].memory, PROFILES[i-1].$amiga.dmaRecords);
				MODELS[i] = buildModel(PROFILES[i], memory);
				render(<CpuProfileLayout numFramesLoaded={i+1} />, container);
			}
			console.timeEnd('extra frames');
		}
	} catch(e) {
		if(container)
			container.remove();
		const error = document.createElement('div');
		error.setAttribute('class', styles.error);
		error.innerText = `Failed to load ${unescape(PROFILE_URL)}:\n${(e as Error).stack}`;
		document.body.appendChild(error);
	} finally {
		document.body.removeChild(loader);
	}
}

function Objdump() {
	document.body.style.paddingRight = '0px';
	container = document.createElement('div');
	container.classList.add(styles.wrapper);
	document.body.appendChild(container);
	render(<ObjdumpView />, container);
}

function Savestate() {
	container = document.createElement('div');
	container.classList.add(styles.wrapper);
	document.body.appendChild(container);
	render(<SavestateView />, container);
}

function TryProfiler() {
	try {
		if(PROFILE_URL) {
			console.log("Profile: " + PROFILE_URL);
			void Profiler();
			return true;
		}
	} catch(e) {}
	return false;
}

function TryObjdump() {
	try {
		if(OBJDUMP) {
			console.log("Objdump");
			void Objdump();
			return true;
		}
	} catch(e) {
		console.log((e as Error).message);
	}
	return false;
}

function TrySavestate() {
	try {
		if(SAVESTATE) {
			console.log("Savestate");
			void Savestate();
			return true;
		}
	} catch(e) {}
	return false;
}

// MAIN ENTRY POINT
console.log("client.tsx START: " + new Date().toLocaleString());

window.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
	VsCodeApi.postMessage<IErrorMessage>({
		type: 'error',
		text: 'Amiga Internal Error: ' + ((process.env.NODE_ENV === 'development') ? error.stack : error.message)
	});
};

// eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
TryProfiler() || TryObjdump() || TrySavestate();
