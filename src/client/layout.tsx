import { h, FunctionComponent, Fragment, JSX } from 'preact';
import { useState, useMemo, useEffect, useCallback, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './layout.module.css';

import { IProfileModel } from './model';
declare const MODELS: IProfileModel[];

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
import { Blit } from './dma';

export const CpuProfileLayout: FunctionComponent<{}> = ({ }) => {
	const [frame, setFrame] = useState(0);
	const [regex, setRegex] = useState(false);
	const [caseSensitive, setCaseSensitive] = useState(false);
	const [text, setFilter] = useState('');
	const [displayUnit, setDisplayUnit] = useState<DisplayUnit>(MODELS[0].amiga ? DisplayUnit.PercentFrame : DisplayUnit.Bytes);

	const filter: IRichFilter = { text, caseSensitive, regex };

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
		setFrame(parseInt(event.srcElement.attributes.data.nodeValue));
	}, [setFrame]);

	const frameHover = useRef<HTMLImageElement>();

	const onEnterFrame = useCallback((evt: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		const rect = evt.currentTarget.getBoundingClientRect();
		console.log("enter", rect);
		frameHover.current.src = evt.currentTarget.src;
		frameHover.current.parentElement.style.visibility = '';
		frameHover.current.parentElement.style.left = Math.min(window.innerWidth - 20 - evt.currentTarget.naturalWidth, rect.left) + 'px';
		frameHover.current.parentElement.style.top = (rect.bottom + 10) + 'px';
	}, [frameHover]);
	const onLeaveFrame = useCallback((evt: JSX.TargetedMouseEvent<HTMLImageElement>) => {
		console.log("leave");
		frameHover.current.parentElement.style.visibility = 'hidden';
		frameHover.current.src = '';
	}, [frameHover]);

	return (
		<Fragment>
			{MODELS[0].amiga && MODELS.length > 1 && <Fragment>
				<div class={styles.frames}>
					{MODELS.map((MODEL, fr) => <img onClick={onClickFrame} onMouseEnter={onEnterFrame} onMouseLeave={onLeaveFrame} data={fr.toString()} src={MODEL.amiga.screenshot} title={`Frame ${fr}`} />)}
				</div>
				{createPortal(<div class={styles.tooltip} style={{left: 50, top: 100, visibility: 'hidden'}}>
					<img ref={frameHover} />
				</div>, document.body)}
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
					<TabPanel style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
						<GfxResourcesView frame={frame} time={time} />
					</TabPanel>
					<TabPanel style={{ overflow: 'auto' }}>
						<BlitterList frame={frame} />
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
