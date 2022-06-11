import * as fs from 'fs';

// https://5e7b2c0d467b5.site123.me/
// https://wandel.ca/homepage/execdis/exec_disassembly.txt
// https://github.com/jotd666/amiga68ktools/blob/master/tools/LVOs.i

interface LibraryFunction {
	lvo: number;
	name: string;
	minVersion: number;
}

export class FD {
	public functions: LibraryFunction[] = [];

	constructor(private path: string) {
		const data = fs.readFileSync(path).toString().replace(/\r/g, '').split('\n');
		let bias = 0;
		let minVersion = 0;
		let isPublic = true;
		for(const line of data) {
			if(line.startsWith('##')) {
				const cmd = line.substring(2);
				if(cmd.startsWith('bias'))
					bias = parseInt(cmd.substring(5));
				else if(cmd === 'public')
					isPublic = true;
				else if(cmd === 'private')
					isPublic = false;
				else if(cmd === 'end')
					break;
			} else if(line.startsWith('*')) {
				const match = line.match(/functions in V([0-9]+) or higher/);
				if(match)
					minVersion = parseInt(match[1]);
			} else {
				if(isPublic) {
					const func = line.split('(', 1)[0] || line;
					this.functions.push({ lvo: bias, name: func, minVersion });
				}
				bias += 6;
			}
		}
	}
}

const RTC_MATCHWORD = 0x4AFC; // from exec/resident.h
const RTF_AUTOINIT = 1<<7; // rt_Init points to data structure
const RTF_AFTERDOS = 1<<2;
const RTF_SINGLETASK = 1<<1;
const RTF_COLDSTART = 1<<0;
const NT_LIBRARY = 9; // from exec/nodes.h

// TODO: dos.library needs special handling to get to the vectors

const libraryVectors: { [x: string]: number[] } = {
	// Kickstart v1.3 r34.5 (1987)(Commodore)(A500-A1000-A2000-CDTV)[!].rom
	'exec 34.2 (28 Oct 1987)': [ 0xFC1A7C, -1 ],
	'graphics 34.1 (18 Aug 1987)': [ 0xFCB05A, 0 ],
	'layers 34.1 (18 Aug 1987)': [ 0xFE0B4E, -1 ],
	'romboot 34.1 (18 Aug 1987)': [ 0xFEB114, 0 ],
};

export class Kickstart {
	private data: Buffer;
	private base = 0xfc0000;
	constructor(private path: string) {
		this.data = fs.readFileSync(path);
		for(let i = 0; i < this.data.byteLength; i += 2) {
			if(this.data.readInt16BE(i) === RTC_MATCHWORD && this.data.readInt32BE(i + 2) === this.base + i && this.data[i + 12] === NT_LIBRARY) {
				this.parseLibrary(i);
			}
		}
	}

	private parseLibrary(offset: number) {
		const version = this.data[offset + 11];
		const getString = (offset: number) => {
			let str = '';
			for(let s = 0; this.data[offset + s] !== 0 && this.data[offset + s] !== 0xd && this.data[offset + s] !== 0xa; s++)
				str += String.fromCharCode(this.data[offset + s]);
			return str;
		};
		const name = getString(this.data.readInt32BE(offset + 14) - this.base);
		const id = getString(this.data.readInt32BE(offset + 18) - this.base);
		const vectors: number[] = [];
		if(this.data[offset + 10] & RTF_AUTOINIT) {
			const initOffset = this.data.readInt32BE(offset + 22) - this.base;
			const vectorsOffset = this.data.readInt32BE(initOffset + 4) - this.base;
			if(this.data.readInt16BE(vectorsOffset) === -1) { // relative
				for(let v = 2; this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
			} else { // absolute
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
			}
		} else if(libraryVectors[id]) { // lookup
			const vectorsOffset = libraryVectors[id][0] - this.base;
			if(libraryVectors[id][1] === 0)
				for(let v = 0; this.data.readInt32BE(vectorsOffset + v) !== -1; v += 4)
					vectors.push(this.data.readInt32BE(vectorsOffset + v));
			else if(libraryVectors[id][1] === -1)
				for(let v = 0; this.data.readInt16BE(vectorsOffset + v) !== -1; v += 2)
					vectors.push(vectorsOffset + this.base + this.data.readInt16BE(vectorsOffset + v));
		}
		console.log(`Found library @ ${(offset + this.base).toString(16)}: ${name} V${version} [${id}] flags: ${this.data[offset + 10].toString(16)}; ${vectors.length} LVOs`);
		//for(const v of vectors)
		//	console.log(`  ${v.toString(16)}`);
		//if(!vectors.length)
		//	console.log('  nopes');
	}
}
