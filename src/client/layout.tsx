import { h, FunctionComponent, Fragment, ComponentType } from 'preact';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './layout.module.css';

import { IProfileModel } from './model';
declare const MODEL: IProfileModel;

import { DisplayUnit, DisplayUnitType } from './display';
import { UnitSelect } from './unit-select';
import { Filter, IRichFilter } from './filter';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';

import { CopperList } from './debugger/copper';
import { BlitterList } from './debugger/blitter';
import { FlameGraph, Constants as FlameConstants } from './flame/flame-graph';
import { TimeView } from './table/time-view';
import { createTopDownGraph } from './table/topDownGraph';
import { buildColumns } from './flame/stacks';

export const CpuProfileLayout: FunctionComponent<{}> = ({ }) => {
	const [regex, setRegex] = useState(false);
	const [caseSensitive, setCaseSensitive] = useState(false);
	const [text, setFilter] = useState('');
	const [displayUnit, setDisplayUnit] = useState<DisplayUnit>(MODEL.amiga ? DisplayUnit.PercentFrame : DisplayUnit.Bytes);

	const filter: IRichFilter = { text, caseSensitive, regex };

	const dataFlame = useMemo(() => buildColumns(MODEL), [MODEL]);
	const dataTable = useMemo(() => Object.values(createTopDownGraph(MODEL).children), [MODEL]);

	const flameHeight = useMemo(() => {
		const extraRows = (MODEL.amiga ? 2 : 0) + 1; // +1 for dmaRecord, +1 for blits, +1 padding
		let flameHeight = (FlameConstants.BoxHeight) * extraRows + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 for blits, +1 padding
		for(const col of dataFlame) {
			const y = (FlameConstants.BoxHeight) * (col.rows.length + extraRows) + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 for blits, +1 padding
			flameHeight = Math.max(flameHeight, y);
		}
		return flameHeight;
	}, [MODEL]);

	const [time, setTime] = useState(0);

	return (
		<Fragment>
			<div className={styles.filter}>
				<div className={styles.f}>
					<Filter
						value={text}
						placeholder="Filter functions or files"
						onChange={setFilter}
						foot={<Fragment>
							<ToggleButton icon={CaseSensitive} label="Match Case" checked={caseSensitive} onChange={setCaseSensitive} />
							<ToggleButton icon={Regex} label="Use Regular Expression" checked={regex} onChange={setRegex} />
							<UnitSelect value={displayUnit} type={MODEL.amiga ? DisplayUnitType.Time : DisplayUnitType.Size} onChange={setDisplayUnit} />
						</Fragment>}
					/>
				</div>
			</div>
			<div className={styles.rows} style={{flexBasis: `${flameHeight}px`, flexGrow: 0}}>
				<FlameGraph data={dataFlame} filter={filter} displayUnit={displayUnit} time={time} setTime={setTime} />
			</div>
			{MODEL.amiga ? <Tabs defaultIndex={1} style={{flexBasis: 0, flexGrow: 1}} className={styles.rows} forceRenderTabPanel={true}>
				<TabList>
					<Tab>Profiler</Tab>
					<Tab>Copper</Tab>
					<Tab>Blitter</Tab>
				</TabList>
				<TabPanel style={{ overflow: 'auto' }}>
					<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
				</TabPanel>
				<TabPanel style={{ overflow: 'auto' }}>
					<CopperList />
				</TabPanel>
				<TabPanel style={{ overflow: 'auto' }}>
					<BlitterList />
				</TabPanel>
			</Tabs> : <div class={styles.rows}>
				<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
			</div>}
		</Fragment>
	);
};
