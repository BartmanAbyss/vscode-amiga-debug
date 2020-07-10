if (process.env.NODE_ENV === 'development') {
	// Must use require here as import statements are only allowed to exist at the top of a file.
	// tslint:disable-next-line: no-var-requires
	require("preact/debug");
}
import { h, render } from 'preact';
import styles from './client.module.css';
import { CpuProfileLayout } from './layout';
import { IProfileModel, buildModel, createLenses } from './model';
import { Memory, GetBlits } from './dma';
import { profileShrinkler } from '../backend/shrinkler';
import { VsCodeApi } from './vscodeApi';
import { ISetCodeLenses } from './types';
import { DisplayUnit } from './display';

console.log("client.tsx START: " + new Date().toLocaleString());

// from HTML page
declare const PROFILE_URL: string;
declare let MODELS: IProfileModel[];

(async () => {
	const loader = document.createElement('div');
	loader.setAttribute('class', styles.spinner);

	document.body.appendChild(loader);
	{
		const response = await fetch(PROFILE_URL);
		let PROFILES = await response.json();
		if(PROFILES.hunks) { // shrinklerstats
			PROFILES = [ profileShrinkler(PROFILES) ];
		}
		for(const p of PROFILES)
			MODELS.push(buildModel(p));

		for(const MODEL of MODELS) {
			if (MODEL.amiga) {
				MODEL.duration = 7_093_790 / 50; // DMA TEST
				// decode memory to binary
				const chipMem = Uint8Array.from(atob(MODEL.amiga.chipMem), (c) => c.charCodeAt(0));
				const bogoMem = Uint8Array.from(atob(MODEL.amiga.bogoMem), (c) => c.charCodeAt(0));
				MODEL.memory = new Memory(chipMem, bogoMem);
				// get blits
				const customRegs = new Uint16Array(MODEL.amiga.customRegs);
				MODEL.blits = GetBlits(customRegs, MODEL.amiga.dmaRecords);
			}
		}

		// TODO: set lenses when frame changed in layout.tsx
		if(MODELS[0].amiga) {
			const lenses = createLenses(MODELS[0], DisplayUnit.PercentFrame);
			console.log(lenses);
			VsCodeApi.postMessage<ISetCodeLenses>({
				type: 'setCodeLenses',
				lenses
			});
		}
	}
	document.body.removeChild(loader);

	const container = document.createElement('div');
	container.classList.add(styles.wrapper);
	document.body.appendChild(container);
	
	// FLAME+TABLE
	render(<CpuProfileLayout />, container);
})();
