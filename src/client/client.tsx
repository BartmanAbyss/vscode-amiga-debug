import { h, render } from 'preact';
import styles from './client.module.css';
import { CpuProfileLayout } from './layout';
import { IProfileModel } from './model';
import { Memory } from './dma';

declare const MODEL: IProfileModel;
if(MODEL.amiga) {
	MODEL.duration = Math.max(7_093_790 / 50, MODEL.duration); // DMA TEST
	const chipMem = Uint8Array.from(atob(MODEL.amiga.chipMem), (c) => c.charCodeAt(0));
	const bogoMem = Uint8Array.from(atob(MODEL.amiga.bogoMem), (c) => c.charCodeAt(0));
	MODEL.memory = new Memory(chipMem, bogoMem);
}

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);

// FLAME+TABLE
render(<CpuProfileLayout model={MODEL}/>, container);
