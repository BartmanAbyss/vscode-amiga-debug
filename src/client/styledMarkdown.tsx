import { FunctionComponent } from 'preact';
import Markdown from 'markdown-to-jsx';
import styles from './styledMarkdown.module.css';

export const StyledMarkdown: FunctionComponent<{ children: string }> = ({ children }) => (
	<div class={styles.container}>
		<Markdown>{children}</Markdown>
	</div>
);