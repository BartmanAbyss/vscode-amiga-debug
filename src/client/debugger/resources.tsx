import { Fragment, FunctionComponent, h, JSX, createContext } from 'preact';
import { StateUpdater, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../styles.css';
import styles from './resources.module.css';

import { IProfileModel } from '../model';
import { ICpuProfileRaw } from '../types';
declare let PROFILES: ICpuProfileRaw[];
declare const MODELS: IProfileModel[];

import { CustomReadWrite, CustomRegisters } from '../customRegisters';
import { GetMemoryAfterDma, GetPaletteFromCustomRegs, IScreen, GetScreenFromCopper, GetPaletteFromMemory, GetPaletteFromCopper, BlitterChannel, NR_DMA_REC_VPOS, NR_DMA_REC_HPOS, GetCustomRegsAfterDma, CpuCyclesToDmaCycles, GetColorCss, GetAmigaColor, DmaCyclesToCpuCycles, GetAmigaColorEhb, ScreenType } from '../dma';
import { GfxResourceType, GfxResource, GfxResourceFlags } from '../../backend/profile_types';
import { createPortal } from 'preact/compat';

import { DropdownComponent, DropdownOptionProps } from '../dropdown';
import '../dropdown.css';

// https://stackoverflow.com/a/54014428
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsl2rgb(h: number, s: number, l: number) {
	const a = s * Math.min(l, 1 - l);
	const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [f(0), f(8), f(4)];
}

// measured in resource viewer
const displayLeft = 92;
const displayTop = 28;

export const Screen: FunctionComponent<{
	screen: IScreen;
	mask?: IScreen;
	palette: number[];
	flags?: GfxResourceFlags;
	scale?: number;
	useZoom?: boolean;
	frame: number;
	time: number;
	setTime?: StateUpdater<number>;
	overlay?: string;
}> = ({ screen, mask, palette, flags = 0, scale = 2, useZoom = true, frame, time, setTime, overlay = '' }) => {
	const canvas = useRef<HTMLCanvasElement>();
	const canvasScaleX = screen.hires ? scale / 2 : scale;
	const canvasScaleY = screen.type === ScreenType.screenshot ? scale / 2 : scale;
	const canvasWidth = screen.width * canvasScaleX;
	const canvasHeight = screen.height * canvasScaleY;

	const zoomDiv = useRef<HTMLDivElement>();
	const zoomCanvas = useRef<HTMLCanvasElement>();
	const zoomCanvasScale = 8;
	const zoomCanvasWidth = 144;
	const zoomCanvasHeight = 144;

	const overdrawCanvas = useRef<HTMLCanvasElement>();

	interface BlitRect {
		left: number;
		top: number;
		width: number;
		height: number;
		active: boolean;
	}

	interface ZoomInfo {
		x?: number;
		y?: number;
		color?: number;
		mask?: number;
		// denise
		hpos?: number;
		vpos?: number;
		// agnus
		line?: number;
		cck?: number;
	}
	const [zoomInfo, setZoomInfo] = useState<ZoomInfo>({});

	const memory = useMemo(() => GetMemoryAfterDma(MODELS[frame].memory, MODELS[frame].amiga.dmaRecords, CpuCyclesToDmaCycles(time)), [time, frame]);

	const getPixel = useMemo(() => (scr: IScreen, x: number, y: number): number => {
		let pixel = 0;
		for (let p = 0; p < scr.planes.length; p++) {
			const addr = scr.planes[p] + y * (scr.width / 8 + scr.modulos[p & 1]) + Math.floor(x / 8);
			const raw = memory.readByte(addr);
			if (raw & (1 << (7 - (x & 7))))
				pixel |= 1 << p;
		}
		return pixel;
	}, [memory]);

	useEffect(() => { // screen
		const context = canvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);
		const putPixel = (x: number, y: number, color: number) => {
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX + xx);
					data[offset] = color;
				}
			}
		};
		if(screen.type === ScreenType.denise) {
			// TODO: this is not time dependent, could be faster during scrubbing!

			// video emulator - see https://github.com/MiSTer-devel/Minimig-AGA_MiSTer/blob/MiSTer/rtl/denise.v
			let shifter = [0, 0, 0, 0, 0, 0, 0, 0];
			let scroller = [0, 0, 0, 0, 0, 0, 0, 0];
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
						shifter = [customRegs[regBPL1DAT >>> 1], customRegs[regBPL2DAT >>> 1], customRegs[regBPL3DAT >>> 1], customRegs[regBPL4DAT >>> 1], customRegs[regBPL5DAT >>> 1], customRegs[regBPL6DAT >>> 1], customRegs[regBPL7DAT >>> 1]];
						//if(cycleY === 100) console.log(` **** load scroller[1]: ${scroller[1].toString(2).padStart(16, '0')} shifter[1]: ${shifter[1].toString(2).padStart(16, '0')}`);
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
					const scroll_delayed = hires? [scroll[0] << 1, scroll[1] << 1] : scroll;

					for(let q = 0; q < 2; q++) {
						// window
						if(hpos === hdiwstrt)
							window = true;
						if(hpos - 1 === hdiwstop)
							window = false;

						//if(cycleY === 100) console.log(`hpos:${hpos} cycleX:${cycleX} hdiwstrt:${hdiwstrt} hdiwstop:${hdiwstop} window: ${window} scroll_delayed: ${scroll_delayed[0]} ${scroll_delayed[1]}`);

						for(let i = 0; i < 2; i++) {
							if(hires || i === 0) {
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
								if(scroller[p] & (1 << scroll_delayed[p & 1]))
									bpldata |= 1 << p;
							}

							if(dualPlayfield) {
								const playfield1 = (bpldata & 0b01010101) ? true : false;
								const playfield2 = (bpldata & 0b10101010) ? true : false;
								if(playfield2Priority) {
									if(playfield2)
										bpldata = 0b1000                 | swizzle(bpldata, 5, 2) | swizzle(bpldata, 3, 1) | swizzle(bpldata, 1, 0);
									else if(playfield1)
										bpldata = swizzle(bpldata, 6, 3) | swizzle(bpldata, 4, 2) | swizzle(bpldata, 2, 1) | swizzle(bpldata, 0, 0);
									else
										bpldata = 0;
								} else {
									if(playfield1)
										bpldata = swizzle(bpldata, 6, 3) | swizzle(bpldata, 4, 2) | swizzle(bpldata, 2, 1) | swizzle(bpldata, 0, 0);
									else if(playfield2)
										bpldata = 0b1000                 | swizzle(bpldata, 5, 2) | swizzle(bpldata, 3, 1) | swizzle(bpldata, 1, 0);
									else
										bpldata = 0;
								}
							}

							let color = palette[0]; // 0xAABBGGRR

							if(ham) {
								// TODO: HAM8
								switch(bpldata >> 4) {
								case 0: // set
									color = 0xff000000 | customRegs[(regCOLOR00 >>> 1) + (bpldata & 0xf)];
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
									putPixel((hpos - 2 - displayLeft) * 2 + i,         vpos - displayTop, color);
								else
									putPixel((hpos - 2 - displayLeft) * 2 + i,         vpos - displayTop, 0);
							}
						}
						hpos++;
					}
				}
			}
			context.putImageData(imgData, 0, 0);
		} else if(screen.type === ScreenType.screenshot) {
			if(PROFILES[frame].$amiga.screenshot) {
				const img = new Image();
				img.onload = () => {
					console.log(`${img.width}x${img.height}`);
					context.drawImage(img, 0, 0, img.width * canvasScaleX, img.height * canvasScaleY);
				};
				img.src = PROFILES[frame].$amiga.screenshot;
			}
		} else {
			const planes = [...screen.planes];
			const maskPlanes = [...mask?.planes ?? []];
			for (let y = 0; y < screen.height; y++) {
				let prevColor = 0xff000000; // 0xAABBGGRR
				for (let x = 0; x < screen.width / 16; x++) {
					for (let i = 0; i < 16; i++) {
						let pixel = 0;
						let pixelMask = 0xffff;
						for (let p = 0; p < planes.length; p++) {
							const addr = planes[p] + x * 2;
							const raw = memory.readWord(addr);
							if ((raw & (1 << (15 - i))))
								pixel |= 1 << p;
						}
						if (mask) {
							for (let p = 0; p < maskPlanes.length; p++) {
								const addr = maskPlanes[p] + x * 2;
								const raw = memory.readWord(addr);
								if ((raw & (1 << (15 - i))))
									pixelMask |= 1 << p;
							}
							pixel &= pixelMask;
							putPixel(x * 16 + i, y, pixel ? palette[pixel] : 0); // color 0 is transparent
						} else {
							if(flags & GfxResourceFlags.bitmap_ham) {
								let color = palette[0]; // 0xAABBGGRR
								switch(pixel >> 4) {
								case 0: // set
									color = palette[pixel & 0xf];
									break;
								case 1: // modify blue
									color = (prevColor & ~0xff0000) | ((((pixel & 0xf) << 4) | (pixel & 0xf)) << 16);
									break;
								case 3: // modify green
									color = (prevColor & ~0x00ff00) | ((((pixel & 0xf) << 4) | (pixel & 0xf)) << 8);
									break;
								case 2: // modify red
									color = (prevColor & ~0x0000ff) | ((((pixel & 0xf) << 4) | (pixel & 0xf)) << 0);
									break;
								}
								putPixel(x * 16 + i, y, color);
								prevColor = color;
							} else {
								putPixel(x * 16 + i, y, palette[pixel]);
							}
						}
					}
				}
				for (let p = 0; p < planes.length; p++) {
					planes[p] += screen.width / 8 + screen.modulos[p & 1];
				}
				if (mask) {
					for (let p = 0; p < maskPlanes.length; p++) {
						maskPlanes[p] += mask.width / 8 + mask.modulos[p & 1];
					}
				}
			}
			context.putImageData(imgData, 0, 0);
		}
	}, [canvas.current, scale, screen, mask, frame, time]);

	useEffect(() => { // overdraw
		if(overlay !== 'overdraw')
			return;
		if(!screen.planes.length) // don't support Denise emu yet
			return;

		const context = overdrawCanvas.current?.getContext('2d');
		const imgData = context.createImageData(canvasWidth, canvasHeight);
		const data = new Uint32Array(imgData.data.buffer);

		const overdrawWidth = screen.width / 8;
		const overdrawHeight = screen.height;
		const overdraw = new Uint16Array(overdrawWidth * overdrawHeight);
		let i = 0;
		const dmaTime = CpuCyclesToDmaCycles(time);
		for (let cycleY = 0; cycleY < NR_DMA_REC_VPOS && i < dmaTime; cycleY++) {
			for (let cycleX = 0; cycleX < NR_DMA_REC_HPOS && i < dmaTime; cycleX++, i++) {
				const dmaRecord = MODELS[frame].amiga.dmaRecords[cycleY * NR_DMA_REC_HPOS + cycleX];
				if (dmaRecord.addr === undefined || dmaRecord.addr === 0xffffffff)
					continue;

				const [x, y] = (() => {
					for (let p = 0; p < screen.planes.length; p++) {
						const plane = screen.planes[p];
						const screenLineSize = screen.width / 8 + screen.modulos[p & 1];
						for (let y = 0; y < screen.height; y++) {
							if (dmaRecord.addr >= plane + y * screenLineSize && dmaRecord.addr < plane + y * screenLineSize + screen.width / 8) {
								const x = Math.floor((dmaRecord.addr - plane) % screenLineSize);
								return [x, y];
							}
						}
						return [-1, -1];
					}
				})();
				if (x === -1 || y === -1)
					continue;

				let numBytes = 0;
				if ((dmaRecord.reg & 0x1100) === 0x1100) { // CPU write
					switch (dmaRecord.reg & 0xff) {
					case 1: numBytes = 1; break;
					case 2: numBytes = 2; break;
					case 4: numBytes = 4; break;
					}
				} else if (dmaRecord.reg === 0) { // Blitter write
					numBytes = 2;
				}

				for (let q = 0; q < numBytes; q++)
					overdraw[y * overdrawWidth + x + q]++;
			}
		}
		const put8Pixels = (x: number, y: number, color: number) => {
			for (let yy = 0; yy < canvasScaleY; yy++) {
				for (let xx = 0; xx < canvasScaleX * 8; xx++) {
					const offset = (((y * canvasScaleY + yy) * canvasWidth) + x * canvasScaleX + xx);
					data[offset] = color;
				}
			}
		};

		const overdrawPalette: number[] = [0];
		for (let i = 1; i <= 240; i++) {
			const color = hsl2rgb(240 - i, 1, 0.5);
			overdrawPalette.push(0xa0000000 | ((color[2] * 255) << 16) | ((color[1] * 255) << 8) | ((color[0] * 255) << 0)); // 0xAABBGGRR
		}

		for (let y = 0; y < overdrawHeight; y++) {
			for (let x = 0; x < overdrawWidth; x++) {
				const idx = Math.max(0, Math.min(240, overdraw[y * overdrawWidth + x] * 48));
				put8Pixels(x * 8, y, overdrawPalette[idx]);
			}
		}

		context.putImageData(imgData, 0, 0);
	}, [overdrawCanvas.current, scale, screen, frame, time, overlay]);

	const blitRects = useMemo(() => { // blitter rects
		const blitRects: BlitRect[] = [];

		if(overlay !== 'blitrects')
			return blitRects;

		if(!screen.planes.length) // don't support Denise emu yet
			return;

		const dmaTime = CpuCyclesToDmaCycles(time);
		for(const blit of MODELS[frame].blits) {
			if (blit.cycleStart > dmaTime)
				break;

			// is this blit affecting our screen?
			const dest = blit.BLTxPT[BlitterChannel.D];
			// get top-left corner of blit
			const [x, y] = (() => {
				for (let p = 0; p < screen.planes.length; p++) {
					const plane = screen.planes[p];
					const screenLineSize = screen.width / 8 + screen.modulos[p & 1];
					if (dest >= plane && dest < plane + screen.height * screenLineSize) {
						const y = Math.floor((dest - plane) / screenLineSize);
						const x = Math.floor((dest - plane) % screenLineSize) * 8;
						return [x, y];
					}
					return [-1, -1];
				}
			})();
			if (x === -1 || y === -1)
				continue;

			blitRects.push({ left: x, top: y, width: blit.BLTSIZH * 16, height: Math.floor(blit.BLTSIZV / screen.planes.length), active: blit.cycleEnd > dmaTime });
		}
		return blitRects;
	}, [screen, frame, time, overlay]);

	const onMouseMove = useCallback((evt: MouseEvent) => {
		if (!useZoom)
			return;
		const snapX = (p: number) => Math.floor(p / canvasScaleX) * canvasScaleX;
		const snapY = (p: number) => Math.floor(p / canvasScaleY) * canvasScaleY;
		const context = zoomCanvas.current?.getContext('2d');
		context.imageSmoothingEnabled = false;
		context.clearRect(0, 0, zoomCanvasWidth, zoomCanvasHeight);
		const srcWidth = zoomCanvasWidth / zoomCanvasScale;
		const srcHeight = zoomCanvasHeight / zoomCanvasScale;
		context.drawImage(canvas.current, snapX(evt.offsetX) - srcWidth / 2, snapY(evt.offsetY) - srcHeight / 2, srcWidth, srcHeight, 0, 0, zoomCanvasWidth, zoomCanvasHeight);
		context.lineWidth = 2;
		context.strokeStyle = 'rgba(0,0,0,1)';
		context.strokeRect((zoomCanvasWidth - zoomCanvasScale * canvasScaleX) / 2 + zoomCanvasScale,     (zoomCanvasHeight - zoomCanvasScale * canvasScaleY) / 2 + zoomCanvasScale,     zoomCanvasScale * canvasScaleX, zoomCanvasScale * canvasScaleY);
		context.strokeStyle = 'rgba(255,255,255,1)';
		context.strokeRect((zoomCanvasWidth - zoomCanvasScale * canvasScaleX) / 2 + zoomCanvasScale - 2, (zoomCanvasHeight - zoomCanvasScale * canvasScaleY) / 2 + zoomCanvasScale - 2, zoomCanvasScale * canvasScaleX + 4, zoomCanvasScale * canvasScaleY + 4);
		const srcX = Math.floor(evt.offsetX / canvasScaleX);
		const srcY = Math.floor(evt.offsetY / canvasScaleY);
		const zoomInfo: ZoomInfo = { 
			x: srcX, 
			y: srcY, 
		};
		if(screen.planes.length) { 
			zoomInfo.color = getPixel(screen, srcX, srcY);
			zoomInfo.mask = mask ? getPixel(mask, srcX, srcY) : undefined;
		} else { // Denise emu
			zoomInfo.hpos = (srcX >> 1) + 2 + displayLeft;
			zoomInfo.vpos = srcY + displayTop;
			zoomInfo.line = srcY + displayTop;
			zoomInfo.cck = (srcX >> 2) + (displayLeft >> 1);
		}
		setZoomInfo(zoomInfo);

		// position zoomCanvas
		zoomDiv.current.style.top = `${snapY(evt.offsetY) + 10}px`;
		zoomDiv.current.style.left = `${snapX(evt.offsetX) + 10}px`;
		zoomDiv.current.style.display = 'block';
	}, [canvas.current, zoomCanvas.current, scale, screen, mask, useZoom, time]);

	const onMouseDown = useCallback((evt: MouseEvent) => {
		if(!useZoom || screen.planes.length)
			return;
		const srcX = Math.floor(evt.offsetX / canvasScaleX);
		const srcY = Math.floor(evt.offsetY / canvasScaleY);
		const line = srcY + displayTop;
		const cck = (srcX >> 2) + (displayLeft >> 1);
		const time = line * NR_DMA_REC_HPOS + cck;
		setTime(DmaCyclesToCpuCycles(time));
	}, [scale, screen, useZoom, setTime]);

	const onMouseLeave = useCallback((evt: MouseEvent) => {
		if (!useZoom)
			return;
		zoomDiv.current.style.display = 'none';
	}, [useZoom, zoomDiv.current]);

	return <Fragment>
		<div class={styles.screen}>
			<canvas ref={canvas} width={canvasWidth} height={canvasHeight} class={styles.screen_canvas} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onMouseDown={onMouseDown} />
			{overlay === 'overdraw' && <canvas class={styles.overdraw_canvas} ref={overdrawCanvas} width={canvasWidth} height={canvasHeight} />}
			{blitRects.map((blitRect) =>
				<div class={blitRect.active ? styles.blitrect_active : styles.blitrect}
					style={{ left: blitRect.left * canvasScaleX, top: blitRect.top * canvasScaleY, width: blitRect.width * canvasScaleX, height: blitRect.height * canvasScaleY }} />
			)}
			{useZoom && <div ref={zoomDiv} class={styles.zoom} style={{ display: 'none' }}>
				<canvas ref={zoomCanvas} width={zoomCanvasWidth} height={zoomCanvasHeight} />
				{zoomInfo.x !== undefined && <div>
					<dl>
						<dt>Pos</dt>
						<dd>X:{zoomInfo.x} Y:{zoomInfo.y}</dd>
						{zoomInfo.color !== undefined && <Fragment>
							<dt>Color</dt>
							<dd>{zoomInfo.color} ${zoomInfo.color.toString(16).padStart(2, '0')} %{zoomInfo.color.toString(2).padStart(screen.planes.length, '0')}</dd>
							{mask !== undefined && zoomInfo.mask !== undefined && <Fragment>
								<dt>Mask</dt>
								<dd>{zoomInfo.mask} ${zoomInfo.mask.toString(16).padStart(2, '0')} %{zoomInfo.mask.toString(2).padStart(mask.planes.length, '0')}</dd>
							</Fragment>}
						</Fragment>}
						{zoomInfo.hpos !== undefined && <Fragment>
							<dt>Denise</dt>
							<dd>H:{zoomInfo.hpos} V:{zoomInfo.vpos}</dd>
						</Fragment>}
						{zoomInfo.line !== undefined && <Fragment>
							<dt>Agnus</dt>
							<dd>Line:{zoomInfo.line} CCK:{zoomInfo.cck}</dd>
						</Fragment>}
					</dl>
				</div>}
			</div>}
		</div>
	</Fragment>;
};

interface GfxResourceWithPayload {
	resource: GfxResource;
	frame: number;
	screen?: IScreen;
	mask?: IScreen;
	palette?: number[];
}

const GfxResourceItem: FunctionComponent<DropdownOptionProps<GfxResourceWithPayload>> = ({ option, placeholder }) => {
	const resource = option.resource;

	const [hover, setHover] = useState<{ x: number; y: number }>({ x: -1, y: -1 });

	const onMouseEnter = (evt: JSX.TargetedMouseEvent<HTMLDivElement>) => {
		const rect = evt.currentTarget.parentElement.parentElement.getBoundingClientRect();
		setHover({ x: rect.right + 5, y: rect.top + 5 });
	};
	const onMouseLeave = () => {
		setHover({ x: -1, y: -1 });
	};

	return (<Fragment>
		<div class={placeholder ? styles.gfxresource_brief : styles.gfxresource} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<dt>{resource.name}</dt>
			<dd>
				{resource.type === GfxResourceType.bitmap && (<Fragment>
					{resource.bitmap.width}x{resource.bitmap.height}x{resource.bitmap.numPlanes}
					&nbsp;
					{resource.flags & GfxResourceFlags.bitmap_interleaved ? 'I' : ''}
					{resource.flags & GfxResourceFlags.bitmap_masked ? 'M' : ''}
					{resource.flags & GfxResourceFlags.bitmap_ham ? 'H' : ''}
				</Fragment>)}
				{resource.type === GfxResourceType.palette && (<Fragment>
					<div class={styles.palette}>
						{option.palette.slice(0, option.palette.length >>> 1).map((p) => <div style={{ backgroundColor: GetColorCss(p) }} />)}
					</div>
				</Fragment>)}
			</dd>
			<dd class={styles.right}>{resource.size ? (resource.size.toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'b') : ''}</dd>
			<dd class={styles.fixed}>{resource.address ? ('$' + resource.address.toString(16).padStart(8, '0')) : ''}</dd>
		</div>
		{(!placeholder && hover.x >= 0 && resource.type === GfxResourceType.bitmap) && createPortal(<div class={styles.tooltip} style={{ lineHeight: 0, left: hover.x, top: hover.y, bottom: 'initial' }}>
			<Screen screen={option.screen} palette={GetPaletteFromCustomRegs(new Uint16Array(MODELS[option.frame].amiga.customRegs))} flags={option.resource.flags} scale={1} useZoom={false} time={0} frame={option.frame} />
		</div>, document.body)}
	</Fragment>);
};

// do not move into 'CopperList' otherwise the Dropdown will be recreated on every render
class GfxResourceDropdown extends DropdownComponent<GfxResourceWithPayload> {
	public static defaultProps = { optionComponent: GfxResourceItem, menuClassName: styles.gfxresource_menu, ...DropdownComponent.defaultProps };
}

// store state because component will get unmounted when tab switches
interface IState {
	bitmap?: GfxResourceWithPayload;
	palette?: GfxResourceWithPayload;
	overlay?: string;
}
const Context = createContext<IState>({});

export const GfxResourcesView: FunctionComponent<{
	frame: number;
	time: number;
	setTime?: StateUpdater<number>;
}> = ({ frame, time, setTime }) => {
	const copper = MODELS[frame].copper;
	const bitmaps = useMemo(() => {
		const bitmaps: GfxResourceWithPayload[] = [];
		MODELS[frame].amiga.gfxResources.filter((r) => r.type === GfxResourceType.bitmap).sort((a, b) => a.name.localeCompare(b.name)).forEach((resource) => {
			const width = resource.bitmap.width;
			const height = resource.bitmap.height;
			const modulos = [];
			const planes: number[] = [];
			if (resource.flags & GfxResourceFlags.bitmap_interleaved) {
				const moduloScale = (resource.flags & GfxResourceFlags.bitmap_masked) ? 2 : 1;
				for (let p = 0; p < resource.bitmap.numPlanes; p++)
					planes.push(resource.address + p * width / 8 * moduloScale);
				const modulo = (width / 8) * (resource.bitmap.numPlanes * moduloScale - 1);
				modulos.push(modulo, modulo);
			} else {
				for (let p = 0; p < resource.bitmap.numPlanes; p++)
					planes.push(resource.address + p * width / 8 * height);
				modulos.push(0, 0);
			}
			const screen: IScreen = { type: ScreenType.normal, width, height, planes, modulos, hires: false, ham: false };
			let mask: IScreen;
			if (resource.flags & GfxResourceFlags.bitmap_masked) {
				const maskPlanes = [...planes];
				if (resource.flags & GfxResourceFlags.bitmap_interleaved) {
					for (let p = 0; p < resource.bitmap.numPlanes; p++)
						maskPlanes[p] += width / 8;
				} else {
					// ??? does this make sense ?? not tested
					for (let p = 0; p < resource.bitmap.numPlanes; p++)
						maskPlanes[p] += width / 8 * height;
				}
				mask = { type: ScreenType.normal, width, height, planes: maskPlanes, modulos, hires: false, ham: false };
			}
			bitmaps.push({ resource, frame, screen, mask });
		});
		const copperScreens: { screen: IScreen; frames: number[] }[] = [];
		// dupecheck copper screens from all frames
		for(let i = 0; i < MODELS.length; i++) {
			const copperScreen = GetScreenFromCopper(MODELS[i].copper);
			const dupe = copperScreens.findIndex((cs) => JSON.stringify(cs.screen) === JSON.stringify(copperScreen));
			if(dupe === -1)
				copperScreens.push({ screen: copperScreen, frames: [i + 1] });
			else
				copperScreens[dupe].frames.push(i + 1);
		}

		for(const cs of copperScreens) {
			const copperResource: GfxResource = {
				address: cs.screen.planes[0],
				size: 0,
				name: `*Copper (fr. ${cs.frames.join(', ')})*`,
				type: GfxResourceType.bitmap,
				flags: cs.screen.ham ? GfxResourceFlags.bitmap_ham : 0,
				bitmap: {
					width: cs.screen.width,
					height: cs.screen.height,
					numPlanes: cs.screen.planes.length
				}
			};
			bitmaps.unshift({ resource: copperResource, frame, screen: cs.screen });
		}

		// screen emu
		const emuResource: GfxResource = {
			address: 0,
			size: 0,
			name: `*Denise*`,
			type: GfxResourceType.bitmap,
			flags: 0,
			bitmap: {
				width: NR_DMA_REC_HPOS * 4 - displayLeft * 2,
				height: NR_DMA_REC_VPOS - 1 - displayTop,
				numPlanes: 0
			}
		};
		const emuScreen: IScreen = {
			type: ScreenType.denise, 
			width: emuResource.bitmap.width,
			height: emuResource.bitmap.height,
			planes: [],
			modulos: [],
			hires: true,
			ham: false
		};
		bitmaps.unshift({ resource: emuResource, frame, screen: emuScreen });

		if(PROFILES[frame].$amiga.screenshot?.length > 22) {
			// screenshot
			const screenshotResource: GfxResource = {
				address: 0,
				size: 0,
				name: `*Screenshot*`,
				type: GfxResourceType.bitmap,
				flags: 0,
				bitmap: {
					width: 752, // from WinUAE code
					height: 574,
					numPlanes: 0
				}
			};
			const screenshotScreen: IScreen = {
				type: ScreenType.screenshot, 
				width: screenshotResource.bitmap.width,
				height: screenshotResource.bitmap.height,
				planes: [],
				modulos: [],
				hires: true,
				ham: false
			};
			bitmaps.unshift({ resource: screenshotResource, frame, screen: screenshotScreen });
		}

		return bitmaps;
	}, [frame]);

	const palettes = useMemo(() => {
		const palettes: GfxResourceWithPayload[] = [];

		const copperPalette = GetPaletteFromCopper(copper);
		const copperResource: GfxResource = {
			address: 0, // TODO
			size: 32 * 2,
			name: '*Copper*',
			type: GfxResourceType.palette,
			flags: 0,
			palette: {
				numEntries: copperPalette.length >>> 1
			}
		};
		palettes.push({ resource: copperResource, frame, palette: copperPalette });

		const customRegs = GetCustomRegsAfterDma(MODELS[frame].amiga.customRegs, MODELS[frame].amiga.dmacon, MODELS[frame].amiga.dmaRecords, CpuCyclesToDmaCycles(time));
		const customRegsPalette = GetPaletteFromCustomRegs(new Uint16Array(customRegs));
		const customRegsResource: GfxResource = {
			address: CustomRegisters.getCustomAddress("COLOR00"),
			size: 32 * 2,
			name: '*Custom Registers*',
			type: GfxResourceType.palette,
			flags: 0,
			palette: {
				numEntries: 32
			}
		};
		palettes.push({ resource: customRegsResource, frame, palette: customRegsPalette });

		MODELS[frame].amiga.gfxResources.filter((r) => r.type === GfxResourceType.palette).sort((a, b) => a.name.localeCompare(b.name)).forEach((resource) => {
			const palette = GetPaletteFromMemory(MODELS[frame].memory, resource.address, resource.palette.numEntries);
			palettes.push({ resource, frame, palette });
		});

		return palettes;
	}, [frame, time]);

	const state = useContext<IState>(Context);
	if (state.bitmap === undefined)
		state.bitmap = bitmaps[0];
	if (state.palette === undefined)
		state.palette = palettes[0];
	if (state.overlay === undefined)
		state.overlay = "";

	const [bitmap, setBitmap] = useState<GfxResourceWithPayload>(state.bitmap);
	const [palette, setPalette] = useState<GfxResourceWithPayload>(state.palette);
	// update custom registers palette on time change
	if(palette.resource.address === CustomRegisters.getCustomAddress("COLOR00"))
		palette.palette = palettes.find((p) => p.resource.address === CustomRegisters.getCustomAddress("COLOR00")).palette;
	const onChangeBitmap = (selected: GfxResourceWithPayload) => { state.bitmap = selected; setBitmap(selected); };
	const onChangePalette = (selected: GfxResourceWithPayload) => { state.palette = selected; setPalette(selected); };

	const [overlay, setOverlay] = useState(state.overlay);
	const onChangeOverlay = ({currentTarget}: JSX.TargetedEvent<HTMLSelectElement, Event>) => { const overlay = currentTarget.value; state.overlay = overlay; setOverlay(overlay); };

	return (<Fragment>
		<div style={{ fontSize: 'var(--vscode-editor-font-size)', marginBottom: '5px' }}>
			Bitmap:&nbsp;
			<GfxResourceDropdown options={bitmaps} value={bitmap} onChange={onChangeBitmap} />
			&nbsp;
			Palette:&nbsp;
			<GfxResourceDropdown options={palettes} value={palette} onChange={onChangePalette} />
			&nbsp;
			Overlay:&nbsp;
			<select className="select" alt="Overlay" aria-label="Overlay" value={overlay} onInput={onChangeOverlay}>
				<option value="">None</option>
				<option value="blitrects">Blit Rects</option>
				<option value="overdraw">Overdraw</option>
			</select>
		</div>
		<div style={{/*overflow: 'auto'*/}}>
			<Screen frame={frame} time={time} setTime={setTime} screen={bitmap.screen} mask={bitmap.mask} palette={palette.palette} flags={bitmap.resource.flags} overlay={overlay} />
		</div>
	</Fragment>);
};
