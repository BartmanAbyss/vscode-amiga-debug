import { h, FunctionComponent, Fragment, ComponentType } from 'preact';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './layout.module.css';
import { IProfileModel } from './model';
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

export const CpuProfileLayout: FunctionComponent<{
	model: IProfileModel;
}> = ({ model }) => {
	const [regex, setRegex] = useState(false);
	const [caseSensitive, setCaseSensitive] = useState(false);
	const [text, setFilter] = useState('');
	const [displayUnit, setDisplayUnit] = useState<DisplayUnit>(model.amiga ? DisplayUnit.PercentFrame : DisplayUnit.Bytes);

	const filter: IRichFilter = { text, caseSensitive, regex };

	const columns = buildColumns(model);
	const graph = createTopDownGraph(model);

	const dataFlame = columns;
	const dataTable = Object.values(graph.children);

	// calc max. height of flamegraph
	let flameHeight = (FlameConstants.BoxHeight) * 3 + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 for blits, +1 padding
	for(const col of dataFlame) {
		const y = (FlameConstants.BoxHeight) * (col.rows.length + 3) + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 for blits, +1 padding
		flameHeight = Math.max(flameHeight, y);
	}

	return (
		<Fragment>
			<div className={styles.filter}>
				<div className={styles.f}>
					<Filter
						value={text}
						placeholder="Filter functions or files"
						onChange={setFilter}
						foot={
							<Fragment>
								<ToggleButton
									icon={CaseSensitive}
									label="Match Case"
									checked={caseSensitive}
									onChange={setCaseSensitive}
								/>
								<ToggleButton
									icon={Regex}
									label="Use Regular Expression"
									checked={regex}
									onChange={setRegex}
								/>
								<UnitSelect
									value={displayUnit}
									type={model.amiga ? DisplayUnitType.Time : DisplayUnitType.Size}
									onChange={setDisplayUnit}
								/>
							</Fragment>
						}
					/>
				</div>
			</div>
			<div className={styles.rows} style={{flexBasis: `${flameHeight}px`, flexGrow: 0}}>
				<FlameGraph model={model} data={dataFlame} filter={filter} displayUnit={displayUnit} />
			</div>
			{model.amiga ? <Tabs defaultIndex={1} style={{flexBasis: 0, flexGrow: 1}} className={styles.rows} forceRenderTabPanel={true}>
				<TabList>
					<Tab>Profiler</Tab>
					<Tab>Copper</Tab>
					<Tab>Blitter</Tab>
				</TabList>
				<TabPanel style={{ overflow: 'auto' }}>
					<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
				</TabPanel>
				<TabPanel style={{ overflow: 'auto' }}>
					<CopperList model={model} />
				</TabPanel>
				<TabPanel style={{ overflow: 'auto' }}>
					<BlitterList model={model} />
				</TabPanel>
			</Tabs> : <div class={styles.rows}>
				<TimeView data={dataTable} filter={filter} displayUnit={displayUnit} />
			</div>}
		</Fragment>
	);
};
