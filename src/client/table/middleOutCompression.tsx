/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent } from 'preact';
import styles from './middleOutCompression.css';

/**
 * Puts ellipses in the middle of the text on overflow, rather than clipping the end.
 */
export const MiddleOut: FunctionComponent<{
  text: string;
  startChars?: number;
  endChars?: number;
}> = ({ text, startChars = 5, endChars = 8, ...props }) => {
  const ratio = 0.5;
  const startWidth = ratio * startChars;
  const endWidth = ratio * endChars;

  return (
    <span className={styles.c} aria-label={text} {...props}>
      <span style={{ maxWidth: `calc(100% - ${endWidth}em)`, minWidth: `${startWidth}em` }}>
        {text.slice(0, -endChars)}
      </span>
      <span aria-hidden="true" style={{ maxWidth: `calc(100% - ${startWidth}em)` }}>
        {text.slice(-endChars)}
      </span>
    </span>
  );
};
