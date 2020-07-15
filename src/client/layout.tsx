import { h, FunctionComponent, Fragment, JSX } from 'preact';
import { useState, useMemo, useEffect, useCallback, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
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
import { CustomRegsView } from './debugger/customregs';

import 'pubsub-js';
import { dmaTypes, DmaTypes, DmaSubTypes, GetBlitCycles } from './dma';

export const CpuProfileLayout: FunctionComponent<{}> = ({ }) => {
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

	enum LeftTab {
		profiler,
		resources,
		blitter
	}
	enum RightTab {
		copper,
		customRegs,
	}

	const [leftTab, setLeftTab] = useState(LeftTab.profiler);
	const [rightTab, setRightTab] = useState(RightTab.copper);

	useEffect(() => {
		const token = PubSub.subscribe('showBlit', () => setLeftTab(LeftTab.blitter));
		return () => PubSub.unsubscribe(token);
	}, []);

	const onClickFrame = useCallback((event) => {
		const fr = parseInt(event.srcElement.attributes.data.nodeValue);
		if(!MODELS[fr])
			MODELS[fr] = buildModel(PROFILES[fr]);
		setFrame(fr);
	}, [setFrame]);

	// don't use createPortal, causes too much re-render
	const frameHover = useRef<HTMLImageElement>();

	const onEnterFrame = useCallback((evt: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		const rect = evt.currentTarget.getBoundingClientRect();
		frameHover.current.src = evt.currentTarget.src;
		frameHover.current.parentElement.style.visibility = '';
		frameHover.current.parentElement.style.left = Math.min(window.innerWidth - 20 - evt.currentTarget.naturalWidth, rect.left) + 'px';
		frameHover.current.parentElement.style.top = (rect.bottom + 10) + 'px';
	}, [frameHover.current]);
	const onLeaveFrame = useCallback((evt: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		frameHover.current.parentElement.style.visibility = 'hidden';
		frameHover.current.src = '';
	}, [frameHover.current]);

	const colorToHex = (color: number) => '#' + 
		((color >>> 0) & 0xff).toString(16).padStart(2, '0') +
		((color >>> 8) & 0xff).toString(16).padStart(2, '0') +
		((color >>> 16) & 0xff).toString(16).padStart(2, '0');

	const cpuColor = colorToHex(dmaTypes[DmaTypes.CPU].subtypes[DmaSubTypes.CPU_CODE].color);
	const blitColor = colorToHex(dmaTypes[DmaTypes.BLITTER].subtypes[DmaSubTypes.BLITTER].color);

	const frameBlitCycles = useMemo(() => {
		const cycles: number[] = [];
		if(PROFILES[0].$amiga) {
			for(const p of PROFILES)
				cycles.push(GetBlitCycles(p.$amiga.dmaRecords));
		}
		return cycles;
	}, []);

	return (
		<Fragment>
			{PROFILES[0].$amiga && PROFILES.length > 1 && <Fragment>
				<div class={styles.frames}>
					{PROFILES.map((PROFILE, fr) => <div class={styles.frame}>
						<img style={{border: '2px solid ' + (fr === frame ? 'var(--vscode-focusBorder)' : 'transparent') }} onClick={onClickFrame} onMouseEnter={onEnterFrame} onMouseLeave={onLeaveFrame} data={fr.toString()} src={PROFILE.$amiga.screenshot} alt={`Frame ${fr + 1}`} />
						<div class={styles.label}>{fr + 1}</div>
						<div style={{width: (100 - (100 * PROFILE.$amiga.idleCycles / (7_093_790 / 50))) + '%', backgroundColor: cpuColor, height: '5px'}} />
						<div style={{width: (100 * frameBlitCycles[fr] / (7_093_790 / 2 / 50)) + '%', backgroundColor: blitColor, height: '5px'}} />
					</div>)}
				</div>
				<div class={styles.tooltip} style={{left: 50, top: 100, visibility: 'hidden'}}>
					<img ref={frameHover} />
				</div>
			</Fragment>}
			<div className={styles.filter}>
				<div className={styles.f}>
					<Filter value={text} placeholder="Filter functions or files" onChange={setFilter}
						foot={<Fragment>
							<ToggleButton icon={CaseSensitive} label="Match Case" checked={caseSensitive} onChange={setCaseSensitive} />
							<ToggleButton icon={Regex} label="Use Regular Expression" checked={regex} onChange={setRegex} />
							<UnitSelect value={displayUnit} type={MODELS[0].amiga ? DisplayUnitType.Time : DisplayUnitType.Size} onChange={setDisplayUnit} />
						</Fragment>}
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
						<Tab>Resources</Tab>
						<Tab>Blitter</Tab>
					</TabList>
					<TabPanel style={{ overflow: 'auto' }}>
						<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
					</TabPanel>
					<TabPanel style={{ overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
					</TabList>
					<TabPanel style={{ overflow: 'auto' }}>
						<CopperView frame={frame} time={time} />
					</TabPanel>
					<TabPanel style={{ overflow: 'auto' }}>
						<CustomRegsView frame={frame} time={time} setTime={setTime} />
					</TabPanel>
				</Tabs>
			</Split>
			: <div class={styles.rows}>
				<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
			</div>}
		</Fragment>
	);
};
