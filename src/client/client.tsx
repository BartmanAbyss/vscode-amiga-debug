/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { h, render, FunctionComponent } from 'preact';
import { useCallback, useContext } from 'preact/hooks';
import styles from './client.css';
//import { ToggleButton } from './toggle-button';
//import { VsCodeApi } from './vscodeApi';
//import { IReopenWithEditor } from 'vscode-js-profile-core/out/esm/cpu/types';
import { cpuProfileLayoutFactory } from './table/layout';
import { IProfileModel, IGraphNode } from './model';
//import { createBottomUpGraph } from './bottomUpGraph';
import { createTopDownGraph } from './table/topDownGraph';
import { TimeView } from './table/time-view';

declare const MODEL: IProfileModel;

//const graph = createBottomUpGraph(MODEL);
const graph = createTopDownGraph(MODEL);

const CpuProfileLayout = cpuProfileLayoutFactory<IGraphNode>();

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);
render(
	<CpuProfileLayout
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
