/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IProfileModel, ILocation, Category } from '../model';
import { ISourceLocation } from '../location-mapping';
import { Protocol as Cdp } from 'devtools-protocol';

const enum Constants {
	GcFunction = '(garbage collector)',
}

export interface IColumnLocation extends ILocation {
	graphId: number; //. unique ID of the location in the graph
	filtered: boolean;
}

export interface IColumn {
	x1: number;
	x2: number;
	rows: Array<IColumnLocation | number>;
}

/**
 * Accessor for querying columns in the flame graph.
 */
export class LocationAccessor implements ILocation {
	public readonly id: number;
	public readonly selfTime: number;
	public readonly aggregateTime: number;
	public readonly ticks: number;
	public readonly category: Category;
	public readonly callFrame: Cdp.Runtime.CallFrame;
	public readonly src?: ISourceLocation;

	/**
	 * Gets children of the location.
	 */
	public get children() {
		const children: LocationAccessor[] = [];
		let dx = this.x;

		// Scan through all columns the cell at this accessor spans. Add their
		// children to the ones we'll return.
		do {
			if (this.model[dx].rows[this.y + 1]) {
				children.push(new LocationAccessor(this.model, dx, this.y + 1));
			}
		} while (this.model[++dx].rows[this.y] === this.x);

		return children;
	}

	/**
	 * Gets root-level accessors for the list of columns.
	 */
	public static rootAccessors(columns: ReadonlyArray<IColumn>) {
		const accessors: LocationAccessor[] = [];
		for (let x = 0; x < columns.length; x++) {
			if (typeof columns[x].rows[0] === 'object') {
				accessors.push(new LocationAccessor(columns, x, 0));
			}
		}

		return accessors;
	}

	/**
	 * Gets the columns from the list that are in the included accessors.
	 */
	public static getFilteredColumns(
		columns: ReadonlyArray<IColumn>,
		accessors: ReadonlyArray<LocationAccessor>,
	) {
		const validX = new Array<true | undefined>(columns.length);
		for (const accessor of accessors) {
			validX[accessor.x] = true;
			for (
				let x = accessor.x + 1;
				x < columns.length && columns[x].rows[accessor.y] === accessor.x;
				x++
			) {
				validX[x] = true;
			}
		}

		// We remove columns, so we need to do that and then adjust the column
		// references of those that remain.
		let offsetX = 0;
		const adjusted: IColumn[] = [];
		for (let x = 0; x < columns.length; x++) {
			if (!validX[x]) {
				offsetX++;
				continue;
			}

			const column = columns[x];
			adjusted.push(
				offsetX
					? {
							x1: column.x1,
							x2: column.x2,
							rows: column.rows.map(r => (typeof r === 'number' ? r - offsetX : r)),
						}
					: column,
			);
		}

		return adjusted;
	}

	constructor(
		private readonly model: ReadonlyArray<IColumn>,
		public readonly x: number,
		public readonly y: number,
	) {
		const cell = this.model[x].rows[y];
		if (typeof cell === 'number') {
			throw new Error('Cannot create an accessor in a merged location');
		}

		this.id = cell.id;
		this.selfTime = cell.selfTime;
		this.aggregateTime = cell.aggregateTime;
		this.ticks = cell.ticks;
		this.category = cell.category;
		this.callFrame = cell.callFrame;
		this.src = cell.src;
	}
}

/**
 * Builds a 2D array of flame graph entries. Returns the columns with nested
 * 'rows'. Each column includes a percentage width (0-1) of the screen space.
 * A number, instead of a node in a column, means it should be merged with
 * the node at the column at the given index.
 */
export const buildColumns = (model: IProfileModel) => {
	const columns: IColumn[] = [];
	let graphIdCounter = 0;

	// 1. Build initial columns
	let timeOffset = 0;
	for (let i = 1; i < model.samples.length; i++) {
		const root = model.nodes[model.samples[i]];
		const selfTime = model.timeDeltas[i - 1];
		const rows = [
			{
				...model.locations[root.locationId],
				graphId: graphIdCounter++,
				filtered: true,
				selfTime,
				aggregateTime: 0,
			},
		];

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		for (let id = root.parent; id; id = model.nodes[id!].parent) {
			rows.unshift({
				...model.locations[model.nodes[id].locationId],
				graphId: graphIdCounter++,
				filtered: true,
				selfTime: 0,
				aggregateTime: selfTime,
			});
		}

		columns.push({
			x1: timeOffset / model.duration,
			x2: (selfTime + timeOffset) / model.duration,
			rows,
		});
		timeOffset += selfTime;
	}

	// 2. Merge them
	for (let x = 1; x < columns.length; x++) {
		const col = columns[x];
		const root = col.rows[0] as IColumnLocation;

		// GC has no stack and can interrupt execution. To avoid breaking up flames,
		// show GC on top of the previous frame. Matches what chrome devtools do.
		if (col.rows.length === 1 && x > 0 && root.callFrame.functionName === Constants.GcFunction) {
			col.rows = columns[x - 1].rows.map(row => (typeof row === 'number' ? row : x - 1));
			col.rows.push(root);
			continue;
		}

		for (let y = 0; y < col.rows.length; y++) {
			const current = col.rows[y] as IColumnLocation;
			const prevOrNumber = columns[x - 1]?.rows[y];
			if (typeof prevOrNumber === 'number') {
				if (current.id !== (columns[prevOrNumber].rows[y] as IColumnLocation).id) {
					break;
				}
				col.rows[y] = prevOrNumber;
			} else if (prevOrNumber?.id === current.id) {
				col.rows[y] = x - 1;
			} else {
				break;
			}

			const prev =
				typeof prevOrNumber === 'number'
					? (columns[prevOrNumber].rows[y] as ILocation)
					: prevOrNumber;
			prev.selfTime += current.selfTime;
			prev.aggregateTime += current.aggregateTime;
		}
	}

	return columns;
};
