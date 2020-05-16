/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Command, CodeLens, Range, Position } from 'vscode';

/**
 * A collection that creates code lenses from metadata data-transfer-objects
 * (DTOs). DTOs are used internally until we actually need to create lenses
 * for a particular file.
 */
export class LensCollection<T> {
	private readonly data = new Map<string, Array<{ position: Position; dto: T }>>();

	constructor(private readonly mapper: (dto: T) => Command | undefined) { }

	/**
	 * Adds a new code lens at the given location in the file.
	 */
	public set(file: string, position: Position, factory: (previous?: T) => T) {
		let list = this.data.get(file.toLowerCase());
		if (!list) {
			list = [];
			this.data.set(file.toLowerCase(), list);
		}

		let index = 0;
		while (index < list.length && list[index].position.line < position.line) {
			index++;
		}

		let existing: T | undefined;
		if (list[index]?.position.line === position.line) {
			existing = list[index].dto;
			position = new Position(
				position.line,
				Math.min(list[index].position.character, position.character),
			);
		}

		list.splice(index, existing ? 1 : 0, { position, dto: factory(existing) });
	}

	/**
	 * Gets the value at the given file and position, if any.
	 */
	public getDtoAt(file: string, line: number): T | undefined {
		return this.data.get(file.toLowerCase())?.find(p => p.position.line === line)?.dto;
	}

	/**
	 * Get all lenses for a file. Ordered by line number.
	 */
	public getLensesForFile(file: string): CodeLens[] {
		return (
			this.data
				.get(file.toLowerCase())
				?.map((l) => {
					const command = this.mapper(l.dto);
					return command && new CodeLens(new Range(l.position, l.position), command);
				})
				.filter((cmd): cmd is CodeLens => !!cmd) ?? []
		);
	}

	/**
	 * Gets an iterator of files in the lens collection.
	 */
	public files() {
		return this.data.keys();
	}
}
