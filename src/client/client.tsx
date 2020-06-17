if (process.env.NODE_ENV === 'development') {
	// Must use require here as import statements are only allowed to exist at the top of a file.
	// tslint:disable-next-line: no-var-requires
	require("preact/debug");
}
import { h, render } from 'preact';
import styles from './client.module.css';
import { CpuProfileLayout } from './layout';
import { IProfileModel } from './model';
import { Memory, GetBlits } from './dma';

console.log("client.tsx START: " + new Date().toLocaleString());

declare const MODEL: IProfileModel;
if (MODEL.amiga) {
	MODEL.duration = Math.max(7_093_790 / 50, MODEL.duration); // DMA TEST
	// decode memory to binary
	const chipMem = Uint8Array.from(atob(MODEL.amiga.chipMem), (c) => c.charCodeAt(0));
	const bogoMem = Uint8Array.from(atob(MODEL.amiga.bogoMem), (c) => c.charCodeAt(0));
	MODEL.memory = new Memory(chipMem, bogoMem);
	// get blits
	const customRegs = new Uint16Array(MODEL.amiga.customRegs);
	MODEL.blits = GetBlits(customRegs, MODEL.amiga.dmaRecords);
}

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);

// FLAME+TABLE
render(<CpuProfileLayout />, container);
