/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { h, FunctionComponent, Fragment, ComponentType } from 'preact';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './layout.module.css';
import { IDataSource } from './datasource';
import { IGraphNode, IProfileModel } from './model';
import { LocationAccessor, IColumn } from './flame/stacks';
import { DisplayUnit } from './display';
import { UnitSelect } from './unit-select';
import { Filter, IRichFilter } from './filter';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './react-tabs.css';
import { CopperVis } from './debugger/copper';

export interface IBodyProps<T> {
	model: IProfileModel;
	data: ReadonlyArray<T>;
	filter: IRichFilter;
	displayUnit: DisplayUnit;
}

type CpuProfileLayoutComponent = FunctionComponent<{
	model: IProfileModel;
	displayUnit: DisplayUnit;

	dataFlame: IDataSource<IColumn>;
	bodyFlame: ComponentType<IBodyProps<IColumn>>;
	flameHeight: number;

	dataTable: IDataSource<IGraphNode>;
	bodyTable: ComponentType<IBodyProps<IGraphNode>>;
}>;

/**
 * Base layout component to display CPU-profile related info.
 */
export const cpuProfileLayoutFactory = (): CpuProfileLayoutComponent => ({
	model,
	displayUnit,

	dataFlame,
	bodyFlame: BodyFlame,
	flameHeight,

	dataTable,
	bodyTable: BodyTable,
}) => {
	const [regex, setRegex] = useState(false);
	const [caseSensitive, setCaseSensitive] = useState(false);
	const [text, setFilter] = useState('');
	const [displayUnit2, setDisplayUnit] = useState(displayUnit);

	const filter: IRichFilter = { text, caseSensitive, regex };

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
									value={displayUnit2}
									onChange={setDisplayUnit}
								/>
							</Fragment>
						}
					/>
				</div>
			</div>
			<div className={styles.rows} style={{flexBasis: `${flameHeight}px`, flexGrow: 0}}>
				<BodyFlame model={model} data={dataFlame.data} filter={filter} displayUnit={displayUnit2} />
			</div>
			<Tabs defaultIndex={1} style={{flexBasis: 0, flexGrow: 1}} className={styles.rows}>
				<TabList>
					<Tab>Profiler</Tab>
					<Tab>Debugger</Tab>
				</TabList>
				<TabPanel style={{ overflow: 'auto' }}>
					<BodyTable model={model} data={dataTable.data} filter={filter} displayUnit={displayUnit2} />
				</TabPanel>
				<TabPanel style={{ overflow: 'auto' }}>
					<CopperVis model={model} />
				</TabPanel>
			</Tabs>
		</Fragment>
	);
};
