import { h, render } from 'preact';
import styles from './client.module.css';
import { CpuProfileLayout } from './layout';
import { IProfileModel } from './model';

declare const MODEL: IProfileModel;
if(MODEL.amiga) {
	MODEL.duration = Math.max(7_093_790 / 50, MODEL.duration); // DMA TEST
	MODEL.chipMemCache = Uint8Array.from(atob(MODEL.amiga.chipMem), (c) => c.charCodeAt(0));
}

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);

// FLAME+TABLE
render(<CpuProfileLayout model={MODEL}/>, container);
