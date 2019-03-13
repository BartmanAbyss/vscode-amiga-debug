import * as childProcess from 'child_process';
import * as os from 'os';
import * as path from 'path';

import { SymbolInformation, SymbolScope, SymbolType } from '../symbols';
import { Section } from './backend';

const SYMBOL_REGEX = /^([0-9a-f]{8})\s([lg\ !])([w\ ])([C\ ])([W\ ])([I\ ])([dD\ ])([FfO\ ])\s([^\s]+)\s([0-9a-f]+)\s(.*)\r?$/;

const TYPE_MAP: { [id: string]: SymbolType } = {
	'F': SymbolType.Function,
	'f': SymbolType.File,
	'O': SymbolType.Object,
	' ': SymbolType.Normal
};

const SCOPE_MAP: { [id: string]: SymbolScope } = {
	'l': SymbolScope.Local,
	'g': SymbolScope.Global,
	' ': SymbolScope.Neither,
	'!': SymbolScope.Both
};

export class SymbolTable {
	private symbols: SymbolInformation[];
	private sections: Map<string, Section> = new Map();

	constructor(private objdumpPath: string, private args: string[], private executable: string) {
		this.symbols = [];
		this.sections = new Map();
	}

	public loadSymbols() {
		try {
			const objdump = childProcess.spawnSync(this.objdumpPath, this.args.concat(['--syms', this.executable]));
			const output = objdump.stdout.toString();
			const lines = output.split('\n');
			let currentFile: string | null = null;

			for (const line of lines) {
				const match = line.match(SYMBOL_REGEX);
				if (match) {
					if (match[7] === 'd' && match[8] === 'f') {
						currentFile = match[11].trim();
					}
					const type = TYPE_MAP[match[8]];
					let scope = SCOPE_MAP[match[2]];
					let name = match[11].trim();
					let hidden = false;

					if (name.startsWith('.hidden')) {
						name = name.substring(7).trim();
						hidden = true;
					}

					// fix for LTO
					if(scope === SymbolScope.Local && !currentFile)
						scope = SymbolScope.Global;

					this.symbols.push({
						address: parseInt(match[1], 16),
						type,
						scope,
						section: match[9].trim(),
						length: parseInt(match[10], 16),
						name,
						instructions: null,
						file: scope === SymbolScope.Local ? currentFile : null,
						hidden
					});
				}
			}
		} catch (e) { }
	}

	// only call once
	public relocate(sections: Section[]) {
		this.sections = new Map();
		sections.forEach((section) => {
			this.sections.set(section.name, section);
		});

		this.symbols.forEach((symbol) => {
			const section = this.sections.get(symbol.section);
			if(section) {
				symbol.address += section.address;
			}
		});
		console.log(this.symbols);
	}

	public getFunctionAtAddress(address: number): SymbolInformation | null {
		const matches = this.symbols.filter((s) => s.type === SymbolType.Function && s.address <= address && (s.address + s.length) > address);
		if (!matches || matches.length === 0) { return null; }

		return matches[0];
	}

	public getFunctionSymbols(): SymbolInformation[] {
		return this.symbols.filter((s) => s.type === SymbolType.Function);
	}

	public getGlobalVariables(): SymbolInformation[] {
		const matches = this.symbols.filter((s) => s.type === SymbolType.Object && s.scope === SymbolScope.Global);
		return matches;
	}

	public getStaticVariables(file: string): SymbolInformation[] {
		return this.symbols.filter((s) => s.type === SymbolType.Object && s.scope === SymbolScope.Local && s.file === file);
	}

	public getFunctionByName(name: string, file?: string): SymbolInformation | null {
		// Try to find static function first
		let matches = this.symbols.filter((s) => s.type === SymbolType.Function && s.scope === SymbolScope.Local && s.name === name && s.file === file);
		if (matches.length !== 0) { return matches[0]; }

		// Fall back to global scope
		matches = this.symbols.filter((s) => s.type === SymbolType.Function && s.scope !== SymbolScope.Local && s.name === name);
		return matches.length !== 0 ? matches[0] : null;
	}
}
