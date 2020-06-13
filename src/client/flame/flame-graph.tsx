/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Fragment, FunctionComponent, h } from 'preact';
import { createPortal } from 'preact/compat';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { binarySearch } from '../array';
import { dataName, DisplayUnit, formatValue, getLocationText } from '../display';
import { dmaTypes, DmaEvents, NR_DMA_REC_HPOS, NR_DMA_REC_VPOS, GetBlits, GetScreenFromBlit, DmaTypes, Blit, GetPaletteFromCustomRegs } from '../dma';
import { compileFilter, IRichFilter } from '../filter';
import { MiddleOut } from '../middleOutCompression';
import { Category, ILocation, IProfileModel } from '../model';
import { IOpenDocumentMessage, IAmigaProfileExtra } from '../types';
import { useCssVariables } from '../useCssVariables';
import { useLazyEffect } from '../useLazyEffect';
import { useWindowSize } from '../useWindowSize';
import { classes } from '../util';
import { IVscodeApi, VsCodeApi } from '../vscodeApi';
import styles from './flame-graph.module.css';
import { IColumn, IColumnLocation } from './stacks';
import { TextCache } from './textCache';
import { setupGl } from './webgl/boxes';
import { DmaRecord } from '../../backend/profile_types';
import { CustomRegisters } from '../customRegisters';
import { Screen } from '../debugger/copper';

export const enum Constants {
	BoxHeight = 16,
	TextColor = '#fff',
	BoxColor = '#000',
	TimelineHeight = 18,
	TimelineLabelSpacing = 200,
	MinWindow = 0.005,
	ExtraYBuffer = 30,
}

// murmur3's 32-bit finalizer, which we use as a simple and fast hash function:
function hash(n: number) {
	n ^= n >> 16;
	n *= 2246822507;
	n ^= n >> 13;
	n *= 3266489909;
	n ^= n >> 16;
	return n;
}

const pickColor = (location: IColumnLocation): number => {
	if (location.category === Category.System)
		return -1;

	if(location.filtered === false)
		return 0xff404040;

	const colorHash = hash(location.graphId);
	const r = (0.9 * 255) | 0;
	const g = ((colorHash & 255) / 2) | 0;
	const b = (((colorHash >> 8) & 255) / 2.353) | 0;
	const color = 0xff000000 | ((b & 255) << 16) | ((g & 255) << 8) | ((r & 255) << 0); // 0xAABBGGRR
	return color;
};

interface IBoxAmiga {
	dmacon?: number;
	dmaRecord?: DmaRecord;
	blit?: Blit;
}

export interface IBox {
	column: number;
	row: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	color: number;
	level: number;
	text: string;
	loc: IColumnLocation;
	amiga?: IBoxAmiga;
}

const buildBoxes = (columns: ReadonlyArray<IColumn>, rowOffset: number) => {
	const boxes: Map<number, IBox> = new Map();
	let maxY = 0;
	for (let x = 0; x < columns.length; x++) {
		const col = columns[x];
		for (let y = 0; y < col.rows.length; y++) {
			const loc = col.rows[y];
			if (typeof loc === 'number') {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				getBoxInRowColumn(columns, boxes, x, y)!.x2 = col.x2;
			} else {
				const y1 = Constants.BoxHeight * (y + rowOffset) + Constants.TimelineHeight;
				const y2 = y1 + Constants.BoxHeight;
				boxes.set(loc.graphId, {
					column: x,
					row: y,
					x1: col.x1,
					x2: col.x2,
					y1,
					y2,
					level: y,
					text: loc.callFrame.functionName,
					color: pickColor(loc),
					loc,
				});

				maxY = Math.max(y2, maxY);
			}
		}
	}

	return {
		boxById: boxes,
		maxY,
	};
};

const buildDmaBoxes = (model: IProfileModel) => {
	if(!model.amiga || !model.amiga.dmaRecords)
		return [];
	const dmaRecords = model.amiga.dmaRecords;

	const regDMACON = CustomRegisters.getCustomAddress("DMACON") - 0xdff000;
	let dmacon = model.amiga.dmacon;

	const duration = 7_093_790 / 50 * (7_093_790 / 50 / model.duration);
	const boxes: IBox[] = [];
	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS - ((y % 2) ? 1 : 0); x++, i++) { // long and short lines alternate
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];

			if(dmaRecord.type === undefined && dmaRecord.evt === undefined)
				continue;
			const dmaType = dmaRecord.type || 0;
			const dmaSubtype = (dmaTypes[dmaType].subtypes.length === 1) ? 0 : (dmaRecord.extra || 0);
			if(dmaType >= dmaTypes.length || dmaSubtype >= dmaTypes[dmaType].subtypes.length)
				continue;

			if(dmaRecord.reg === regDMACON) {
				if (dmaRecord.dat & 0x8000)
					dmacon |= dmaRecord.dat & 0x7FFF;
				else
					dmacon &= ~dmaRecord.dat;
			}

			let text = dmaTypes[dmaType].name;
			if(dmaTypes[dmaType].subtypes[dmaSubtype].name !== undefined)
				text += ' (' + dmaTypes[dmaType].subtypes[dmaSubtype].name + ')';
			const color = dmaTypes[dmaType].subtypes[dmaSubtype].color;

			const x1 = i * 2 / duration;
			const x2 = (i + 1) * 2 / duration;
			const y1 = 0 * Constants.BoxHeight + Constants.TimelineHeight;
			const y2 = y1 + Constants.BoxHeight;
			boxes.push({
				column: 0,
				row: 0,
				x1,
				x2,
				y1,
				y2,
				level: 0,
				text,
				color,
				loc: {
					filtered: true,
					graphId: 100000 + i,
					selfTime: -1,
					aggregateTime: -1,
					id: 0,
					ticks: 0,
					category: Category.User,
					callFrame: {
						functionName: text,
						scriptId: '#dma',
						url: '',
						lineNumber: y,
						columnNumber: x
					}
				},
				amiga: {
					dmacon,
					dmaRecord
				}
			});
		}
	}
	return boxes;
};

const buildBlitBoxes = (model: IProfileModel) => {
	if(!model.amiga || !model.amiga.dmaRecords)
		return [];
	const dmaRecords = model.amiga.dmaRecords;

	const customRegs = new Uint16Array(model.amiga.customRegs);
	const blits = GetBlits(customRegs, model.amiga.dmaRecords);

	const duration = 7_093_790 / 50 * (7_093_790 / 50 / model.duration);
	const boxes: IBox[] = [];

	for(const blit of blits) {
		const color = dmaTypes[DmaTypes.BLITTER].subtypes[0].color; // TODO: subtype

		const x1 = blit.cycleStart * 2 / duration;
		const x2 = blit.cycleEnd ? (blit.cycleEnd) * 2 / duration : 1;
		const y1 = 1 * Constants.BoxHeight + Constants.TimelineHeight;
		const y2 = y1 + Constants.BoxHeight;
		let channels = '';
		for(let channel = 0; channel < 4; channel++) {
			if(blit.BLTCON0 & (1 << (11 - channel)))
				channels += 'ABCD'[channel];
			else
				channels += '-';
		}

		const text = `Blit ${channels} ${blit.BLTSIZH * 16}x${blit.BLTSIZV}px`;
		boxes.push({
			column: 0,
			row: 0,
			x1,
			x2,
			y1,
			y2,
			level: 0,
			text,
			color,
			loc: {
				filtered: true,
				graphId: 200000 + blit.cycleStart,
				selfTime: -1,
				aggregateTime: -1,
				id: 0,
				ticks: 0,
				category: Category.User,
				callFrame: {
					functionName: text,
					scriptId: '#blit',
					url: '',
					lineNumber: blit.vposStart,
					columnNumber: blit.hposStart
				}
			},
			amiga: { blit }
		});
	}
	return boxes;
};

export interface IBounds {
	minX: number;
	maxX: number;
}

const enum LockBound {
	None = 0,
	Y = 1 << 0,
	MinX = 1 << 1,
	MaxX = 1 << 2,
}

interface IDrag {
	timestamp: number;
	pageXOrigin: number;
	pageYOrigin: number;
	original: IBounds;
	xPerPixel: number;
	lock: LockBound;
}

const enum HighlightSource {
	Hover,
	Keyboard,
}

const clamp = (min: number, v: number, max: number) => Math.max(Math.min(v, max), min);

const dpr = window.devicePixelRatio || 1;

const getBoxInRowColumn = (
	columns: ReadonlyArray<IColumn>,
	boxes: ReadonlyMap<number, IBox>,
	column: number,
	row: number,
) => {
	let candidate = columns[column]?.rows[row];
	if (typeof candidate === 'number') {
		candidate = columns[candidate].rows[row];
	}

	return candidate !== undefined
		? boxes.get((candidate as { graphId: number }).graphId)
		: undefined;
};

interface ISerializedState {
	focusedId?: number;
	bounds?: IBounds;
}

export interface ICanvasSize {
	width: number;
	height: number;
}

/**
 * Gets the floating point precision threshold for calculating positions and
 * intersections within the given set of bounds.
 */
const epsilon = (bounds: IBounds) => (bounds.maxX - bounds.minX) / 100_000;

export const FlameGraph: FunctionComponent<{
	model: IProfileModel;
	data: ReadonlyArray<IColumn>;
	filter: IRichFilter;
	displayUnit: DisplayUnit;
}> = ({ model, data, filter, displayUnit }) => {
	const vscode = useContext(VsCodeApi) as IVscodeApi<ISerializedState>;
	const prevState = vscode.getState();

	const webCanvas = useRef<HTMLCanvasElement>();
	const webContext = useMemo(() => webCanvas.current?.getContext('2d'), [webCanvas.current]);
	const glCanvas = useRef<HTMLCanvasElement>();

	const windowSize = useWindowSize();
	const [canvasSize, setCanvasSize] = useState<ICanvasSize>({ width: 100, height: 100 });
	const [hovered, setHovered] = useState<{ box: IBox; src: HighlightSource } | undefined>(undefined);
	const [drag, setDrag] = useState<IDrag | undefined>(undefined);
	const cssVariables = useCssVariables();

	const columns = useMemo(
		() => {
			const filterFn = compileFilter(filter);
			const getFilterText = (node: ILocation) => [
				node.callFrame.functionName,
				node.callFrame.url,
				node.src?.source.path ?? '',
			];
			const filtered = [...data];
			for(const column of filtered) {
				for(const row of column.rows) {
					if(typeof row === 'number')
						continue;
					row.filtered = getFilterText(row).some(filterFn);
				}
			}
			return filtered;
		},
		[data, filter]
	);

	const rawBoxes = useMemo(() => buildBoxes(columns, model.amiga ? 2 : 0), [columns]); // +2: make room for dmaRecords, blits
	const dmaBoxes = useMemo(() => buildDmaBoxes(model), [model]);
	const blitBoxes = useMemo(() => buildBlitBoxes(model), [model]);
	const clampX = useMemo(
		() => ({
			minX: 0, //columns[0]?.x1 ?? 0,
			maxX: 1, //columns[columns.length - 1]?.x2 ?? 0,
		}),
		[columns],
	);
	const [focused, setFocused] = useState<IBox | undefined>(rawBoxes.boxById.get(prevState?.focusedId ?? -1));
	const [bounds, setBounds] = useState<IBounds>(prevState?.bounds ?? { ...clampX });

	const gl = useMemo(
		() =>
			glCanvas.current &&
			setupGl({
				canvas: glCanvas.current,
				focusColor: cssVariables.focusBorder,
				boxes: [...rawBoxes.boxById.values(), ...dmaBoxes, ...blitBoxes],
				scale: dpr,
			}),
		[glCanvas.current],
	);
	useEffect(() => gl?.setBoxes([...rawBoxes.boxById.values(), ...dmaBoxes, ...blitBoxes]), [rawBoxes, dmaBoxes, blitBoxes]);
	useEffect(() => gl?.setBounds(bounds, canvasSize, dpr), [bounds, canvasSize]);
	useEffect(() => gl?.setFocusColor(cssVariables.focusBorder), [cssVariables]);
	useEffect(() => gl?.setFocused(focused?.loc.graphId), [focused]);
	useEffect(() => gl?.setHovered(hovered?.box.loc.graphId), [hovered]);

	const openBox = useCallback(
		(box: IBox, evt: { altKey: boolean }) => {
			const src = box.loc.src;
			if (!src?.source.path) {
				return;
			}

			vscode.postMessage<IOpenDocumentMessage>({
				type: 'openDocument',
				location: src,
				callFrame: box.loc.callFrame,
				toSide: evt.altKey,
			});
		},
		[vscode],
	);

	const textCache = useMemo(
		() =>
			new TextCache(
				`${Constants.BoxHeight / 1.5}px ${cssVariables['editor-font-family']}`,
				Constants.TextColor,
				dpr,
			),
		[cssVariables],
	);

	useLazyEffect(() => setBounds({ ...bounds, ...clampX }), [clampX]);

	useLazyEffect(() => {
		vscode.setState({ ...vscode.getState(), bounds });
	}, [bounds]);

	useLazyEffect(() => {
		vscode.setState({ ...vscode.getState(), focusedId: focused?.loc.graphId });
	}, [focused]);

	useEffect(() => {
		if (webContext) {
			webContext.textBaseline = 'middle';
			webContext.scale(dpr, dpr);
		}
	}, [webContext, canvasSize]);

	// Re-render box labels when data changes
	useEffect(() => {
		if (!webContext) {
			return;
		}

		webContext.clearRect(0, Constants.TimelineHeight, canvasSize.width, canvasSize.height);
		webContext.save();
		webContext.beginPath();
		webContext.rect(0, Constants.TimelineHeight, canvasSize.width, canvasSize.height);

		const doBox = (box: IBox) => {
			const xScale = canvasSize.width / (bounds.maxX - bounds.minX);
			const x1 = Math.max(0, (box.x1 - bounds.minX) * xScale);
			if (x1 > canvasSize.width) {
				return;
			}

			const x2 = (box.x2 - bounds.minX) * xScale;
			if (x2 < 0) {
				return;
			}

			const width = x2 - x1;
			if (width < 10) {
				return;
			}

			textCache.drawText(
				webContext,
				box.text,
				x1 + 3,
				box.y1 + 5,
				width - 6,
				Constants.BoxHeight,
				box.loc.filtered ? 1.0 : 0.5
			);
		};

		for (const box of rawBoxes.boxById.values())
			doBox(box);

		for(const box of dmaBoxes)
			doBox(box);

		for(const box of blitBoxes)
			doBox(box);

		webContext.clip();
		webContext.restore();
	}, [webContext, bounds, rawBoxes, dmaBoxes, blitBoxes, canvasSize, cssVariables]);

	// Re-render the zoom indicator when bounds change
	useEffect(() => {
		if (!webContext) {
			return;
		}

		webContext.clearRect(0, 0, webContext.canvas.width, Constants.TimelineHeight);
		webContext.fillStyle = cssVariables['editor-foreground'];
		webContext.font = webContext.textAlign = 'right';
		webContext.strokeStyle = cssVariables['editorRuler-foreground'];
		webContext.lineWidth = 1 / dpr;
		webContext.globalAlpha = 1.0;

		const labels = Math.round(canvasSize.width / Constants.TimelineLabelSpacing);
		const spacing = canvasSize.width / labels;

		const timeRange = model.duration * (bounds.maxX - bounds.minX);
		const timeStart = model.duration * bounds.minX;

		webContext.beginPath();
		for (let i = 0; i <= labels; i++) {
			const time = (i / labels) * timeRange + timeStart;
			const x = i * spacing;
			webContext.fillText(
				`${formatValue(time, model.duration, displayUnit)}`,
				Math.max(40, x - 3),
				Constants.TimelineHeight / 2,
			);
			webContext.moveTo(x, 0);
			webContext.lineTo(x, Constants.TimelineHeight);
		}

		webContext.stroke();
		webContext.textAlign = 'left';
	}, [webContext, model, canvasSize, bounds, cssVariables, displayUnit]);

	// Update the canvas size when the window size changes, and on initial render
	useEffect(() => {
		if (!webCanvas.current || !glCanvas.current) {
			return;
		}

		const { width, height } = (webCanvas.current.parentElement as HTMLElement).getBoundingClientRect();
		if (width === canvasSize.width && height === canvasSize.height) {
			return;
		}

		for (const canvas of [webCanvas.current, glCanvas.current]) {
			canvas.style.width = `${width}px`;
			canvas.width = width * dpr;
			canvas.style.height = `${height}px`;
			canvas.height = height * dpr;
		}

		setCanvasSize({ width, height });
	}, [windowSize]);

	const animationRef = useRef<number>();

	// Callback that zoomes into the given box.
	const zoomTo = useCallback(
		(target: IBounds | IBox) => {
			//setFocused(box);

			if(animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = undefined;
			}

			const from = bounds;
			const to = 'minX' in target ? target : { minX: (target as IBox).x1, maxX: (target as IBox).x2 };
			if(from.minX === to.minX && from.maxX === to.maxX)
				to.minX = 0, to.maxX = 1;

			//setBounds(to);return;

			const duration = 300;
			let start;
			const QuadraticEaseInOut = (p: number) => (p < 0.5) ? 2 * p * p : (-2 * p * p) + (4 * p) - 1;
			const LinearInterp = (p: number) => p;

			const update = (timestamp: DOMHighResTimeStamp) => {
				if (start === undefined)
					start = timestamp;
				const elapsed = timestamp - start;
				const animated = { ...from };
				const lerp = QuadraticEaseInOut/*LinearInterp*/(Math.min(1.0, elapsed / duration));
				Object.keys(animated).forEach((k) => { animated[k] = from[k] + (to[k] - from[k]) * lerp; });
				setBounds(animated);
				if(elapsed < duration)
					animationRef.current = requestAnimationFrame(update);
				else
					animationRef.current = undefined;
			};
			animationRef.current = requestAnimationFrame(update);
		},
		[clampX, canvasSize.height, bounds],
	);

	// Key event handler, deals with focus navigation and escape/enter
	const onKeyDown = useCallback(
		(evt: KeyboardEvent) => {
			switch (evt.key) {
				case 'Escape':
					// If there's a tooltip open, close that on first escape
					return hovered?.src === HighlightSource.Keyboard
						? setHovered(undefined)
						: setBounds({ ...clampX });
				case 'Enter':
					if ((evt.metaKey || evt.ctrlKey) && hovered) {
						return openBox(hovered.box, evt);
					}

					return focused && zoomTo(focused);
				case 'Space':
					return focused && zoomTo(focused);
				default:
				// fall through
			}

			if (!focused) {
				return;
			}

			let nextFocus: IBox | false | undefined;
			switch (evt.key) {
				case 'ArrowRight':
					for (
						let x = focused.column + 1;
						x < columns.length && columns[x].x1 + epsilon(bounds) < bounds.maxX;
						x++
					) {
						const box = getBoxInRowColumn(columns, rawBoxes.boxById, x, focused.row);
						if (box && box !== focused) {
							nextFocus = box;
							break;
						}
					}
					break;
				case 'ArrowLeft':
					for (
						let x = focused.column - 1;
						x >= 0 && columns[x].x2 - epsilon(bounds) > bounds.minX;
						x--
					) {
						const box = getBoxInRowColumn(columns, rawBoxes.boxById, x, focused.row);
						if (box && box !== focused) {
							nextFocus = box;
							break;
						}
					}
					break;
				case 'ArrowUp':
					nextFocus = getBoxInRowColumn(columns, rawBoxes.boxById, focused.column, focused.row - 1);
					break;
				case 'ArrowDown':
					{
						let x = focused.column;
						do {
							nextFocus = getBoxInRowColumn(columns, rawBoxes.boxById, x, focused.row + 1);
						} while (!nextFocus && columns[++x]?.rows[focused.row] === focused.column);
					}
					break;
				default:
					break;
			}

			if (nextFocus) {
				setFocused(nextFocus);
				setHovered({ box: nextFocus, src: HighlightSource.Keyboard });
			}
		},
		[zoomTo, focused, hovered, rawBoxes, clampX],
	);

	// Keyboard events
	useEffect(() => {
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [onKeyDown]);

	const getBoxUnderCursor = useCallback(
		(evt: MouseEvent) => {
			if (!webCanvas.current) {
				return;
			}

			const { top, left, width } = webCanvas.current.getBoundingClientRect();
			const fromTop = evt.pageY - top;
			const fromLeft = evt.pageX - left;
			if (fromTop < Constants.TimelineHeight) {
				return;
			}

			const x = (fromLeft / width) * (bounds.maxX - bounds.minX) + bounds.minX;

			let rowOffset = 0;
			if(model.amiga) {
				// dmaRecord
				if(fromTop < Constants.TimelineHeight + 1 * Constants.TimelineHeight) {
					const box = Math.abs(binarySearch(dmaBoxes, (b) => b.x2 - x)) - 1;
					if (!dmaBoxes[box] || dmaBoxes[box].x1 > x) {
						return;
					}
					return dmaBoxes[box];
				}

				// blit
				if(fromTop < Constants.TimelineHeight + 2 * Constants.TimelineHeight) {
					const box = Math.abs(binarySearch(blitBoxes, (b) => b.x2 - x)) - 1;
					if (!blitBoxes[box] || blitBoxes[box].x1 > x) {
						return;
					}
					return blitBoxes[box];
				}
				rowOffset = 2; // +1: dmaRecord, +1: blits
			}

			const col = Math.abs(binarySearch(columns, (c) => c.x2 - x)) - 1;
			if (!columns[col] || columns[col].x1 > x) {
				return;
			}

			const row = Math.floor((fromTop - Constants.TimelineHeight) / Constants.BoxHeight) - rowOffset;
			return getBoxInRowColumn(columns, rawBoxes.boxById, col, row);
		},
		[webCanvas, bounds, columns, rawBoxes, dmaBoxes, blitBoxes],
	);

	// Listen for drag events on the window when it's running
	useEffect(() => {
		if (!drag) {
			return;
		}

		const { original, pageXOrigin, xPerPixel, pageYOrigin, lock } = drag;
		const onMove = (evt: MouseEvent) => {
			const range = original.maxX - original.minX;
			let minX: number;
			let maxX: number;
			if (!(lock & LockBound.MinX)) {
				const upper =
					lock & LockBound.MaxX ? bounds.maxX - Constants.MinWindow : clampX.maxX - range;
				minX = clamp(clampX.minX, original.minX - (evt.pageX - pageXOrigin) * xPerPixel, upper);
				maxX = lock & LockBound.MaxX ? original.maxX : Math.min(clampX.maxX, minX + range);
			} else {
				minX = original.minX;
				maxX = clamp(
					minX + Constants.MinWindow,
					original.maxX - (evt.pageX - pageXOrigin) * xPerPixel,
					clampX.maxX,
				);
			}

			setBounds({ minX, maxX });
		};

		const onUp = (evt: MouseEvent) => {
			onMove(evt);
			setDrag(undefined);
		};

		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseleave', onUp);
		document.addEventListener('mouseup', onUp);

		return () => {
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseleave', onUp);
			document.removeEventListener('mouseup', onUp);
		};
	}, [clampX, drag]);

	const onMouseMove = useCallback(
		(evt: MouseEvent) => {
			if (!webContext || drag) {
				return;
			}

			const box = getBoxUnderCursor(evt);
			if (!box && hovered?.src === HighlightSource.Keyboard) {
				// don't hide tooltips created by focus change on mousemove
				return;
			}

			setHovered(box ? { box, src: HighlightSource.Hover } : undefined);
		},
		[drag || getBoxUnderCursor, webContext, canvasSize, hovered, rawBoxes],
	);

	const onWheel = useCallback(
		(evt: WheelEvent) => {
			if (!webCanvas.current) {
				return;
			}

			const { left, width } = webCanvas.current.getBoundingClientRect();
			if (evt.shiftKey) {
				const deltaX = clamp(
					clampX.minX - bounds.minX,
					(evt.deltaY / width) * (bounds.maxX - bounds.minX),
					clampX.maxX - bounds.maxX,
				);
				setBounds({ minX: bounds.minX + deltaX, maxX: bounds.maxX + deltaX });
				return;
			}

			const range = bounds.maxX - bounds.minX;
			const center = bounds.minX + (range * (evt.pageX - left)) / width;
			const scale = evt.deltaY / -400;
			//const mouseWheelZoomSpeed = 1 / 120;
			//const scale = Math.pow(1.4, -evt.deltaY * mouseWheelZoomSpeed) - 1;
			//console.log(scale);
			setBounds({
				minX: Math.max(clampX.minX, bounds.minX + scale * (center - bounds.minX)),
				maxX: Math.min(clampX.maxX, bounds.maxX - scale * (bounds.maxX - center)),
			});

			evt.preventDefault();
		},
		[clampX, webCanvas.current, drag || bounds],
	);

	const onMouseDown = useCallback(
		(evt: MouseEvent) => {
			setDrag({
				timestamp: Date.now(),
				pageXOrigin: evt.pageX,
				pageYOrigin: evt.pageY,
				xPerPixel: (bounds.maxX - bounds.minX) / canvasSize.width,
				original: bounds,
				lock: LockBound.None,
			});
			evt.preventDefault();
		},
		[canvasSize, drag || bounds],
	);

	const onMouseUp = useCallback(
		(evt: MouseEvent) => {
			if (!drag) {
				return;
			}

			const isClick =
				Date.now() - drag.timestamp < 500 &&
				Math.abs(evt.pageX - drag.pageXOrigin) < 100 &&
				Math.abs(evt.pageY - drag.pageYOrigin) < 100;

			if (!isClick) {
				return;
			}

			const box = getBoxUnderCursor(evt);
			if (box && (evt.ctrlKey || evt.metaKey)) {
				openBox(box, evt);
			} else if (box) {
				//zoomToBox(box);
				setFocused(box);
			} else {
				setBounds({ ...clampX });
			}

			setHovered(undefined);
			setDrag(undefined);

			evt.stopPropagation();
			evt.preventDefault();
		},
		[drag, getBoxUnderCursor, openBox, clampX],
	);

	const onDblClick = useCallback(
		(evt: MouseEvent) => {
			if(focused) {
				zoomTo(focused);
			}
			evt.stopPropagation();
			evt.preventDefault();
		},
		[focused, bounds]
	);

	const onMouseLeave = useCallback(
		(evt: MouseEvent) => {
			onMouseUp(evt);
			setHovered(undefined);
		},
		[onMouseUp],
	);

	const onFocus = useCallback(() => {
		if (focused) {
			setHovered({ box: focused, src: HighlightSource.Keyboard });
			return;
		}

		const firstCol = Math.abs(binarySearch(columns, (c) => c.x2 - bounds.minX));
		const firstBox = getBoxInRowColumn(columns, rawBoxes.boxById, firstCol, 0);
		if (firstBox) {
			setFocused(firstBox);
			setHovered({ box: firstBox, src: HighlightSource.Keyboard });
		}
	}, [rawBoxes, columns, drag || bounds, focused]);

	return (
		<Fragment>
			<DragHandle
				bounds={bounds}
				current={drag}
				canvasWidth={canvasSize.width}
				startDrag={setDrag}
			/>
			<canvas
				ref={webCanvas}
				style={{ cursor: hovered ? 'pointer' : 'default' }}
				role="application"
				tabIndex={0}
				onFocus={onFocus}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onDblClick={onDblClick}
				onMouseLeave={onMouseLeave}
				onMouseMove={onMouseMove}
				onWheel={onWheel}
			/>
			<canvas
				ref={glCanvas}
				style={{
					position: 'absolute',
					top: Constants.TimelineHeight,
					left: 0,
					right: 0,
					bottom: 0,
					pointerEvents: 'none',
					zIndex: -1,
				}}
			/>
			{hovered && (
				createPortal(
					<Tooltip
						canvasRect={webCanvas.current.getBoundingClientRect()}
						left={(hovered.box.x1 - bounds.minX) / (bounds.maxX - bounds.minX)}
						upperY={canvasSize.height - hovered.box.y1}
						lowerY={hovered.box.y2}
						src={hovered.src}
						location={hovered.box.loc}
						amiga={hovered.box.amiga}
						displayUnit={displayUnit}
						model={model}
					/>, document.body)
			)}
		</Fragment>
	);
};

const DragHandle: FunctionComponent<{
	canvasWidth: number;
	bounds: IBounds;
	current: IDrag | undefined;
	startDrag: (bounds: IDrag) => void;
}> = ({ current, bounds, startDrag, canvasWidth }) => {
	const start = useCallback(
		(evt: MouseEvent, lck: LockBound, original: IBounds = bounds) => {
			startDrag({
				timestamp: Date.now(),
				pageXOrigin: evt.pageX,
				pageYOrigin: evt.pageY,
				original,
				xPerPixel: -1 / canvasWidth,
				lock: lck | LockBound.Y,
			});
			evt.preventDefault();
			evt.stopPropagation();
		},
		[canvasWidth, bounds],
	);

	const range = bounds.maxX - bounds.minX;
	const lock = current?.lock ?? 0;

	return (
		<div class={classes(styles.handle, current && styles.active)} style={{ height: Constants.TimelineHeight }}>
			<div
				className={classes(styles.bg, lock === LockBound.Y && styles.active)}
				onMouseDown={useCallback((evt: MouseEvent) => start(evt, LockBound.Y), [start])}
				style={{ transform: `scaleX(${range}) translateX(${(bounds.minX / range) * 100}%)` }}
			/>
			<div
				className={classes(styles.bookend, lock & LockBound.MaxX && styles.active)}
				style={{ transform: `translateX(${bounds.minX * 100}%)` }}
			>
				<div
					style={{ left: 0 }}
					onMouseDown={useCallback((evt: MouseEvent) => start(evt, LockBound.MaxX), [start])}
				/>
			</div>
			<div
				className={classes(styles.bookend, lock & LockBound.MinX && styles.active)}
				style={{ transform: `translateX(${(bounds.maxX - 1) * 100}%)` }}
			>
				<div
					style={{ right: 0 }}
					onMouseDown={useCallback((evt: MouseEvent) => start(evt, LockBound.MinX), [start])}
				/>
			</div>
		</div>
	);
};

function symbolize(address: number, amiga: IAmigaProfileExtra) {
	const resource = amiga.gfxResources.find((r) => address >= r.address && address < r.address + r.size);
	if(resource)
		return `${resource.name}+\$${(address - resource.address).toString(16)}`;
	else
		return `\$${address.toString(16).padStart(8, '0')}`;
}

const Tooltip: FunctionComponent<{
	canvasRect: DOMRect;
	left: number;
	upperY: number;
	lowerY: number;
	location: ILocation;
	amiga: IBoxAmiga;
	src: HighlightSource;
	displayUnit: DisplayUnit;
	model: IProfileModel;
}> = ({ left, lowerY, upperY, src, location, amiga, canvasRect, displayUnit, model }) => {
	const label = getLocationText(location);
	const isDma = amiga?.dmaRecord !== undefined;
	const isBlit = amiga?.blit !== undefined;
	const isFunction = !isDma && !isBlit;

	let dmaReg = '';
	let dmaData = '';
	let dmaEvents = '';

	interface Bit {
		name: string;
		enabled: boolean;
	}
	enum DmaFlags {
		AUD0    = 0x0001,
		AUD1    = 0x0002,
		AUD2    = 0x0004,
		AUD3    = 0x0008,
		DISK    = 0x0010,
		SPRITE  = 0x0020,
		BLITTER = 0x0040,
		COPPER  = 0x0080,
		RASTER  = 0x0100,
		MASTER  = 0x0200, 
	}
	const dmaChannels: Bit[] = [];

	if(isDma) {
		if(amiga.dmacon !== undefined) {
			if(amiga.dmacon & DmaFlags.MASTER) {
				dmaChannels.push({ name: "Master", enabled: true });
				dmaChannels.push({ name: "Raster", enabled: !!(amiga.dmacon & DmaFlags.RASTER) });
				dmaChannels.push({ name: "Copper", enabled: !!(amiga.dmacon & DmaFlags.COPPER) });
				dmaChannels.push({ name: "Blitter", enabled: !!(amiga.dmacon & DmaFlags.BLITTER) });
				dmaChannels.push({ name: "Sprite", enabled: !!(amiga.dmacon & DmaFlags.SPRITE) });
				dmaChannels.push({ name: "Disk", enabled: !!(amiga.dmacon & DmaFlags.DISK) });
				dmaChannels.push({ name: "Aud0", enabled: !!(amiga.dmacon & DmaFlags.AUD0) });
				dmaChannels.push({ name: "Aud1", enabled: !!(amiga.dmacon & DmaFlags.AUD1) });
				dmaChannels.push({ name: "Aud2", enabled: !!(amiga.dmacon & DmaFlags.AUD2) });
				dmaChannels.push({ name: "Aud3", enabled: !!(amiga.dmacon & DmaFlags.AUD3) });
			} else {
				dmaChannels.push({ name: "Master", enabled: false });
			}
		}
		if(amiga.dmaRecord.type !== undefined) {
			dmaData = '$' + (amiga.dmaRecord.dat & 0xffff).toString(16).padStart(4, '0');
			if(amiga.dmaRecord.reg & 0x1000) {
				if(amiga.dmaRecord.reg & 0x0100)
					dmaReg = 'Write';
				else
					dmaReg = 'Read';
				if((amiga.dmaRecord.reg & 0xff) === 4) {
					dmaReg += '.L';
					dmaData = '$' + amiga.dmaRecord.dat.toString(16).padStart(8, '0');
				}
				if((amiga.dmaRecord.reg & 0xff) === 2)
					dmaReg += '.W';
				if((amiga.dmaRecord.reg & 0xff) === 1) {
					dmaReg += '.B';
					dmaData = '$' + (amiga.dmaRecord.dat & 0xff).toString(16).padStart(2, '0');
				}
			} else {
				dmaReg = CustomRegisters.getCustomName(0xdff000 + amiga.dmaRecord.reg) + ' ($' + amiga.dmaRecord.reg.toString(16).padStart(3, '0') + ')';
			}
		}
		if(amiga.dmaRecord.evt) {
			const events: string[] = [];

			if(amiga.dmaRecord.evt & DmaEvents.BLITNASTY)
				events.push("Blitter Nasty");
			if(amiga.dmaRecord.evt & DmaEvents.BLITSTARTFINISH)
				events.push("Blitter Start/Finish");
			if(amiga.dmaRecord.evt & DmaEvents.BLITIRQ)
				events.push("Blitter IRQ");
			if(amiga.dmaRecord.evt & DmaEvents.BPLFETCHUPDATE)
				events.push("Bitplane Fetch Update");
			if(amiga.dmaRecord.evt & DmaEvents.COPPERWAKE)
				events.push("Copper Wake");
			if(amiga.dmaRecord.evt & DmaEvents.NOONEGETS)
				events.push("Copper can't read");
			else if(amiga.dmaRecord.evt & DmaEvents.COPPERWANTED)
				events.push("Copper can't read");
			if(amiga.dmaRecord.evt & DmaEvents.CPUIRQ)
				events.push("CPU IRQ");
			if(amiga.dmaRecord.evt & DmaEvents.INTREQ)
				events.push("INTREQ");
			if(amiga.dmaRecord.evt & DmaEvents.SPECIAL)
				events.push("Special");

			dmaEvents = events.join(', ');
		}
	}

	enum BLTCON0Flags {
		USEA    = 1 << 11,
		USEB    = 1 << 10,
		USEC    = 1 <<  9,
		USED    = 1 <<  8,
	}
	enum BLTCON1Flags {
		DOFF    = 1 << 7,
		EFE     = 1 << 4,
		IFE     = 1 << 3,
		FCI     = 1 << 2,
		DESC    = 1 << 1,
		LINE    = 1 << 0,
	}
	const BLTCON: Bit[] = [];
	if(isBlit) {
		BLTCON.push({ name: "USEA", enabled: !!(amiga.blit.BLTCON0 & BLTCON0Flags.USEA) });
		BLTCON.push({ name: "USEB", enabled: !!(amiga.blit.BLTCON0 & BLTCON0Flags.USEB) });
		BLTCON.push({ name: "USEC", enabled: !!(amiga.blit.BLTCON0 & BLTCON0Flags.USEC) });
		BLTCON.push({ name: "USED", enabled: !!(amiga.blit.BLTCON0 & BLTCON0Flags.USED) });
		BLTCON.push({ name: "DOFF", enabled: !!(amiga.blit.BLTCON1 & BLTCON1Flags.DOFF) });
		BLTCON.push({ name: "EFE",  enabled: !!(amiga.blit.BLTCON1 & BLTCON1Flags.EFE) });
		BLTCON.push({ name: "IFE",  enabled: !!(amiga.blit.BLTCON1 & BLTCON1Flags.IFE) });
		BLTCON.push({ name: "FCI",  enabled: !!(amiga.blit.BLTCON1 & BLTCON1Flags.FCI) });
		BLTCON.push({ name: "DESC", enabled: !!(amiga.blit.BLTCON1 & BLTCON1Flags.DESC) });
		// TODO: line mode
		//BLTCON.push({ name: "LINE", enabled: !!(amiga.blit.BLTCON1 & BLTCON1Flags.LINE) });
	}

	const file = label?.split(/\\|\//g).pop();
	const tooltipLeft = clamp(10, canvasRect.left + canvasRect.width * left + 10, canvasRect.right - 600);
	const tooltipTop = canvasRect.top + lowerY + 10;
	const tooltipWidth = 450;
	return (<Fragment>
		<div
			className={styles.tooltip}
			aria-live="polite"
			aria-atomic={true}
			style={{ left: tooltipLeft, top: tooltipTop, bottom: 'initial', width: tooltipWidth + 'px' }}
		>
			<dl>
				{isDma && (<Fragment>
					<dt>DMA Request</dt>
					<dd className={styles.function}>{location.callFrame.functionName}</dd>
					{amiga.dmaRecord.addr !== undefined && amiga.dmaRecord.addr !== 0xffffffff && (
						<Fragment>
							<dt className={styles.time}>Address</dt>
							<dd className={styles.time}>{symbolize(amiga.dmaRecord.addr & 0x00ffffff, model.amiga)}</dd>
						</Fragment>
					)}
					{dmaReg && (<Fragment>
						<dt className={styles.time}>Register</dt>
						<dd className={styles.time}>{dmaReg}</dd>
					</Fragment>)}
					{dmaData && (<Fragment>
						<dt className={styles.time}>Data</dt>
						<dd className={styles.time}>{dmaData}</dd>
					</Fragment>)}
					{dmaEvents && (<Fragment>
						<dt className={styles.time}>Events</dt>
						<dd className={styles.time}>{dmaEvents}</dd>
					</Fragment>)}
					<dt className={styles.time}>DMA Control</dt>
					<dd className={styles.time}>{dmaChannels.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
					<dt className={styles.time}>Line</dt>
					<dd className={styles.time}>{location.callFrame.lineNumber}</dd>
					<dt className={styles.time}>Color Clock</dt>
					<dd className={styles.time}>{location.callFrame.columnNumber}</dd>
				</Fragment>)}
				{isBlit && (<Fragment>
					<dt className={styles.time}>Size</dt>
					<dd className={styles.time}>{amiga.blit.BLTSIZH * 16}x{amiga.blit.BLTSIZV}px</dd>
					<dt className={styles.time}>Blitter Control</dt>
					<dd className={styles.time}>{BLTCON.map((d) => (<div class={d.enabled ? styles.biton : styles.bitoff}>{d.name}</div>))}</dd>
					{[0, 1, 2, 3].filter((channel) => amiga.blit.BLTCON0 & (1 << (11 - channel))).map((channel) => (<Fragment>
						<dt className={styles.time}>{['Source A', 'Source B', 'Source C', 'Destination'][channel]}</dt>
						<dd className={styles.time}>{symbolize(amiga.blit.BLTxPT[channel], model.amiga)} 
						{channel === 0 && (<Fragment><span class={styles.eh}>Shift</span> {(amiga.blit.BLTCON0 >>> 12).toString()}</Fragment>)}
						{channel === 1 && (<Fragment><span class={styles.eh}>Shift</span> {(amiga.blit.BLTCON1 >>> 12).toString()}</Fragment>)}
						<span class={styles.eh}>Modulo</span> {amiga.blit.BLTxMOD[channel]}</dd>
						{channel === 0 && (<Fragment>
							<dt className={styles.time}>Masks</dt>
							<dd><b>FWM</b> %{amiga.blit.BLTAFWM.toString(2).padStart(16, '0')} <span class={styles.eh}>LWM</span> %{amiga.blit.BLTALWM.toString(2).padStart(16, '0')}</dd>
						</Fragment>)}
					</Fragment>))}
					<dt className={styles.time}>Start</dt>
					<dd className={styles.time}>Line {amiga.blit.vposStart}, Color Clock {amiga.blit.hposStart}</dd>
					{amiga.blit.vposEnd && (<Fragment>
						<dt className={styles.time}>End</dt>
						<dd className={styles.time}>Line {amiga.blit.vposEnd}, Color Clock {amiga.blit.hposEnd}</dd>
					</Fragment>)}
				</Fragment>)}
				{isFunction && (<Fragment>
					<dt>{dataName(displayUnit) === 'Time' ? 'Function' : 'Symbol'}</dt>
					<dd className={styles.function}>{location.callFrame.functionName}</dd>
					{label && (<Fragment>
						<dt>File</dt>
						<dd aria-label={file} className={classes(styles.label, location.src && styles.clickable)}>
							<MiddleOut aria-hidden={true} endChars={file?.length} text={label} />
						</dd>
					</Fragment>)}
					<dt className={styles.time}>Total {dataName(displayUnit)}</dt>
					<dd className={styles.time}>{formatValue(location.selfTime + location.aggregateTime, model.duration, displayUnit)}</dd>
					<dt className={styles.time}>Self {dataName(displayUnit)}</dt>
					<dd className={styles.time}>{formatValue(location.selfTime, model.duration, displayUnit)}</dd>
					{location.aggregateTime > 0 && (<Fragment>
						<dt className={styles.time}>Aggregate {dataName(displayUnit)}</dt>
						<dd className={styles.time}>{formatValue(location.aggregateTime, model.duration, displayUnit)}</dd>
					</Fragment>)}
				</Fragment>)}
			</dl>
			{label && (<div className={styles.hint}>
				Ctrl+{src === HighlightSource.Keyboard ? 'Enter' : 'Click'} to jump to file
			</div>)}
			</div>
		{(isBlit && (amiga.blit.BLTCON0 & BLTCON0Flags.USED)) && <div class={styles.tooltip} style={{ lineHeight: 0, left: tooltipLeft + tooltipWidth + 4, top: tooltipTop, bottom: 'initial' }}>
			<Screen model={model} screen={GetScreenFromBlit(amiga.blit)} palette={GetPaletteFromCustomRegs(new Uint16Array(model.amiga.customRegs))} useZoom={false} />
		</div>}
	</Fragment>);
};
