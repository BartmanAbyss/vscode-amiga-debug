import { VsCodeApi } from "./vscodeApi";
import styles from './objdump.module.css';
import { Scrollable } from "./scrollable";
import { GetCycles, GetJump, JumpType } from "./68k";

// messages from webview to vs code
export interface IOpenDocumentMessage {
	type: 'openDocument';
	file: string;
	line: number;
}

interface Location {
	file: string;
	line: number;
}

interface JumpInfo {
	start: number[];
	end: number;
	level: number;
	type: JumpType;
}

declare const OBJDUMP: string;

class ObjdumpView {
	private container: HTMLDivElement;
	private scroller: Scrollable;
	private rows: HTMLDivElement[] = [];
	private locations: Location[] = [];
	private jumps: JumpInfo[] = [];
	private pcMap = new Map<number, number>();
	private curRow = 0;

	private create() {
		this.container = document.createElement('div');
		this.container.className = styles.container;
	
		const lines = OBJDUMP.replace(/\r/g, '').split('\n');
		let location: Location = { file: '', line: -1 };
		let curRow: string[] = [];
		let funcJumps: JumpInfo[] = [];
		const addCurRow = () => {
			if(curRow.length === 0)
				return;
			const row = document.createElement('div');
			row.className = styles.row;
			row.attributes['data-row'] = this.rows.length;
			row.innerText = curRow.join('\n');
			this.container.appendChild(row);
			this.rows.push(row);
			this.locations.push({ ...location });
			curRow = [];
		};
		const addCurFunc = (startPc: number, endPc: number) => {
			const sortedJumps = funcJumps.filter((j) => j.end >= startPc && j.end < endPc).sort((a: JumpInfo, b: JumpInfo) => {
				const aMin  = Math.min(...a.start, a.end);
				const bMin  = Math.min(...b.start, b.end);
				const aSize = Math.max(...a.start, a.end) - aMin;
				const bSize = Math.max(...b.start, b.end) - bMin;
				if(aSize === bSize)
					return aMin - bMin;
				else
					return aSize - bSize;
			});
	
			function jumpIntersects(a: JumpInfo, b: JumpInfo): boolean {
				const aMin = Math.min(...a.start, a.end);
				const bMin = Math.min(...b.start, b.end);
				const aMax = Math.max(...a.start, a.end);
				const bMax = Math.max(...b.start, b.end);
				return aMax >= bMin && aMin <= bMax;
			}
	
			let lastJump = 0;
			let maxLevel = -1;
			while(lastJump < sortedJumps.length) {
				// The last jump is part of the next group
				const base = lastJump;
				// Increment level
				sortedJumps[base].level = ++maxLevel;
				// Find jumps that can be combined on the same level, with the largest jumps tested first.
				// This has the advantage that large jumps are on lower levels and do not intersect with small
				// jumps that get grouped on higher levels.
				let exchangeItem = lastJump + 1;
				for(let it = exchangeItem; it < sortedJumps.length; it++) {
					// test if the jump intersects with any jump from current group
					let ok = true;
					for(let itCollision = base; itCollision !== exchangeItem; itCollision++) {
						// this jump intersects so we leave it out
						if(jumpIntersects(sortedJumps[itCollision], sortedJumps[it])) {
							ok = false;
							break;
						}
					}
					// add jump to group
					if(ok) {
						// move current element to the front
						if(it !== exchangeItem) {
							// hmm.. this code is not good
							[sortedJumps[exchangeItem], sortedJumps[it]] = [sortedJumps[it], sortedJumps[exchangeItem]];
							lastJump = it;
						} else {
							lastJump = exchangeItem;
							exchangeItem++;
						}
						sortedJumps[lastJump].level = maxLevel;
					}
				}
				lastJump = exchangeItem; // move to next group
			}

			this.jumps.push(...sortedJumps);
			funcJumps = [];
		};

		let lineCount = 0;
		let funcStartPc = 0;

		// merge lines by same location
		for(const line of lines) {
			const funcMatch = line.match(/([0-9a-f]+) <(.*)>:$/); // 00000000 <_start>:
			if(funcMatch) {
				const funcEndPc = parseInt(funcMatch[1], 16);
				addCurFunc(funcStartPc, funcEndPc);
				funcStartPc = funcEndPc;
			}

			const locMatch = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/);
			//if(locMatch || line.length === 0) // TEST
				addCurRow();
			if(locMatch) {
				location = {
					file: locMatch[1],
					line: parseInt(locMatch[2])
				};
				continue;
			}
			const insnMatch = line.match(/^ *([0-9a-f]+):\t((?:[0-9a-f]{4} )*)\s*(.*)$/); //      cce:	0c40 a00e      	cmpi.w #-24562,d0
			if(insnMatch) {
				const pc = parseInt(insnMatch[1], 16);
				this.pcMap.set(pc, lineCount);
				const hex = insnMatch[2].split(' ');
				const insn = new Uint16Array(hex.length);
				hex.forEach((h, i) => { insn[i] = parseInt(h, 16); });
				const jump = GetJump(pc, insn);
				if(jump) {
					const jumpInfo = funcJumps.find((j) => j.end === jump.target && j.type === jump.type);
					if(jumpInfo)
						jumpInfo.start.push(pc);
					else
						funcJumps.push({ start: [pc], end: jump.target, level: -1, type: jump.type });
				}
				const cycles = GetCycles(insn);
				let cyclesText = '';
				if(cycles)
					cyclesText = cycles.map((c) => `${c.total}`).join('-');
				curRow.push(`${cyclesText.padStart(7, ' ')} ${pc.toString(16).padStart(8, ' ')}: ${insnMatch[3]}`);
				lineCount++;
			} else {
				curRow.push(line.length > 0 ? line : '\u200b');
				lineCount++;
			}
		}
		addCurRow();
		addCurFunc(funcStartPc, 0x7fffffff);

		const svgNs = 'http://www.w3.org/2000/svg';
		function createSvg() {
			return document.createElementNS(svgNs, 'svg');
		}
		function svgNode(name: string, values: { [x: string]: string; }) {
			const n = document.createElementNS(svgNs, name);
			for(const p in values)
				n.setAttributeNS(null, p, values[p]);
			return n;
		}

		const stroke = { 'stroke': 'white', 'stroke-width': '1', 'fill': 'none' };
		const strokeConditional = { ...stroke, 'stroke-dasharray': '2' };
		const rowHeight = 20;
		const rowMiddle = 6;
		const right = 150; // needs to match CSS
		const levelIndent = 5;

		console.log(this.jumps);

		for(const jump of this.jumps) {
			// ignore jump if any address is unknown
			if([...jump.start, jump.end].some((pc) => !this.pcMap.has(pc)))
				continue;

			const min  = this.pcMap.get(Math.min(...jump.start, jump.end));
			const max  = this.pcMap.get(Math.max(...jump.start, jump.end));
			const end  = this.pcMap.get(jump.end) - min;
			const size = max - min + 1;
			const indent = right - 10 - jump.level * levelIndent;
			const svg = createSvg();
			svg.classList.add(styles.jump);
			svg.style.top = (min * rowHeight) + 'px';
			svg.style.height = (size * rowHeight) + 'px';
			const endY = end * rowHeight + rowMiddle;
			for(const startPc of jump.start) {
				const start = this.pcMap.get(startPc) - min;
				const y = start * rowHeight + rowMiddle;
				svg.appendChild(svgNode('polyline', { points: `${right},${y} ${indent},${y} ${indent},${endY} ${right - 4},${endY}`, ...stroke, ...(jump.type === JumpType.ConditionalBranch ? strokeConditional : {}) }));
			}
			svg.appendChild(svgNode('path', { d: `M${right},${endY} l-4,-4 l0,8 z`, fill: 'white' })); // arrowhead
			this.container.appendChild(svg);
		}

		document.body.appendChild(this.container);
	}

	private selectRow(nextRow: number, scroll: boolean) {
		if(nextRow === this.curRow)
			return;
		this.rows[this.curRow].classList.remove(styles.cur);
		this.rows[nextRow].classList.add(styles.cur);
		if(scroll) {
			const scrollTo = this.rows[nextRow].offsetTop - document.documentElement.clientHeight / 2;
			if(Math.abs(nextRow - this.curRow) > 1)
				this.scroller.setScrollPositionSmooth(scrollTo);
			else
				this.scroller.setScrollPositionNow(scrollTo);
		}
		this.curRow = nextRow;

		if(this.locations[this.curRow].file !== '') {
			VsCodeApi.postMessage<IOpenDocumentMessage>({
				type: 'openDocument',
				file: this.locations[this.curRow].file,
				line: this.locations[this.curRow].line
			});
		}
	}

	private init() {
		this.rows[this.curRow].className = styles.cur;
		this.scroller = new Scrollable(document.documentElement, 135);

		document.addEventListener('keydown', (evt: KeyboardEvent) => {
			let nextRow = this.curRow;
			if(evt.key === 'ArrowDown')
				nextRow = Math.min(this.rows.length - 1, this.curRow + 1);
			else if(evt.key === 'ArrowUp')
				nextRow = Math.max(0, this.curRow - 1);
			else if(evt.key === 'PageDown')
				nextRow = Math.min(this.rows.length - 1, Math.floor(this.curRow + (window.innerHeight / this.rows[this.curRow].clientHeight * 0.9)));
			else if(evt.key === 'PageUp')
				nextRow = Math.max(0, Math.floor(this.curRow - (window.innerHeight / this.rows[this.curRow].clientHeight * 0.9)));
			else if(evt.key === 'Home')
				nextRow = 0;
			else if(evt.key === 'End')
				nextRow = this.rows.length - 1;
			this.selectRow(nextRow, true);
			evt.preventDefault();
		});
		this.container.onclick = (evt: MouseEvent) => {
			const elem = evt.srcElement as HTMLElement;
			const row = elem.attributes['data-row'];
			if(row !== undefined)
				this.selectRow(row, false);
		};
	}

	constructor() {
		this.create();
		window.requestAnimationFrame(() => this.init()); // wait until layout has been calculated so we know the height of the content
	}
}

export async function Objdump() {
	const view = new ObjdumpView();
}
