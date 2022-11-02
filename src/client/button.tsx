import { FunctionComponent } from 'preact';
import styles from './button.module.css';

export const Button: FunctionComponent<{
	icon: string;
	label: string;
	onClick?: () => void;
}> = ({ icon, label, onClick }) => {
	return <button className={styles.button} title={label} aria-label={label} dangerouslySetInnerHTML={{ __html: icon }} onClick={onClick}/>;
};
