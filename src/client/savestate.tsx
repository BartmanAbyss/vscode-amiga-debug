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

declare const SAVESTATE: string;

export const SavestateView: FunctionComponent<{}> = ({ }) => {
	const savestate = JSON.parse(SAVESTATE);

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
		VsCodeApi.postMessage({
			type: 'savestateStart'
		});
	}, []);

	const onClickStop = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({
			type: 'savestateStop'
		});
	}, []);

	const onClickProfileSingle = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({
			type: 'savestateProfile',
			frames: 1
		});
	}, []);

	const onClickProfileMulti = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage({
			type: 'savestateProfile',
			frames: 10
		});
	}, []);

	return (
		<Fragment>
			<div>{SAVESTATE}</div>
			<div style={{ textAlign: 'center'}}>
				<button class={styles.button} onMouseDown={onClickStart} disabled={running === true} type="button" title="Start" dangerouslySetInnerHTML={{__html: DebugStart}} />
				<button class={styles.button} onMouseDown={onClickStop} disabled={running === false} type="button" title="Stop" dangerouslySetInnerHTML={{__html: DebugStop}} />
				<button class={styles.button} onMouseDown={onClickProfileSingle} disabled={running === false} type="button" title="Profile" dangerouslySetInnerHTML={{__html: ProfileSingle}} />
				<button class={styles.button} onMouseDown={onClickProfileMulti} disabled={running === false} type="button" title="Profile (Multi)" dangerouslySetInnerHTML={{__html: ProfileMulti}} />
			</div>
		</Fragment>
	);
};
