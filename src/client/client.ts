if (process.env.NODE_ENV === 'development') {
	// Must use require here as import statements are only allowed to exist at the top of a file.
	// tslint:disable-next-line: no-var-requires
	require("preact/debug");
}
import { h, render } from 'preact';
import styles from './client.module.css';
import { CpuProfileLayout } from './layout';
import { IProfileModel, buildModel, createLenses } from './model';
import { profileShrinkler } from '../backend/shrinkler';
import { VsCodeApi } from './vscodeApi';
import { ISetCodeLenses, ICpuProfileRaw } from './types';
import { DisplayUnit } from './display';
import { ObjdumpView } from './objdump';

// from HTML page
declare const OBJDUMP: string;
declare const PROFILE_URL: string;
declare let PROFILES: ICpuProfileRaw[];
declare let MODELS: IProfileModel[];

async function Profiler() {
	document.body.style.overflow = 'hidden';
	const loader = document.createElement('div');
	loader.setAttribute('class', styles.spinner);

	document.body.appendChild(loader);
	let container:HTMLDivElement = null;
	try {
		console.time('fetch+json');
		const response = await fetch(PROFILE_URL);
		PROFILES = await response.json();
		console.timeEnd('fetch+json');

		if((PROFILES as any).hunks) { // shrinklerstats
			console.log("Shrinkler");
			PROFILES = [ profileShrinkler(PROFILES as any) ];
		}

		// build model for first profile
		MODELS.push(buildModel(PROFILES[0]));

		// add dummy models for rest of profiles
		// will be built in layout.tsx as needed
		for(let i = 1; i < PROFILES.length; i++)
			MODELS.push(null);
			//MODELS.push(buildModel(PROFILES[i]));

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
		render(h(CpuProfileLayout, null), container);
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

async function Objdump() {
	document.body.style.paddingRight = '0px';
	const container = document.createElement('div');
	container.classList.add(styles.wrapper);
	document.body.appendChild(container);
	render(h(ObjdumpView, null), container);
}

function TryProfiler() {
	try {
		if(PROFILE_URL) {
			console.log("Profile: " + PROFILE_URL);
			Profiler();
			return true;
		}
	} catch(e) {}
	return false;
}

function TryObjdump() {
	try {
		if(OBJDUMP) {
			console.log("Objdump");
			Objdump();
			return true;
		}
	} catch(e) {}
	return false;
}

// MAIN ENTRY POINT
console.log("client.tsx START: " + new Date().toLocaleString());

if(!TryProfiler())
	TryObjdump();
