import { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';
import styles from './button.module.css';

export const Button: FunctionComponent<{
	icon: string;
	label: string;
	onClick?: () => void;
}> = ({ icon, label, onClick }) => {
	return <button className={styles.button} title={label} aria-label={label} dangerouslySetInnerHTML={{ __html: icon }} onClick={onClick}/>;
};

export const ToggleButton: FunctionComponent<{
	icon: string;
	label: string;
	checked: boolean;
	onChange?: (checked: boolean) => void;
	onClick?: () => void;
}> = ({ icon, label, checked, onChange, onClick }) => {
	const toggle = useCallback(() => {
		onClick?.();
		onChange?.(!checked);
	}, [checked, onClick, onChange]);

	return <button className={styles.button} type="button" role="switch" alt={label} title={label} aria-label={label} aria-checked={checked ? 'true' : 'false'} dangerouslySetInnerHTML={{ __html: icon }} onClick={toggle}/>
};
