/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { ILocation, IProfileModel, IComputedNode, IGraphNode, Category } from '../model';
import { dmaTypes } from '../dma';

export class TopDownNode implements IGraphNode {
	public static root() {
		return new TopDownNode({
			id: -1,
			category: Category.System,
			selfTime: 0,
			aggregateTime: 0,
			ticks: 0,
			callFrame: {
				functionName: '(root)',
				lineNumber: -1,
				columnNumber: -1,
				scriptId: '0',
				url: '',
			},
		});
	}

	public children: { [id: number]: TopDownNode } = {};
	public aggregateTime = 0;
	public selfTime = 0;
	public ticks = 0;
	public childrenSize = 0;
	public filtered = true;

	public get id() {
		return this.location.id;
	}

	public get callFrame() {
		return this.location.callFrame;
	}

	public get src() {
		return this.location.src;
	}

	public get category() {
		return this.location.category;
	}

	constructor(public readonly location: ILocation, public readonly parent?: TopDownNode) { }

	public addNode(node: IComputedNode) {
		this.selfTime = node.selfTime;
		this.aggregateTime = node.aggregateTime;
	}

	public toJSON(): IGraphNode {
		return {
			children: this.children,
			childrenSize: this.childrenSize,
			aggregateTime: this.aggregateTime,
			selfTime: this.selfTime,
			ticks: this.ticks,
			id: this.id,
			category: this.category,
			callFrame: this.callFrame,
			filtered: this.filtered,
		};
	}
}

const processNode = (aggregate: TopDownNode, node: IComputedNode, model: IProfileModel) => {
	let child = aggregate.children[node.locationId];
	if (!child) {
		child = new TopDownNode(model.locations[node.locationId], aggregate);
		aggregate.childrenSize++;
		aggregate.children[node.locationId] = child;
	}

	child.addNode(node);

	for(const ch of node.children) {
		processNode(child, model.nodes[ch], model);
	}
};

const processDmaNodes = (parent: TopDownNode, model: IProfileModel) => {
	const dmaRecords = model.amiga.dmaRecords;
	if(dmaRecords === undefined)
		return;

	const dmaRootLoc: ILocation = {
		selfTime: 0,
		aggregateTime: 0,
		id: 0,
		ticks: 0,
		category: Category.User,
		callFrame: {
			functionName: "DMA",
			scriptId: '#dma',
			url: '',
			lineNumber: 0,
			columnNumber: 0
		}
	};
	dmaRootLoc.id = (model.locations as ILocation[]).push(dmaRootLoc) - 1;
	const dmaRoot = new TopDownNode(dmaRootLoc, parent);
	parent.childrenSize++;
	parent.children[dmaRootLoc.id] = dmaRoot;

	// from profile.ts
	const NR_DMA_REC_HPOS = 228;
	const NR_DMA_REC_VPOS = 313;

	const dmaTimes: number[] = new Array(0x100).fill(0);
	let i = 0;
	for(let y = 0; y < NR_DMA_REC_VPOS; y++) {
		for(let x = 0; x < NR_DMA_REC_HPOS - ((y % 2) ? 1 : 0); x++, i++) { // long and short lines alternate
			const dmaRecord = dmaRecords[y * NR_DMA_REC_HPOS + x];
			if(dmaRecord.type === undefined)
				continue;
			const dmaType = dmaRecord.type;
			const dmaSubtype = (dmaTypes[dmaType].subtypes.length === 1) ? 0 : (dmaRecord.extra || 0);
			if(dmaType >= dmaTypes.length || dmaSubtype >= dmaTypes[dmaType].subtypes.length)
				continue;

			dmaTimes[(dmaSubtype << 4) | dmaType] += 2;
		}
	}

	for(let dmaTypeId = 1; dmaTypeId < dmaTypes.length; dmaTypeId++) {
		const dmaType = dmaTypes[dmaTypeId];
		let dmaTime = 0;
		for(let dmaSubtypeId = 0; dmaSubtypeId < dmaType.subtypes.length; dmaSubtypeId++) {
			dmaTime += dmaTimes[(dmaSubtypeId << 4) | dmaTypeId];
		}

		if(dmaTime === 0)
			continue;

		let dmaParent = dmaRoot;
		if(dmaType.subtypes.length > 1) {
			const dmaParentLoc: ILocation = {
				selfTime: 0,
				aggregateTime: 0,
				id: 0,
				ticks: 0,
				category: Category.User,
				callFrame: {
					functionName: dmaTypes[dmaTypeId].name,
					scriptId: '#dma',
					url: '',
					lineNumber: 0,
					columnNumber: 0
				}
			};
			dmaParentLoc.id = (model.locations as ILocation[]).push(dmaParentLoc) - 1;
			dmaParent = new TopDownNode(dmaParentLoc, dmaRoot);
			dmaRoot.aggregateTime += dmaTime;
			dmaRoot.childrenSize++;
			dmaRoot.children[dmaParentLoc.id] = dmaParent;
		}

		for(let dmaSubtypeId = 0; dmaSubtypeId < dmaType.subtypes.length; dmaSubtypeId++) {
			const time = dmaTimes[(dmaSubtypeId << 4) | dmaTypeId];
			if(time === 0)
				continue;

			const dmaSubtype = dmaType.subtypes[dmaSubtypeId];
			let text = dmaType.name;

			if(dmaSubtype.name !== undefined)
				text = dmaSubtype.name;

			const color =
				((dmaSubtype.color >>> 0) & 0xff).toString(16).padStart(2, '0') +
				((dmaSubtype.color >>> 8) & 0xff).toString(16).padStart(2, '0') +
				((dmaSubtype.color >>> 16) & 0xff).toString(16).padStart(2, '0');

			const loc: ILocation = {
				selfTime: time,
				aggregateTime: time,
				id: 0,
				ticks: 0,
				category: Category.User,
				callFrame: {
					functionName: `<span style="background: #${color}">&nbsp;&nbsp;</span> ${text}`,
					scriptId: '#dma',
					url: '',
					lineNumber: 0,
					columnNumber: 0
				}
			};
			loc.id = (model.locations as ILocation[]).push(loc) - 1;
			const node = new TopDownNode(loc, dmaParent);
			node.selfTime = node.location.selfTime;
			node.aggregateTime = node.location.aggregateTime;
			dmaParent.aggregateTime += node.aggregateTime;
			//parent.aggregateTime += node.aggregateTime;
			//parent.selfTime += parent.aggregateTime;
			dmaParent.childrenSize++;
			dmaParent.children[loc.id] = node;
		}
	}
};

/**
 * Creates a bottom-up graph of the process information
 */
export const createTopDownGraph = (model: IProfileModel) => {
	const root = TopDownNode.root();
	let cpuRoot = root;
	if(model.amiga.dmaRecords) {
		cpuRoot = new TopDownNode({
			selfTime: 0,
			aggregateTime: 0,
			id: 0,
			ticks: 0,
			category: Category.User,
			callFrame: {
				functionName: "CPU",
				scriptId: '#dma',
				url: '',
				lineNumber: 0,
				columnNumber: 0
			}
		}, root);
		root.childrenSize++;
		root.children[0] = cpuRoot;
	}
	for(const ch of model.nodes[0].children) {
		const node = model.nodes[ch];
		processNode(cpuRoot, node, model);
		cpuRoot.selfTime += node.aggregateTime;
		cpuRoot.aggregateTime += node.aggregateTime;
	}
	if(model.amiga.dmaRecords) {
		//root.selfTime = cpuRoot.selfTime;
		root.aggregateTime = cpuRoot.aggregateTime;

		processDmaNodes(root, model);
	}

	return root;
};
