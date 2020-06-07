import { Fragment, FunctionComponent, h } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import styles from './copper.module.css';
import { IProfileModel } from '../model';
import { CustomRegisters } from './customRegisters';
import { NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, DmaEvents } from '../dma';
//import { CopperDisassembler } from './copperDisassembler';

export const BlitterVis: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	// TODO (WinUAE): we need state of custom registers at start of frame as well......
	const customRegs = new Uint16Array(model.customRegs);
	const BLTxPT = [
		CustomRegisters.getCustomAddress("BLTAPT"),
		CustomRegisters.getCustomAddress("BLTBPT"),
		CustomRegisters.getCustomAddress("BLTCPT"),
		CustomRegisters.getCustomAddress("BLTDPT")
	];
	const BLTCON0 = CustomRegisters.getCustomAddress("BLTCON0");
	const BLTSIZE = CustomRegisters.getCustomAddress("BLTSIZE");
	const BLTSIZV = CustomRegisters.getCustomAddress("BLTSIZV");
	const BLTSIZH = CustomRegisters.getCustomAddress("BLTSIZH");
	let BlitTrace = "";

	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS - ((y % 2) ? 1 : 0); x++, i++) { // long and short lines alternate
			const dmaRecord = model.dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.reg !== undefined && dmaRecord.reg < 0x200) {
				customRegs[dmaRecord.reg >>> 1] = dmaRecord.dat;
				const isBlitStart = (dmaRecord.reg === BLTSIZE - 0xdff000) || (dmaRecord.reg === BLTSIZH - 0xdff000);
				if(isBlitStart) {
					if(dmaRecord.reg === BLTSIZE - 0xdff000) {
						BlitTrace += `Line ${y.toString().padStart(3, ' ')} Cycle ${x.toString().padStart(3, ' ')}: BLTSIZE = ${((dmaRecord.dat & 0x3f) * 16).toString().padStart(4, ' ')}x${(dmaRecord.dat >>> 6).toString().padStart(4, ' ')}; `;
					}
					if(dmaRecord.reg === BLTSIZH - 0xdff000) {
						BlitTrace += `Line ${y.toString().padStart(3, ' ')} Cycle ${x.toString().padStart(3, ' ')}: BLTSIZE = ${((dmaRecord.dat & 0x7ff) * 16).toString().padStart(4, ' ')}x${(customRegs[(BLTSIZV - 0xdff000) >>> 1] & 0x7fff).toString().padStart(4, ' ')}; `;
					}
					const bltcon0 = customRegs[(BLTCON0 - 0xdff000) >>> 1];
					let channels = '';
					const addresses: string[] = [];
					for(let b = 0; b < 4; b++) {
						if(bltcon0 & (1 << (11 - b))) {
							channels += 'ABCD'[b];
							const adr = (customRegs[(BLTxPT[b] - 0xdff000) >>> 1] << 16) | customRegs[(BLTxPT[b] + 2 - 0xdff000) >>> 1];
							addresses.push('ABCD'[b] + ' = $' + adr.toString(16).padStart(8, '0'));
						} else {
							channels += '-';
							addresses.push('             ');
						}
					}
					BlitTrace += `${channels} ${addresses.join(' ')}\n`;
				}
			}
			if(dmaRecord.evt & DmaEvents.BLITIRQ) {
				BlitTrace += `Line ${y.toString().padStart(3, ' ')} Cycle ${x.toString().padStart(3, ' ')}: BLITIRQ\n`;
			}
		}
	}

	return (
		<Fragment>
			<div class={styles.container}>{BlitTrace}</div>
		</Fragment>
	);
};
