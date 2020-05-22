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
const columns = buildColumns(MODEL);

let maxY = 0;
for(const col of columns) {
	const y = (FlameConstants.BoxHeight) * (col.rows.length + 1) + FlameConstants.TimelineHeight; // + 1 for padding
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

const Body: FunctionComponent<{}> = () => {
	return <Fragment>
		{FlameGraphWrapper}
		{TimeView}
	</Fragment>;
};

const CpuProfileLayoutTable = cpuProfileLayoutFactory<IGraphNode>();
const CpuProfileLayoutFlame = cpuProfileLayoutFactory<LocationAccessor>();

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);

/*// SPEEDSCOPE
import { createAppStore } from './speedscope/store';
import { Provider } from './speedscope/lib/preact-redux';
import { ApplicationContainer } from './speedscope/views/application-container';

const lastStore: any = (window as any)['store'];
const store = createAppStore(lastStore ? lastStore.getState() : {});
(window as any)['store'] = store;

render(
	<Provider store={store}>
		<ApplicationContainer />
	</Provider>,
	container
);
*/

// FLAME
render(
	<Fragment>
		<CpuProfileLayoutFlame
		data={{
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
		getDefaultFilterText={(node) => [
			node.callFrame.functionName,
			node.callFrame.url,
			node.src?.source.path ?? '',
		]}
		body={FlameGraphWrapper}
		flexBasis={maxY}
		flexGrow={0}
		/>
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
			flexBasis={0}
			flexGrow={1}
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