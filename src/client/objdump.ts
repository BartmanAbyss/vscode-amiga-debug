import { VsCodeApi } from "./vscodeApi";
import styles from './objdump.module.css';

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

export async function Objdump() {
	const container = document.createElement('div');
	container.className = styles.container;

	const lines = OBJDUMP.replace(/\r/g, '').split('\n');
	const rows: HTMLDivElement[] = [];
	const locations: Location[] = [];
	let location: Location = { file: '', line: -1 };
	for(const line of lines) {
		const match = line.match(/^(\S.+):([0-9]+)( \(discriminator [0-9]+\))?$/);
		if(match) {
			location = {
				file: match[1],
				line: parseInt(match[2])
			};
			//continue;
		}
		const row = document.createElement('div');
		row.attributes['data-row'] = rows.length;
		row.innerText = line.length > 0 ? line : '\u200b';
		container.appendChild(row);
		rows.push(row);
		locations.push({ ...location });
	}
	document.body.appendChild(container);

	let curRow = 0;
	rows[curRow].className = styles.cur;

	const selectRow = (nextRow: number, scroll: boolean) => {
		if(nextRow === curRow)
			return;
		rows[curRow].className = '';
		rows[nextRow].className = styles.cur;
		if(scroll)
			rows[nextRow].scrollIntoView({ behavior: 'auto', block: 'center' });
		curRow = nextRow;

		if(locations[curRow].file !== '') {
			VsCodeApi.postMessage<IOpenDocumentMessage>({
				type: 'openDocument',
				file: locations[curRow].file,
				line: locations[curRow].line
			});
		}
	};

	document.addEventListener('keydown', (evt: KeyboardEvent) => {
		let nextRow = curRow;
		if(evt.key === 'ArrowDown')
			nextRow = Math.min(rows.length - 1, curRow + 1);
		else if(evt.key === 'ArrowUp')
			nextRow = Math.max(0, curRow - 1);
		else if(evt.key === 'PageDown')
			nextRow = Math.min(rows.length - 1, Math.floor(curRow + (window.innerHeight / rows[curRow].clientHeight * 0.9)));
		else if(evt.key === 'PageUp')
			nextRow = Math.max(0, Math.floor(curRow - (window.innerHeight / rows[curRow].clientHeight * 0.9)));
		else if(evt.key === 'Home')
			nextRow = 0;
		else if(evt.key === 'End')
			nextRow = rows.length - 1;
		selectRow(nextRow, true);
		evt.preventDefault();
	});
	container.onclick = (evt: MouseEvent) => {
		const elem = evt.srcElement as HTMLElement;
		const row = elem.attributes['data-row'];
		if(row !== undefined) {
			selectRow(row, false);
		}
	};
}
