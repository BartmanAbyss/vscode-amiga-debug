import * as fs from 'fs';

// https://5e7b2c0d467b5.site123.me/
// https://github.com/jotd666/amiga68ktools/blob/master/tools/LVOs.i

const RTC_MATCHWORD = 0x4AFC; // from exec/resident.h
const RTF_AUTOINIT = 1<<7;
const NT_LIBRARY = 9; // from exec/nodes.h

interface LibraryFunction {
	lvo: number;
	name: string;
	minVersion: number;
}

export class FD {
	public functions = new Map<number, LibraryFunction>();

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
					this.functions.set(bias, { lvo: bias, name: func, minVersion });
				}
				bias += 6;
			}
		}
	}
}

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
		const nameOffset = this.data.readInt32BE(offset + 14) - this.base;                
		let name = '';
		for(let s = 0; this.data[nameOffset + s] !== 0; s++)
			name += String.fromCharCode(this.data[nameOffset + s]);
		console.log(`Found library @ ${offset.toString(16)}: ${name} flags: ${this.data[offset + 10].toString(16)}`);
/*        if(this.data[offset + 10] & RTF_AUTOINIT) {
			console.log("AUTOINIT");
		}*/
	}
}
