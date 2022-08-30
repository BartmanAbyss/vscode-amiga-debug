import { JSX } from 'preact';
import { useCallback, useImperativeHandle, useRef } from 'preact/hooks';
import { ForwardFn, forwardRef } from 'preact/compat';
import * as ChevronDown from './icons/arrow-down.svg';
import * as ChevronUp from './icons/arrow-up.svg';
import * as Close from './icons/close.svg';
import styles from './find.module.css';

export type FindCallback = (action: string, text?: string) => void;
const findFn: ForwardFn<{
	callback: FindCallback;
	curFind: number;
	findResultLength: number;
}, FindCallback> = ({ curFind, findResultLength, callback }, ref) => {
	const divRef = useRef<HTMLDivElement>();
	useImperativeHandle(ref, () => (action: string, text?: string) => {
		if(action === 'open') {
			divRef.current.classList.remove(styles.find_hidden);
			divRef.current.classList.add(styles.find_visible);
			divRef.current.getElementsByTagName('input')[0].select();
			if(text !== undefined)
				divRef.current.getElementsByTagName('input')[0].value = text;
		} else if(action === 'close') {
			divRef.current.getElementsByTagName('input')[0].blur();
			divRef.current.classList.remove(styles.find_visible);
			divRef.current.classList.add(styles.find_hidden);
			callback('close');
		}
	}, [divRef.current]);
	const onFindClick = useCallback((evt: JSX.TargetedEvent<HTMLInputElement>) => {
		evt.currentTarget.select();
	}, []);
	const onFindPaste = useCallback((evt: JSX.TargetedEvent<HTMLInputElement>) => {
		callback('', evt.currentTarget.value);
	}, [callback]);
	const onFindKeyUp = useCallback((evt: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
		if(evt.key === 'Enter' || evt.key === 'Escape')
			return;
		callback('', evt.currentTarget.value);
	}, [callback]);
	const onFindKeyDown = useCallback((evt: KeyboardEvent) => {
		if(evt.key === 'Enter')
			callback(evt.shiftKey ? 'prev' : 'next');
		if(evt.key === 'Escape') {
			// close search bar
			divRef.current.getElementsByTagName('input')[0].blur();
			divRef.current.classList.remove(styles.find_visible);
			divRef.current.classList.add(styles.find_hidden);
			callback('close');
		}
		evt.stopPropagation();
	}, [divRef.current, callback]);
	const onFindClose = useCallback(() => {
		divRef.current.classList.remove(styles.find_visible);
		divRef.current.classList.add(styles.find_hidden);
		callback('close');
	}, [divRef.current, callback]);

	return (<div ref={divRef} class={[styles.find, styles.find_hidden].join(' ')}>
		<input placeholder="Find" onClick={onFindClick} onPaste={onFindPaste} onKeyUp={onFindKeyUp} onKeyDown={onFindKeyDown}></input>
		<span class={styles.find_result}>{findResultLength > 0 ? `${curFind % findResultLength + 1} of ${findResultLength}` : 'No results'}</span>
		<button class={styles.button} onMouseDown={() => callback('prev')} disabled={findResultLength === 0} type="button" title="Previous match (Shift+Enter)" dangerouslySetInnerHTML={{ __html: ChevronUp }} />
		<button class={styles.button} onMouseDown={() => callback('next')} disabled={findResultLength === 0} type="button" title="Next match (Enter)" dangerouslySetInnerHTML={{ __html: ChevronDown }} />
		<button class={styles.button} onMouseDown={onFindClose} type="button" title="Close (Escape)" dangerouslySetInnerHTML={{ __html: Close }} />
	</div>);
};
export const Find = forwardRef(findFn);
