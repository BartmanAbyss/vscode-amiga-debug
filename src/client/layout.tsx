import { FunctionComponent, JSX } from 'preact';
import { useState, useMemo, useCallback, useRef } from 'preact/hooks';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './layout.module.css';

import { IProfileModel, buildModel } from './model';
import { ICpuProfileRaw } from './types';
declare const MODELS: IProfileModel[];
declare let PROFILES: ICpuProfileRaw[];

import { DisplayUnit, DisplayUnitType } from './display';
import { UnitSelect } from './unit-select';
import { Filter, IRichFilter } from './filter';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';
import Split from 'react-split';

import { CopperView } from './debugger/copper';
import { BlitterList } from './debugger/blitter';
import { FlameGraph, Constants as FlameConstants } from './flame/flame-graph';
import { TimeView } from './table/time-view';
import { createTopDownGraph } from './table/topDownGraph';
import { buildColumns } from './flame/stacks';
import { GfxResourcesView } from './debugger/resources';
import { DeniseView } from "./debugger/screen";
import { CustomRegsView } from './debugger/customregs';

//import 'pubsub-js';
import { dmaTypes, DmaTypes, DmaSubTypes, GetBlitCycles } from './dma';
import { ObjdumpView } from './objdump';
import { MemoryView } from './debugger/memory';

/*
// https://github.com/ticlo/rc-dock/issues/161

import { DockLayout, LayoutData } from 'rc-dock';
import "rc-dock/dist/rc-dock.css";

const defaultLayout: LayoutData = {
	dockbox: {
		mode: 'horizontal',
		children: [
			{
				tabs: [
					{ id: 'tab1', title: 'tab1', content: <div><div>Hello World</div></div> }
				]
			}
		]
	}
};

<DockLayout defaultLayout={layout} style={{position: 'absolute', left: 10, top: 10, right: 10, bottom: 10}}/>
*/

export const CpuProfileLayout: FunctionComponent<{}> = (_) => {
	const [frame, setFrame] = useState(0);
	const [regex, setRegex] = useState(false);
	const [caseSensitive, setCaseSensitive] = useState(false);
	const [text, setFilter] = useState('');
	const [displayUnit, setDisplayUnit] = useState<DisplayUnit>(MODELS[0].amiga ? DisplayUnit.PercentFrame : DisplayUnit.Bytes);

	const filter: IRichFilter = useMemo(() => ({ text, caseSensitive, regex }), [text, caseSensitive, regex]);

	const dataFlame = useMemo(() => buildColumns(MODELS[frame]), [frame]);
	const dataTable = useMemo(() => Object.values(createTopDownGraph(MODELS[frame]).children), [frame]);

	const flameHeight = useMemo(() => {
		const extraRows = (MODELS[frame].amiga ? 2 : 0) + 1 + 1; // +1 for dmaRecord, +1 for blits, +1 padding, +1 for scrollbar
		let flameHeight = (FlameConstants.BoxHeight) * extraRows + FlameConstants.TimelineHeight;
		for(const col of dataFlame) {
			const y = (FlameConstants.BoxHeight) * (col.rows.length + extraRows) + FlameConstants.TimelineHeight;
			flameHeight = Math.max(flameHeight, y);
		}
		return flameHeight;
	}, [frame]);

	const [time, setTime] = useState(0); // in CPU-cycles (DMA-cycle = CPU-cycle / 2)
	const [memoryAddr, setMemoryAddrUnsafe] = useState(0);
	const setMemoryAddr = useCallback((addr: number) => {
		const memInfo = MODELS[0].memory;
		if((addr >= memInfo.chipMemAddr && addr < memInfo.chipMemAddr + memInfo.chipMem.length)
		|| (addr >= memInfo.bogoMemAddr && addr < memInfo.bogoMemAddr + memInfo.bogoMem.length)) { // only Chipmem & Bogomem
			setMemoryAddrUnsafe(addr & ~1);
		}
	}, [setMemoryAddrUnsafe]);

	enum LeftTab {
		profiler,
		assembly,
		screen,
		resources,
		blitter
	}
	enum RightTab {
		copper,
		customRegs,
		memory,
	}

	const [leftTab, setLeftTab] = useState(process.env.NODE_ENV === 'development' ? LeftTab.screen : LeftTab.profiler/*profiler*//*assembly*/);
	const [rightTab, setRightTab] = useState(/*process.env.NODE_ENV === 'development' ? RightTab.memory :*/ RightTab.copper);

	/*useEffect(() => {
		const token = PubSub.subscribe('showBlit', () => setLeftTab(LeftTab.blitter));
		return () => PubSub.unsubscribe(token);
	}, []);*/

	const onClickFrame = useCallback(async (event: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		const fr = parseInt(event.currentTarget.getAttribute('data'));
		// build models on demand. memory, copper, blits have already been filled by client.tsx
		if(!MODELS[fr].nodes)
			MODELS[fr] = { ...MODELS[fr], ...buildModel(PROFILES[fr]) };
		setFrame(fr);
	}, [setFrame]);

	// don't use createPortal, causes too much re-render
	const frameHover = useRef<HTMLImageElement>();

	const onEnterFrame = useCallback((evt: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		const rect = evt.currentTarget.getBoundingClientRect();
		frameHover.current.src = evt.currentTarget.src;
		frameHover.current.parentElement.style.visibility = '';
		frameHover.current.parentElement.style.left = `${Math.min(window.innerWidth - 20 - evt.currentTarget.naturalWidth, rect.left)}px`;
		frameHover.current.parentElement.style.top = `${(rect.bottom + 10)}px`;
	}, [frameHover.current]);
	const onLeaveFrame = useCallback((evt: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		frameHover.current.parentElement.style.visibility = 'hidden';
		frameHover.current.src = '';
	}, [frameHover.current]);

	const colorToHex = (color: number) => '#' + 
		((color >>> 0) & 0xff).toString(16).padStart(2, '0') +
		((color >>> 8) & 0xff).toString(16).padStart(2, '0') +
		((color >>> 16) & 0xff).toString(16).padStart(2, '0');

	const cpuColor = colorToHex(dmaTypes.get(DmaTypes.CPU).subtypes.get(DmaSubTypes.CPU_CODE).color);
	const blitColor = colorToHex(dmaTypes.get(DmaTypes.BLITTER).subtypes.get(DmaSubTypes.BLITTER).color);

	const frameBlitCycles = useMemo(() => {
		const cycles: number[] = [];
		if(PROFILES[0].$amiga) {
			for(const p of PROFILES)
				cycles.push(GetBlitCycles(p.$amiga.dmaRecords));
		}
		return cycles;
	}, []);

	return (
		<>
			{PROFILES[0].$amiga && PROFILES.length > 1 && <>
				<div class={styles.frames}>
					{PROFILES.map((PROFILE, fr) => <div class={styles.frame}>
						<img style={{border: '2px solid ' + (fr === frame ? 'var(--vscode-focusBorder)' : 'transparent') }} onClick={onClickFrame} onMouseEnter={onEnterFrame} onMouseLeave={onLeaveFrame} data={fr.toString()} src={PROFILE.$amiga.screenshot} alt={`Frame ${fr + 1}`} />
						<div class={styles.label}>{fr + 1}</div>
						<div style={{width: `${100 - (100 * PROFILE.$amiga.idleCycles / (7_093_790 / 50))}%`, backgroundColor: cpuColor, height: '5px'}} />
						<div style={{width: `${100 * frameBlitCycles[fr] / (7_093_790 / 2 / 50)}%`, backgroundColor: blitColor, height: '5px'}} />
					</div>)}
				</div>
				<div class={styles.tooltip} style={{left: 50, top: 100, visibility: 'hidden'}}>
					<img ref={frameHover} />
				</div>
			</>}
			<div className={styles.filter}>
				<div className={styles.f}>
					<Filter value={text} placeholder="Filter functions or files" onChange={setFilter}
						foot={<>
							<ToggleButton icon={CaseSensitive} label="Match Case" checked={caseSensitive} onChange={setCaseSensitive} />
							<ToggleButton icon={Regex} label="Use Regular Expression" checked={regex} onChange={setRegex} />
							<UnitSelect value={displayUnit} type={MODELS[0].amiga ? DisplayUnitType.Time : DisplayUnitType.Size} onChange={setDisplayUnit} />
						</>}
					/>
				</div>
			</div>
			<div className={styles.rows} style={{flexBasis: `${flameHeight}px`, flexGrow: 0, minHeight: `${flameHeight}px`}}>
				<FlameGraph frame={frame} data={dataFlame} filter={filter} displayUnit={displayUnit} time={time} setTime={setTime} />
			</div>
			{MODELS[0].amiga ? <Split sizes={[70,30]} gutterSize={2} cursor="w-resize" className={styles.split}>
				<Tabs selectedIndex={leftTab} onSelect={(tabIndex) => setLeftTab(tabIndex)} className={styles.tabs}>
					<TabList>
						<Tab>Profiler</Tab>
						<Tab>Assembly</Tab>
						<Tab>Screen (Beta)</Tab>
						<Tab>Resources</Tab>
						<Tab>Blitter</Tab>
					</TabList>
					<TabPanel style={leftTab === LeftTab.profiler ? { overflow: 'auto', display: 'flex', flexDirection: 'column' } : {}}>
						<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
					</TabPanel>
					<TabPanel style={leftTab === LeftTab.assembly ? { overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' } : {}}>
						<ObjdumpView frame={frame} time={time} setMemoryAddr={setMemoryAddr} />
					</TabPanel>
					<TabPanel style={leftTab === LeftTab.screen ? { overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' } : {}}>
						<DeniseView frame={frame} time={time} setTime={setTime} />
					</TabPanel>
					<TabPanel style={leftTab === LeftTab.resources ? { overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' } : {}}>
						<GfxResourcesView frame={frame} time={time} />
					</TabPanel>
					<TabPanel style={{ overflow: 'auto' }}>
						<BlitterList frame={frame} time={time} />
					</TabPanel>
				</Tabs>
				<Tabs selectedIndex={rightTab} onSelect={(tabIndex) => setRightTab(tabIndex)} className={styles.tabs}>
					<TabList>
						<Tab>Copper</Tab>
						<Tab>Custom Registers</Tab>
						<Tab>Memory</Tab>
					</TabList>
					<TabPanel style={rightTab === RightTab.copper ? { overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' } : {}}>
						<CopperView frame={frame} time={time} />
					</TabPanel>
					<TabPanel style={rightTab === RightTab.customRegs ? { overflow: 'auto' } : {}}>
						<CustomRegsView frame={frame} time={time} setTime={setTime} />
					</TabPanel>
					<TabPanel style={rightTab === RightTab.memory ? { overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' } : {  overflow: 'auto' }}>
						<MemoryView frame={frame} time={time} memoryAddr={memoryAddr} setMemoryAddr={setMemoryAddr} />
					</TabPanel>
				</Tabs>
			</Split>
			: <div class={styles.rows}>
				<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
			</div>}
		</>
	);
};
