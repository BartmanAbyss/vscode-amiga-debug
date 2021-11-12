import { h, FunctionComponent, Fragment, JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { VsCodeApi } from "./vscodeApi";
import { Icon } from './icons';
import * as DebugStart from './icons/debug-start.svg';
import * as DebugStop from './icons/debug-stop.svg';
import * as ProfileSingle from './icons/graph.svg';
import * as ProfileMulti from './icons/settings.svg';
import styles from './savestate.module.css';
import './styles.css';
import { IUssFile } from '../backend/savestate';

declare const SAVESTATE: string;

function chipset(chipsetFlags: number) {
	if(chipsetFlags === 0)
		return 'OCS';
	if(chipsetFlags === 4)
		return 'AGA';
	const f: string[] = [];
	if(chipsetFlags & 1)
		f.push('ECS Agnus');
	if(chipsetFlags & 2)
		f.push('ECS Denise');
	return f.join(', ');
}

export const SavestateView: FunctionComponent<{}> = (_) => {
	const savestate = useMemo(() => {
		return JSON.parse(SAVESTATE) as IUssFile;
	}, [SAVESTATE]);
	const [running, setRunning] = useState<boolean>(false);

	useEffect(() => {
		const listener = (e: MessageEvent) => {
			const { type, body } = e.data;
			switch(type) {
			case 'status': 
				console.log("Message", type, body);
				setRunning(body.running);
				break;
			}
		};
		window.addEventListener('message', listener);
		return () => document.removeEventListener('message', listener);
	}, []);

	const onClickStart = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({ type: 'savestateStart' });
	}, []);

	const onClickStop = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({ type: 'savestateStop' });
	}, []);

	const onClickProfileSingle = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({ type: 'savestateProfile', frames: 1 });
	}, []);

	const onClickProfileMulti = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({ type: 'savestateProfile', frames: 10 });
	}, []);

	return (
		<Fragment>
			<div class={styles.container}>
			<div>
				<button class={styles.button} onMouseDown={onClickStart} disabled={running === true} type="button" title="Start" dangerouslySetInnerHTML={{__html: DebugStart}} />
				<button class={styles.button} onMouseDown={onClickStop} disabled={running === false} type="button" title="Stop" dangerouslySetInnerHTML={{__html: DebugStop}} />
				<button class={styles.button} onMouseDown={onClickProfileSingle} disabled={running === false} type="button" title="Profile" dangerouslySetInnerHTML={{__html: ProfileSingle}} />
				<button class={styles.button} onMouseDown={onClickProfileMulti} disabled={running === false} type="button" title="Profile (Multi)" dangerouslySetInnerHTML={{__html: ProfileMulti}} />
			</div>
			<div class={styles.tooltip}>
				<dl>
					<dt>File</dt><dd>{savestate.filename}</dd>
					<dt>Emulator</dt><dd>{savestate.emuName} {savestate.emuVersion}</dd>
					<dt>CPU</dt><dd>{savestate.cpuModel}</dd>
					<dt>Chipset</dt><dd>{chipset(savestate.chipsetFlags)}</dd>
					<dt>Memory</dt><dd>{[`${savestate.cram >>> 10}kb Chip`, savestate.bram ? `${savestate.bram >>> 10}kb Slow` : undefined, ...savestate.fram.map((fram) => `${fram >>> 10}kb Fast`)].filter((item) => item !== undefined).join(', ')}</dd>
					<dt>ROM</dt><dd>{savestate.romId}</dd>
				</dl>
			</div>
			</div>
		</Fragment>
	);
};
