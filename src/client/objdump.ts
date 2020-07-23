import { VsCodeApi } from "./vscodeApi";
import styles from './objdump.module.css';
import { Scrollable } from "./scrollable";

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

declare const OBJDUMP: string;

class ObjdumpView {
	private container: HTMLDivElement;
	private scroller: Scrollable;
	private rows: HTMLDivElement[] = [];
	private locations: Location[] = [];
	private curRow = 0;

	private create() {
		this.container = document.createElement('div');
		this.container.className = styles.container;
	
		const lines = OBJDUMP.replace(/\r/g, '').split('\n');
		let location: Location = { file: '', line: -1 };
		for(const line of lines) {
			const match = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/);
			if(match) {
				location = {
					file: match[1],
					line: parseInt(match[2])
				};
				continue;
			}
			const row = document.createElement('div');
			row.attributes['data-row'] = this.rows.length;
			row.innerText = line.length > 0 ? line : '\u200b';
			this.container.appendChild(row);
			this.rows.push(row);
			this.locations.push({ ...location });
		}
		document.body.appendChild(this.container);
	}

	private selectRow(nextRow: number, scroll: boolean) {
		if(nextRow === this.curRow)
			return;
		this.rows[this.curRow].className = '';
		this.rows[nextRow].className = styles.cur;
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
