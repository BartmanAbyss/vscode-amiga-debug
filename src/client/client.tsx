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
import { DisplayUnit } from './display';

declare const MODEL: IProfileModel;
if(MODEL.dmaRecords)
	MODEL.duration = Math.max(7_093_790 / 50, MODEL.duration); // DMA TEST
const columns = buildColumns(MODEL);

// calc max. height of flamegraph
let maxY = (FlameConstants.BoxHeight) * 2 + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 padding
for(const col of columns) {
	const y = (FlameConstants.BoxHeight) * (col.rows.length + 2) + FlameConstants.TimelineHeight; // +1 for dmaRecord, +1 padding
	maxY = Math.max(maxY, y);
}

//const graph = createBottomUpGraph(MODEL);
const graph = createTopDownGraph(MODEL);

const CpuProfileLayout = cpuProfileLayoutFactory();

const container = document.createElement('div');
container.classList.add(styles.wrapper);
document.body.appendChild(container);

// FLAME+TABLE
render(
	<Fragment>
		<CpuProfileLayout
			model={MODEL}
			displayUnit={MODEL.dmaRecords ? DisplayUnit.PercentFrame : DisplayUnit.Bytes}

			dataFlame={{
				data: columns,
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
			bodyFlame={FlameGraph}
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
			bodyTable={TimeView}
		/>
	</Fragment>,
	container,
);
