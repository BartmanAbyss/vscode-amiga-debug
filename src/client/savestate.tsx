import { h, FunctionComponent, Fragment, JSX } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { VsCodeApi } from "./vscodeApi";

declare const SAVESTATE: string;

// messages from webview to vs code
export interface IProfileSavestateMessage {
	type: 'profileSavestate';
	file: string;
	frames: number;
}

export const SavestateView: FunctionComponent<{}> = ({ }) => {
	const savestate = JSON.parse(SAVESTATE);

	const onClickProfile = useCallback((evt: MouseEvent) => {
		VsCodeApi.postMessage<IProfileSavestateMessage>({
			type: 'profileSavestate',
			file: savestate.filename,
			frames: 1
		});
	}, [savestate]);

	return (
		<Fragment>
			<div>{SAVESTATE}</div>
			<button onClick={onClickProfile}>Profile</button>
		</Fragment>
	);
};
