/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { h, FunctionComponent, Fragment, ComponentType } from 'preact';
import { useState, useMemo, useEffect } from 'preact/hooks';
import { Filter } from './filter';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './layout.css';
import { IDataSource } from './datasource';
import { IGraphNode } from './model';
import { LocationAccessor } from './flame/stacks';
import { DisplayUnit } from './display';
import { UnitSelect } from './unit-select';

/**
 * Filter that the RichFilter returns,
 */
interface IRichFilter {
	text: string;
	caseSensitive?: boolean;
	regex?: boolean;
}

/**
 * Compile the filter into a predicate function.
 */
const compileFilter = (fn: IRichFilter): ((input: string) => boolean) => {
	if (fn.regex) {
		const re = new RegExp(fn.text, fn.caseSensitive ? '' : 'i');
		return (input) => re.test(input);
	}

	if (!fn.caseSensitive) {
		const test = fn.text.toLowerCase();
		return (input) => input.toLowerCase().includes(test);
	}

	return (input) => input.includes(fn.text);
};

export interface IBodyProps<T> {
	data: ReadonlyArray<T>;
	displayUnit: DisplayUnit;
}

type CpuProfileLayoutComponent = FunctionComponent<{
	displayUnit: DisplayUnit;

	dataFlame: IDataSource<LocationAccessor>;
	getDefaultFilterTextFlame: (value: LocationAccessor) => ReadonlyArray<string>;
	bodyFlame: ComponentType<IBodyProps<LocationAccessor>>;

	dataTable: IDataSource<IGraphNode>;
	getDefaultFilterTextTable: (value: IGraphNode) => ReadonlyArray<string>;
	bodyTable: ComponentType<IBodyProps<IGraphNode>>;

	flameHeight: number;
}>;

/**
 * Base layout component to display CPU-profile related info.
 */
export const cpuProfileLayoutFactory = (): CpuProfileLayoutComponent => ({
	displayUnit,

	dataTable,
	getDefaultFilterTextTable,
	bodyTable: BodyTable,

	dataFlame,
	getDefaultFilterTextFlame,
	bodyFlame: BodyFlame,

	flameHeight,
}) => {
	const [filteredDataTable, setFilteredDataTable] = useState<ReadonlyArray<IGraphNode>>(dataTable.data);
	const [filteredDataFlame, setFilteredDataFlame] = useState<ReadonlyArray<LocationAccessor>>(dataFlame.data);
	const [regex, setRegex] = useState(false);
	const [caseSensitive, setCaseSensitive] = useState(false);
	const [text, setFilter] = useState('');
	const [displayUnit2, setDisplayUnit] = useState(displayUnit);

	useEffect(() => {
		const filter = compileFilter({ text, caseSensitive, regex });
		setFilteredDataTable(dataTable.data.filter((d) => getDefaultFilterTextTable(d).some(filter)));
		setFilteredDataFlame(dataFlame.data.filter((d) => getDefaultFilterTextFlame(d).some(filter)));
		return;
	}, [regex, caseSensitive, text]);

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
				<BodyFlame data={filteredDataFlame} displayUnit={displayUnit2} />
			</div>
			<div className={styles.rows} style={{flexBasis: 0, flexGrow: 1}}>
				<BodyTable data={filteredDataTable} displayUnit={displayUnit2} />
			</div>
		</Fragment>
	);
};
