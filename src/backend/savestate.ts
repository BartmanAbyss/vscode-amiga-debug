import * as fs from 'fs';
import * as zlib from 'zlib';

export interface IUssFile {
	filename: string;
	cpuModel: number;
	cpuFlags: number;
	cpuExtraFlags: number;
	chipsetFlags: number;
	romId: string;
	emuName: string;
	emuVersion: string;
	description: string;
	cram: number;
	bram: number;
	fram: number[];
}

interface Chunk {
	name: string;
	buffer: Buffer;
}

export class UssFile implements IUssFile {
	public cpuModel: number;
	public cpuFlags: number;
	public cpuExtraFlags: number;
	public chipsetFlags: number;
	public romId: string;
	public emuName: string;
	public emuVersion: string;
	public description: string;
	public cram: number;
	public bram: number;
	public fram: number[] = [];
	private chunks: Chunk[] = [];

	constructor(public filename: string) {
		const buffer = fs.readFileSync(filename);
		let bufferOffset = 0;
		const readChunk = (): Chunk => {
			if(bufferOffset + 3 * 4 > buffer.length)
				return { name: '', buffer: null };
			// see WinUAE:savestate.cpp@restore_chunk
			const name = buffer.toString('utf8', bufferOffset, bufferOffset + 4); bufferOffset += 4;
			let len = buffer.readUInt32BE(bufferOffset) - 4 - 4 - 4; bufferOffset += 4;
			const flags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
			let chunkData: Buffer;

			if(flags & 1) {
				// zuncompress
				const uncompressedLen = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
				len -= 4;
				chunkData = zlib.inflateSync(buffer.slice(bufferOffset, bufferOffset + len));
				bufferOffset += len;
			} else {
				chunkData = buffer.slice(bufferOffset, bufferOffset + len);
				bufferOffset += len;
			}
			// alignment
			bufferOffset += 4 - (len & 3);
			//console.log(`Chunk '${name}' size ${len} (${chunkData.length})`);

			return { name, buffer: chunkData };
		};

		let chunk = readChunk();
		if(chunk.name !== 'ASF ')
			throw new Error(`${filename} is not an AmigaStateFile`);
		this.chunks.push(chunk);
		this.readHeader(chunk.buffer);
		while(true) {
			chunk = readChunk();
			if(chunk.name === 'END ' || chunk.name === '')
				return;
			this.chunks.push(chunk);
			switch(chunk.name) {
			case 'CPU ': this.readCpu(chunk.buffer); break;
			case 'CPUX': this.readCpuExtra(chunk.buffer); break;
			case 'CHIP': this.readChip(chunk.buffer); break;
			case 'ROM ': this.readRom(chunk.buffer); break;
			case 'CRAM': this.cram = chunk.buffer.length; break;
			case 'BRAM': this.bram = chunk.buffer.length; break;
			case 'A3K1':
			case 'A3K2':
			case 'FRAM':
			case 'ZRAM':
			case 'ZCRM': this.fram.push(chunk.buffer.length); break;
			}
		}
	}

	public setCycleExact() {
		const cpux = this.chunks.find((chunk) => chunk.name === 'CPUX');
		if(cpux)
			cpux.buffer.writeUInt32BE(this.cpuExtraFlags | (1 << 0) | (1 << 5), 4);
	}

	public write(filename: string) {
		const file = fs.openSync(filename, "w");
		let pos = 0;
		
		for(const chunk of this.chunks) {
			//console.log(`BytesWritten: ${pos} chunk: ${chunk.name}`);
			pos += fs.writeSync(file, Buffer.from(chunk.name, 'utf8'));
			const compressed = zlib.deflateSync(chunk.buffer);
			let length = compressed.byteLength;
			if(length < chunk.buffer.byteLength) {
				const b = Buffer.alloc(3 * 4);
				b.writeUInt32BE(length + 4 * 4, 0 * 4); // len
				b.writeUInt32BE(1, 1 * 4); // compressed
				b.writeUInt32BE(chunk.buffer.length, 2 * 4);
				pos += fs.writeSync(file, b);
				pos += fs.writeSync(file, compressed);
			} else {
				length = chunk.buffer.length;
				const b = Buffer.alloc(2 * 4);
				b.writeUInt32BE(length + 3 * 4, 0 * 4); // len
				b.writeUInt32BE(0, 1 * 4); // not compressed
				pos += fs.writeSync(file, b);
				pos += fs.writeSync(file, chunk.buffer);
			}
			// alignment
			//console.log(`Length: ${length} Pad: ${4 - (length & 3)}`);
			const p = Buffer.alloc(4 - (length & 3));
			pos += fs.writeSync(file, p);
		}
		pos += fs.writeSync(file, Buffer.from('END ', 'utf8'));
		const b = Buffer.alloc(1 * 4);
		b.writeUInt32BE(8, 0 * 4); // len
		pos += fs.writeSync(file, b);
		fs.closeSync(file);
	}

	private readHeader(buffer: Buffer) {
		let bufferOffset = 4;
		const readString = (): string => {
			let i = 0;
			while(buffer[bufferOffset + i] !== 0)
				i++;
			const str = buffer.toString('utf8', bufferOffset, bufferOffset + i);
			bufferOffset += i + 1;
			return str;
		};

		this.emuName = readString();
		this.emuVersion = readString();
		this.description = readString();
		//console.log(`  Saved with: '${this.emuName} ${this.emuVersion}', description: '${this.description}'`);
	}

	private readCpu(buffer: Buffer) {
		let bufferOffset = 0;
		this.cpuModel = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		this.cpuFlags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		//console.log(`  CPU model: ${this.cpuModel} flags: $${this.cpuFlags.toString(16)}`);
		// don't care about other stuff (registers, etc.)
	}

	private readCpuExtra(buffer: Buffer) {
		let bufferOffset = 4;
		this.cpuExtraFlags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		//console.log(`  CPU extra flags: $${this.cpuExtraFlags.toString(16)}`);
		// bit 0: cpu_cycle_exact
		// bit 1: cpu_compatible
		// bit 2: m68k_speed < 0
		// bit 3: cachesize > 0
		// bit 4: m68k_speed > 0
		// bit 5: cpu_memory_cycle_exact
		// bit 24-31: if(m68k_speed > 0) currprefs.m68k_speed / CYCLE_UNIT
		// don't care about other stuff (060_revision, fpu_revision)
	}

	private readChip(buffer: Buffer) {
		let bufferOffset = 0;
		this.chipsetFlags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		// ...
	}

	private readRom(buffer: Buffer) {
		let bufferOffset = 20;
		const readString = (): string => {
			let i = 0;
			while(buffer[bufferOffset + i] !== 0)
				i++;
			const str = buffer.toString('utf8', bufferOffset, bufferOffset + i);
			bufferOffset += i + 1;
			return str;
		};
		this.romId = readString();
	}
}
