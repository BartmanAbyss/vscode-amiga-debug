/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { ILocation, IProfileModel, IComputedNode, IGraphNode, Category } from '../model';

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

/**
 * Creates a bottom-up graph of the process information
 */
export const createTopDownGraph = (model: IProfileModel) => {
	const root = TopDownNode.root();
	for(const ch of model.nodes[0].children) {
		const node = model.nodes[ch];
		processNode(root, node, model);
		root.selfTime += node.aggregateTime;
		root.aggregateTime += node.aggregateTime;
	}

	return root;
};
