/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { h, render, FunctionComponent, Fragment } from 'preact';
import { useCallback, useContext, useMemo } from 'preact/hooks';
import styles from './client.css';
//import { IReopenWithEditor } from 'vscode-js-profile-core/out/esm/cpu/types';
import { cpuProfileLayoutFactory } from './layout';
import { IProfileModel, IGraphNode } from './model';
//import { createBottomUpGraph } from './bottomUpGraph';
import { createTopDownGraph } from './table/topDownGraph';
import { TimeView } from './table/time-view';
import { FlameGraph, Constants as FlameConstants } from './flame/flame-graph';
import { buildColumns, LocationAccessor } from './flame/stacks';

declare const MODEL: IProfileModel;
MODEL.duration = 20000; // DMA TEST
const columns = buildColumns(MODEL);

// calc max. height of flamegraph
let maxY = (FlameConstants.BoxHeight) * 2 + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 padding
for(const col of columns) {
	const y = (FlameConstants.BoxHeight) * (col.rows.length + 2) + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 padding
	maxY = Math.max(maxY, y);
}

//const graph = createBottomUpGraph(MODEL);
const graph = createTopDownGraph(MODEL);

const FlameGraphWrapper: FunctionComponent<{ data: ReadonlyArray<LocationAccessor> }> = ({
	data,
}) => {
	const filtered = useMemo(() => LocationAccessor.getFilteredColumns(columns, data), [data]);
	return <FlameGraph model={MODEL} columns={filtered} />;
};

const CpuProfileLayout = cpuProfileLayoutFactory();

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);

// FLAME+TABLE
render(
	<Fragment>
		<CpuProfileLayout
			dataFlame={{
				data: LocationAccessor.rootAccessors(columns),
				getChildren: 'return node.children',
				properties: {
					function: 'node.callFrame.functionName',
					url: 'node.callFrame.url',
					line: '(node.src ? node.src.lineNumber : node.callFrame.lineNumber)',
					path: '(node.src ? node.src.relativePath : node.callFrame.url)',
					selfTime: 'node.selfTime',
					totalTime: 'node.aggregateTime',
					id: 'node.id',
				},
			}}
			getDefaultFilterTextFlame={(node) => [
				node.callFrame.functionName,
				node.callFrame.url,
				node.src?.source.path ?? '',
			]}
			bodyFlame={FlameGraphWrapper}
			flameHeight={maxY}

			dataTable={{
				data: Object.values(graph.children),
				properties: {
					function: 'node.callFrame.functionName',
					url: 'node.callFrame.url',
					line: '(node.src ? node.src.lineNumber : node.callFrame.lineNumber)',
					path: '(node.src ? node.src.relativePath : node.callFrame.url)',
					selfTime: 'node.selfTime',
					totalTime: 'node.aggregateTime',
					id: 'node.id',
				},
				getChildren: 'return Object.values(node.children)',
			}}
			getDefaultFilterTextTable={(node) => [
				node.callFrame.functionName,
				node.callFrame.url,
				node.src?.source.path ?? '',
			]}
			bodyTable={TimeView}
		/>,
	</Fragment>,
	container,
  );

// TABLE
/*render(
	<CpuProfileLayoutTable
		data={{
			data: Object.values(graph.children),
			properties: {
				function: 'node.callFrame.functionName',
				url: 'node.callFrame.url',
				line: '(node.src ? node.src.lineNumber : node.callFrame.lineNumber)',
				path: '(node.src ? node.src.relativePath : node.callFrame.url)',
				selfTime: 'node.selfTime',
				totalTime: 'node.aggregateTime',
				id: 'node.id',
			},
			getChildren: 'return Object.values(node.children)',
		}}
		getDefaultFilterText={(node) => [
			node.callFrame.functionName,
			node.callFrame.url,
			node.src?.source.path ?? '',
		]}
		body={TimeView}
	/>,
	container,
);
*/