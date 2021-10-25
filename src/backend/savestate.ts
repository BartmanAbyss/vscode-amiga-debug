import * as fs from 'fs';
import * as zlib from 'zlib';

export class UssFile {
	constructor(private filename: string) {
		const buffer = fs.readFileSync(filename);
		let bufferOffset = 0;
		const readChunk = (): { name: string, buffer: Buffer } => {
			if(bufferOffset + 3 * 4 > buffer.length)
				return { name: '', buffer: null };
			// see WinUAE:savestate.cpp@restore_chunk
			const name = buffer.toString('utf8', bufferOffset, bufferOffset + 4); bufferOffset += 4;
			let len = buffer.readUInt32BE(bufferOffset) - 4 - 4 - 4; bufferOffset += 4;
			const flags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
			let chunkData: Buffer;

			if(flags & 1) {
				const totalLen = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
				len -= 4;
				chunkData = zlib.inflateSync(buffer.slice(bufferOffset, bufferOffset + len));
				bufferOffset += len;
				// zuncompress
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
		this.readHeader(chunk.buffer);
		do {
			chunk = readChunk();
			if(chunk.name === 'CPU ')
				this.readCpu(chunk.buffer);
			else if(chunk.name === 'CPUX')
				this.readCpuExtra(chunk.buffer);
			else if(chunk.name === 'CRAM')
				console.log(`  CRAM: ${chunk.buffer.length >>> 10}k`);
			else if(chunk.name === 'BRAM')
				console.log(`  BRAM: ${chunk.buffer.length >>> 10}k`);
			else if(chunk.name === 'A3K1' || chunk.name === 'A3K2' || chunk.name === 'FRAM' || chunk.name === 'ZRAM' || chunk.name === 'ZCRM')
				console.log(`  FRAM: ${chunk.buffer.length >>> 10}k`);
		} while(chunk.name !== 'END ' && chunk.name !== '');
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

		const emuname = readString();
		const emuversion = readString();
		const description = readString();
		console.log(`  Saved with: '${emuname} ${emuversion}', description: '${description}'`);
	}

	private readCpu(buffer: Buffer) {
		let bufferOffset = 0;
		const model = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		const flags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		console.log(`  CPU model: ${model} flags: $${flags.toString(16)}`);
		// don't care about other stuff (registers, etc.)
	}

	private readCpuExtra(buffer: Buffer) {
		let bufferOffset = 4;
		const flags = buffer.readUInt32BE(bufferOffset); bufferOffset += 4;
		console.log(`  CPU extra flags: $${flags.toString(16)}`);
		// don't care about other stuff (060_revision, fpu_revision)
	}
}
