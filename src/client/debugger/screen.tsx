import { Fragment, FunctionComponent, JSX, h } from 'preact';
import { StateUpdater, useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { ToggleButton } from '../toggle-button';
import { Filter } from '../filter';
import { IZoomProps, ZoomCanvas } from "./zoomcanvas";
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
import { ICpuProfileRaw } from '../types';
import { CustomReadWrite, CustomRegisters } from '../customRegisters';
import { DmaCyclesToCpuCycles, GetAmigaColor, GetAmigaColorEhb, NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, displayHeight, displayLeft, displayTop, displayWidth, dmaTypes } from '../dma';
declare let PROFILES: ICpuProfileRaw[];
declare const MODELS: IProfileModel[];

interface DeniseState {
	screenshot: boolean;
	planes: boolean[];
	sprites: boolean[];
}

const DefaultDeniseState: DeniseState = {
	screenshot: false,
	planes: [true, true, true, true, true, true, true, true],
	sprites: [true, true, true, true, true, true, true, true],
};

enum PixelSource {
	unknown, // 0
	background,
	playfield1,
	playfield2,
	sprite0,
	sprite1,
	sprite2,
	sprite3,
	sprite4,
	sprite5,
	sprite6,
	sprite7,
	sprite01,
	sprite23,
	sprite45,
	sprite67,
}

interface DeniseZoomProps extends IZoomProps {
	pixelSources: Uint8Array;
	pixels: Uint8Array;
}

const DeniseZoomInfo: FunctionComponent<IZoomProps> = (props: DeniseZoomProps) => {
	if(props.x !== undefined && props.y !== undefined) {
		const hpos = (props.x >> 1) + 2;
		const vpos = props.y;
		const line = props.y;
		const cck = (props.x >> 2);
		const color = props.pixels?.at(props.y * NR_DMA_REC_HPOS * 4 + props.x);

		return <div>
			<dl>
				{props.pixelSources && <Fragment>
					<dt>Source</dt>
					<dd>{PixelSource[props.pixelSources.at(props.y * NR_DMA_REC_HPOS * 4 + props.x)]}</dd>
				</Fragment>}
				{color !== undefined && <Fragment>
					<dt>Color</dt>
					<dd>{color} ${color.toString(16).padStart(2, '0')} %{color.toString(2).padStart(8/*TODO*/, '0')}</dd>
				</Fragment>}
				<dt>Denise</dt>
				<dd>H:{hpos} V:{vpos}</dd>
				<dt>Agnus</dt>
				<dd>Line:{line} CCK:{cck}</dd>
			</dl>
		</div>;
	}
	return <div />;
};

const DeniseScreen: FunctionComponent<{
	scale?: number;
	frame: number;
	time: number;
	setTime?: StateUpdater<number>;
	state: DeniseState;
	dmaOpacity: number;
}> = ({ scale = 2, frame, time, setTime, state, dmaOpacity }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const dmaCanvas = useRef<HTMLCanvasElement>();
	const canvasScaleX = scale / 2;
	const canvasScaleY = scale;
	const canvasWidth = NR_DMA_REC_HPOS * 4 * canvasScaleX;
	const canvasHeight = NR_DMA_REC_VPOS * canvasScaleY;

	const zoomCanvasScale = 8;
	const zoomCanvasWidth = 144;
	const zoomCanvasHeight = 144;

	const [pixelSources, pixels, pixelsRgb, pixelsDma] = useMemo((): [Uint8Array, Uint8Array, Uint32Array, Uint32Array] => { // screen
		const pixelSources = new Uint8Array(NR_DMA_REC_HPOS * 4 * NR_DMA_REC_VPOS);
		const pixels = new Uint8Array(NR_DMA_REC_HPOS * 4 * NR_DMA_REC_VPOS);
		const pixelsRgb = new Uint32Array(canvasWidth * canvasHeight);
		const pixelsDma = new Uint32Array(canvasWidth * canvasHeight);
		const putDma = (x: number, y: number, rgb: number) => {
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX * 4; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX * 4 + xx);
					pixelsDma[offset] = rgb;
				}
			}
		};

		const putPixel = (x: number, y: number, color: number, rgb: number, source: PixelSource) => {
			pixelSources[x + y * NR_DMA_REC_HPOS * 4] = source;
			pixels[x + y * NR_DMA_REC_HPOS * 4] = color;
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX + xx);
					pixelsRgb[offset] = rgb;
				}
			}
		};
		// TODO: this is not time dependent, could be faster during scrubbing!

		// Dual playfield sample: http://www.powerprograms.nl/downloads/download-dplfb.html

		console.time('denise');

		// Denise emulator - see https://github.com/MiSTer-devel/Minimig-AGA_MiSTer/blob/MiSTer/rtl/denise.v
		let shifter = [0, 0, 0, 0, 0, 0, 0, 0];
		const scroller = [0, 0, 0, 0, 0, 0, 0, 0];
		const regDMACON = CustomRegisters.getCustomAddress("DMACON") - 0xdff000;
		const regBPLCON0 = CustomRegisters.getCustomAddress("BPLCON0") - 0xdff000;
		const regBPLCON1 = CustomRegisters.getCustomAddress("BPLCON1") - 0xdff000;
		const regBPLCON2 = CustomRegisters.getCustomAddress("BPLCON2") - 0xdff000;
		const regBPL1DAT = CustomRegisters.getCustomAddress("BPL1DAT") - 0xdff000;
		const regBPL2DAT = CustomRegisters.getCustomAddress("BPL2DAT") - 0xdff000;
		const regBPL3DAT = CustomRegisters.getCustomAddress("BPL3DAT") - 0xdff000;
		const regBPL4DAT = CustomRegisters.getCustomAddress("BPL4DAT") - 0xdff000;
		const regBPL5DAT = CustomRegisters.getCustomAddress("BPL5DAT") - 0xdff000;
		const regBPL6DAT = CustomRegisters.getCustomAddress("BPL6DAT") - 0xdff000;
		const regBPL7DAT = CustomRegisters.getCustomAddress("BPL7DAT") - 0xdff000;
		const regBPL8DAT = CustomRegisters.getCustomAddress("BPL8DAT") - 0xdff000;
		const regCOLOR00 = CustomRegisters.getCustomAddress("COLOR00") - 0xdff000;
		const regSTRHOR = CustomRegisters.getCustomAddress("STRHOR") - 0xdff000; // line 24-311
		const regSTRLONG = CustomRegisters.getCustomAddress("STRLONG") - 0xdff000; // probably only interlace
		const regSTREQU = CustomRegisters.getCustomAddress("STREQU") - 0xdff000; // line 0-7
		const regSTRVBL = CustomRegisters.getCustomAddress("STRVBL") - 0xdff000; // line 8-23, 312
		const regDIWSTRT = CustomRegisters.getCustomAddress("DIWSTRT") - 0xdff000;
		const regDIWSTOP = CustomRegisters.getCustomAddress("DIWSTOP") - 0xdff000;
		const regDIWHIGH = CustomRegisters.getCustomAddress("DIWHIGH"); // ECS

		const regSPR0POS = CustomRegisters.getCustomAddress("SPR0POS") - 0xdff000;
		const regSPR0CTL = CustomRegisters.getCustomAddress("SPR0CTL") - 0xdff000;
		const regSPR0DATA = CustomRegisters.getCustomAddress("SPR0DATA") - 0xdff000;
		const regSPR0DATB = CustomRegisters.getCustomAddress("SPR0DATB") - 0xdff000;
		const spriteStride = CustomRegisters.getCustomAddress("SPR1POS") - CustomRegisters.getCustomAddress("SPR0POS");

		interface Sprite {
			armed: boolean;
			hstart: number;
			attach: boolean;
			data: number;
			datb: number;
			shifta: number;
			shiftb: number;
		}

		const createSprite = (): Sprite => {
			return {
				armed: false,
				hstart: 0,
				attach: false,
				data: 0,
				datb: 0,
				shifta: 0,
				shiftb: 0
			};
		};

		const sprites = [createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite(), createSprite()];

		const customRegs = MODELS[frame].amiga.customRegs.slice(); // initial copy
		customRegs[regDMACON >>> 1] = MODELS[frame].amiga.dmacon;
	
		let vpos = -1;
		let hpos = 0;
		let hdiwstrt = 0, hdiwstop = 0;
		let scroll = [0, 0];
		let window = false;
		let prevColor = 0xff000000; // HAM
		for (let cycleY = 0; cycleY < NR_DMA_REC_VPOS; cycleY++) {
			for (let cycleX = 0; cycleX < NR_DMA_REC_HPOS; cycleX++) {
				// this is per 2 lores pixels
				const dmaRecord = MODELS[frame].amiga.dmaRecords[cycleY * NR_DMA_REC_HPOS + cycleX];
				if(!(dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)) {
					if(dmaRecord.reg === regDMACON) {
						if(dmaRecord.dat & 0x8000)
							customRegs[regDMACON >>> 1] |= dmaRecord.dat & 0x7FFF;
						else
							customRegs[regDMACON >>> 1] &= ~dmaRecord.dat;
					} else if(CustomRegisters.getCustomReadWrite(0xdff000 + dmaRecord.reg) & CustomReadWrite.write) {
						customRegs[dmaRecord.reg >>> 1] = dmaRecord.dat;
					}

					const dmaType = dmaRecord.type || 0;
					const dmaSubtype = (Object.keys(dmaTypes[dmaType].subtypes).length === 1) ? 0 : (dmaRecord.extra || 0);
					if(dmaType >= dmaTypes.length || !dmaTypes[dmaType].subtypes[dmaSubtype])
						continue;
					const dmaColor = dmaTypes[dmaType].subtypes[dmaSubtype].color;
					putDma(cycleX, cycleY, dmaColor);
				}
				// vpos, hpos - https://www.techtravels.org/2012/04/progress-on-amiga-vsc-made-this-weekend-vsync-problem-persists/ 
				// HPOS counter in Denise counts from 2 to 456, it uses clock CDAC#, when STRLONG is received, it stops counting during two CDAC# cycles.
				// HBLANK occurs between HPOS = 19 and HPOS = 97. HSYNC occurs between HPOS = 32 and HPOS = 65.
				if(dmaRecord.reg === regSTRHOR || dmaRecord.reg === regSTRVBL || dmaRecord.reg === regSTREQU) {
					hpos = 2;
					vpos++;
					window = false; // safety
					prevColor = 0xff000000; // HAM
				}

				// bpldat
				if(dmaRecord.reg === regBPL1DAT) {
					shifter = [customRegs[regBPL1DAT >>> 1], customRegs[regBPL2DAT >>> 1], customRegs[regBPL3DAT >>> 1], customRegs[regBPL4DAT >>> 1], customRegs[regBPL5DAT >>> 1], customRegs[regBPL6DAT >>> 1], customRegs[regBPL7DAT >>> 1], customRegs[regBPL8DAT >>> 1]];
					//if(cycleY === 100) console.log(` **** load scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')}`);
				}

				// sprites
				for(let i = 0; i < 8; i++) {
					if(dmaRecord.reg === regSPR0CTL + i * spriteStride) {
						sprites[i].armed = false;
						sprites[i].hstart = (dmaRecord.dat & 1) | (sprites[i].hstart & ~1);
						sprites[i].attach = (dmaRecord.dat & (1 << 7)) ? true : false;
					} else if(dmaRecord.reg === regSPR0POS + i * spriteStride) {
						sprites[i].hstart = ((dmaRecord.dat & 0xff) << 1) | (sprites[i].hstart & 1);
					} else if(dmaRecord.reg === regSPR0DATA + i * spriteStride) {
						sprites[i].armed = true;
						sprites[i].data = dmaRecord.dat;
					} else if(dmaRecord.reg === regSPR0DATB + i * spriteStride) {
						sprites[i].datb = dmaRecord.dat;
					}
				}

				// hdiwstrt
				if(dmaRecord.reg === regDIWSTRT)
					hdiwstrt = dmaRecord.dat & 0xff;
				if(dmaRecord.reg === regDIWSTOP)
					hdiwstop = (dmaRecord.dat & 0xff) | 0x100;
				if(dmaRecord.reg === regDIWHIGH) {
					hdiwstrt = (hdiwstrt & 0xff) | (dmaRecord.dat >>> 5) << 8;
					hdiwstop = (hdiwstop & 0xff) | (dmaRecord.dat >>> 13) << 8;
				}

				if(dmaRecord.reg === regBPLCON1)
					scroll = [dmaRecord.dat & 0xf, (dmaRecord.dat >>> 4) & 0xf];

				//const displayStart = 0x2c;
				//const lineStart = 29; // minimig: first visible line on PAL is 26
				const hires = (customRegs[regBPLCON0 >>> 1] & (1 << 15)) ? true : false;
				const numPlanes = (customRegs[regBPLCON0 >>> 1] >>> 12) & 0b111;
				const ham = (customRegs[regBPLCON0 >>> 1] & (1 << 11)) ? true : false;
				const dualPlayfield = (customRegs[regBPLCON0 >>> 1] & (1 << 10)) ? true : false;
				const ehb = numPlanes === 6 && !ham && !dualPlayfield;
				const playfield2Priority = (customRegs[regBPLCON2 >>> 1] & (1 << 6)) ? true : false;
				const scroll2 = hires ? [scroll[0] << 1, scroll[1] << 1] : scroll;

				// per pixel stuff in here!
				for(let q = 0; q < 2; q++) {
					// window
					if(hpos === hdiwstrt)
						window = true;
					if(hpos - 1 === hdiwstop)
						window = false;

					//if(cycleY === 100) console.log(`hpos:${hpos} cycleX:${cycleX} hdiwstrt:${hdiwstrt} hdiwstop:${hdiwstop} window: ${window} scroll_delayed: ${scroll_delayed[0]} ${scroll_delayed[1]}`);

					// shift sprites
					for(let i = 0; i < 8; i++) {
						if(sprites[i].armed && sprites[i].hstart === hpos) {
							sprites[i].shifta = sprites[i].data;
							sprites[i].shiftb = sprites[i].datb;
						} else {
							sprites[i].shifta = (sprites[i].shifta << 1) & 0xffff;
							sprites[i].shiftb = (sprites[i].shiftb << 1) & 0xffff;
						}
					}

					let sprsource = PixelSource.unknown;

					// sprite data
					const nsprite = [0, 0, 0, 0, 0, 0, 0, 0];
					for(let i = 0; i < 8; i++)
						nsprite[i] = ((sprites[i].shiftb & (1 << 15)) >>> 14) | ((sprites[i].shifta & (1 << 15)) >>> 15);
					// sprite priority
					let sprdata = 0;
					let sprcode = 7;
					let sprattach = false;
					for(let i = 0; i < 8; i += 2) {
						if(nsprite[i] || nsprite[i + 1]) {
							if(sprites[i].attach || sprites[i + 1].attach) {
								if(state.sprites[i])
									sprdata |= nsprite[i];
								if(state.sprites[i + 1])
									sprdata |= (nsprite[i + 1] << 2);
								if(sprdata)
									sprsource = PixelSource.sprite01 + (i >> 1);
								sprattach = true;
							} else if(nsprite[i] && state.sprites[i]) {
								sprdata = nsprite[i];
								if(sprdata)
									sprsource = PixelSource.sprite0 + i;
							} else if(state.sprites[i + 1]) {
								sprdata = nsprite[i + 1];
								if(sprdata)
									sprsource = PixelSource.sprite1 + i;
							}
							if(sprdata)
								sprcode = (i >> 1) + 1;
							break;
						}
					}
					const pf1front = sprcode > (customRegs[regBPLCON2 >>> 1] & 0b111) ? true : false;
					const pf2front = sprcode > ((customRegs[regBPLCON2 >>> 1] >>> 3) & 0b111) ? true : false;

					// per hires pixel
					for(let i = 0; i < 2; i++) {
						if(hires || i === 0) {
							// shift bitplanes
							for(let p = 0; p < 8; p++) {
								scroller[p] = ((scroller[p] << 1) | (shifter[p] >>> 15)) & 0xffff;
								shifter[p] = (shifter[p] << 1) & 0xffff;
							}
							//if(cycleY === 100) console.log(`     shift scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')}`);
						}

						//if(cycleY===100)console.log(`      draw scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')} ***${scroller[1] & (1 << scroll_delayed[0]) ? '1' : '0'}`);
						const swizzle = (src: number, bitFrom: number, bitTo: number): number => {
							return ((src >>> bitFrom) & 1) << bitTo;
						};

						let bpldata = 0;
						for(let p = 0; p < numPlanes; p++) {
							if((scroller[p] & (1 << scroll2[p & 1])) && state.planes[p])
								bpldata |= 1 << p;
						}

						let playfieldsource = PixelSource.unknown;
						let nplayfield = [false, false];
						if(dualPlayfield) {
							const playfield1 = (bpldata & 0b01010101) ? true : false;
							const playfield2 = (bpldata & 0b10101010) ? true : false;
							const pfdata = [
								swizzle(bpldata, 6, 3) | swizzle(bpldata, 4, 2) | swizzle(bpldata, 2, 1) | swizzle(bpldata, 0, 0), 
								swizzle(bpldata, 7, 2) | swizzle(bpldata, 5, 2) | swizzle(bpldata, 3, 1) | swizzle(bpldata, 1, 0)
							];
							nplayfield = [pfdata[0] ? true : false, pfdata[1] ? true : false];
							if(playfield2Priority) {
								if(playfield2) {
									bpldata = 0b1000 | pfdata[1];
									playfieldsource = PixelSource.playfield2;
								} else if(playfield1) {
									bpldata = pfdata[0];
									playfieldsource = PixelSource.playfield1;
								} else {
									bpldata = 0;
								}
							} else {
								if(playfield1) {
									bpldata = pfdata[0];
									playfieldsource = PixelSource.playfield1;
								} else if(playfield2) {
									bpldata = 0b1000 | pfdata[1];
									playfieldsource = PixelSource.playfield2;
								} else {
									bpldata = 0;
								}
							}
						} else {
							nplayfield = [false, bpldata ? true : false];
							playfieldsource = bpldata ? PixelSource.playfield2 : PixelSource.background;
						}

						// sprite<->playfields priority
						let sprsel = false;
						if(sprcode === 7)
							sprsel = false;
						else if(pf1front && nplayfield[0])
							sprsel = false;
						else if(pf2front && nplayfield[1])
							sprsel = false;
						else
							sprsel = true;

						if(sprsel) {
							if(sprattach)
								bpldata = 16 + sprdata;
							else
								bpldata = 16 + (sprcode - 1) * 4 + sprdata;
						}

						let color = GetAmigaColor(customRegs[(regCOLOR00 >>> 1)]); // 0xAABBGGRR
						if(ham) {
							// TODO: HAM8
							switch(bpldata >> 4) {
							case 0: // set
								color = 0xff000000 | GetAmigaColor(customRegs[(regCOLOR00 >>> 1) + (bpldata & 0xf)]);
								break;
							case 1: // modify blue
								color = (prevColor & ~0xff0000) | ((((bpldata & 0xf) << 4) | (bpldata & 0xf)) << 16);
								break;
							case 3: // modify green
								color = (prevColor & ~0x00ff00) | ((((bpldata & 0xf) << 4) | (bpldata & 0xf)) << 8);
								break;
							case 2: // modify red
								color = (prevColor & ~0x0000ff) | ((((bpldata & 0xf) << 4) | (bpldata & 0xf)) << 0);
								break;
							}
							prevColor = color;
						} else {
							if(ehb && (bpldata & (1 << 5)))
								color = GetAmigaColorEhb(customRegs[(regCOLOR00 >>> 1) + (bpldata & 0x1f)]); // no AGA yet
							else
								color = GetAmigaColor(customRegs[(regCOLOR00 >>> 1) + (bpldata & 0x1f)]); // no AGA yet
						}

						if(hpos - 2 >= displayLeft && vpos >= displayTop) {
							if(window && numPlanes)
								putPixel((hpos - 2) * 2 + i,         vpos, bpldata, color, sprsel ? sprsource : playfieldsource);
							else
								putPixel((hpos - 2) * 2 + i,         vpos, bpldata, 0, PixelSource.unknown);
						}
					}
					hpos++;
				}
			}
		}
		console.timeEnd('denise');
		return [pixelSources, pixels, pixelsRgb, pixelsDma];
	}, [scale, frame/*, time*/, state]);

	useEffect(() => {
		const context = canvas.current?.getContext('2d');
		if(state.screenshot && PROFILES[frame].$amiga.screenshot) {
			//width: 752, height: 574, // from WinUAE code
			const img = new Image();
			img.onload = () => {
				context.clearRect(0, 0, canvas.current.width, canvas.current.height);
				//console.log(`${img.width}x${img.height}`);
				context.drawImage(img, 0, 0, img.width * canvasScaleX, img.height * canvasScaleY / 2);
			};
			img.src = PROFILES[frame].$amiga.screenshot;
			return null;
		}

		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		data.set(pixelsRgb);
		context.putImageData(imgData, 0, 0);
	}, [canvas.current, pixelsRgb]);

	useEffect(() => {
		if(pixelsDma && dmaOpacity > 0) {
			const context = dmaCanvas.current?.getContext('2d');
			const imgData = context.createImageData(canvasWidth, canvasHeight);
			const data = new Uint32Array(imgData.data.buffer);
			data.set(pixelsDma);
			context.putImageData(imgData, 0, 0);
		}
	}, [dmaCanvas.current, pixelsDma]);

	const zoomClick = useCallback((x: number, y: number) => {
		const line = y;
		const cck = (x >> 2);
		const time = line * NR_DMA_REC_HPOS + cck;
		setTime(DmaCyclesToCpuCycles(time));
	}, [setTime]);

	return <Fragment>
		<div class={styles.screen}>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} class={styles.screen_canvas} data-canvasScaleX={canvasScaleX} data-canvasScaleY={canvasScaleY} />
			{dmaOpacity > 0 && <canvas class={styles.overdraw_canvas} style={{opacity: dmaOpacity}} ref={dmaCanvas} width={canvasWidth} height={canvasHeight} />}
			<ZoomCanvas canvas={canvas} scale={zoomCanvasScale} width={zoomCanvasWidth} height={zoomCanvasHeight} ZoomInfo={DeniseZoomInfo} zoomExtraProps={{ pixelSources, pixels }} onClick={zoomClick} />
		</div>
	</Fragment>;
};

export const DeniseView: FunctionComponent<{
	frame: number;
	time: number;
	setTime?: StateUpdater<number>;
}> = ({ frame, time, setTime }) => {
	const [state, setState] = useState<DeniseState>(DefaultDeniseState);

	const showAllPlanes = useCallback((checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.planes = [checked, checked, checked, checked, checked, checked, checked, checked];
			return neu;
		});
	}, [setState]);
	const showPlane = useCallback((index: number, checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.planes[index] = checked;
			return neu;
		});
	}, [setState]);

	const showAllSprites = useCallback((checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.sprites = [checked, checked, checked, checked, checked, checked, checked, checked];
			return neu;
		});
	}, [setState]);
	const showSprite = useCallback((index: number, checked: boolean) => {
		setState((prev: DeniseState) => {
			const neu = JSON.parse(JSON.stringify(prev)) as DeniseState;
			neu.sprites[index] = checked;
			return neu;
		});
	}, [setState]);

	const [dmaOpacity, setDmaOpacity] = useState(0);

	return (<Fragment>
		<div style={{ flexGrow: 0 }}>
		<Filter value="Placeholder (WIP)" onChange={(value: string) => { return; }} foot={<Fragment>
			<div>
				DMA&nbsp;Overlay</div><div><input style={{verticalAlign: 'bottom'}} type="range" min="0" max="100" value={dmaOpacity * 100} class="slider" onInput={({currentTarget}: JSX.TargetedEvent<HTMLInputElement, Event>) => setDmaOpacity(parseInt(currentTarget.value) / 100)} />
			</div>
			<ToggleButton icon="Bitplanes" label="Show Bitplanes" checked={state.planes.some((v) => v)} onChange={showAllPlanes} />
			{state.planes.map((value, index) => <ToggleButton icon={`${index + 1}`} label={`Show Bitplane ${index + 1}`} checked={value} onChange={(checked) => showPlane(index, checked)} />)}
			<span style={{ width: '1em' }}></span>
			<ToggleButton icon="Sprites" label="Show Sprites" checked={state.sprites.some((v) => v)} onChange={showAllSprites} />
			{state.sprites.map((value, index) => <ToggleButton icon={`${index}`} label={`Show Sprite ${index}`} checked={value} onChange={(checked) => showSprite(index, checked)} />)}
			<span style={{ width: '1em' }}></span>
			{PROFILES[frame].$amiga.screenshot?.length > 22 && <ToggleButton icon="Reference Screenshot" label="Show Reference Screenshot" checked={state.screenshot} onChange={(checked) => setState((prev: DeniseState) => ({ ...prev, screenshot: checked }))} />}
		</Fragment>} />
		</div>
		<div style={{ /*overflow: 'auto'*/ }}>
			<DeniseScreen frame={frame} time={time} setTime={setTime} state={state} dmaOpacity={dmaOpacity} />
		</div>
	</Fragment>);
};
