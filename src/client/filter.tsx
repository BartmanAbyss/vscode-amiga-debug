/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent, ComponentChild } from 'preact';
import { useCallback } from 'preact/hooks';
import styles from './filter.css';

/**
 * Filter that the RichFilter returns,
 */
export interface IRichFilter {
	text: string;
	caseSensitive?: boolean;
	regex?: boolean;
}

/**
 * Compile the filter into a predicate function.
 */
export const compileFilter = (fn: IRichFilter): ((input: string) => boolean) => {
	if (fn.regex) {
		const re = new RegExp(fn.text, fn.caseSensitive ? '' : 'i');
		return (input) => re.test(input);
	}

	if (!fn.caseSensitive) {
		const test = fn.text.toLowerCase();
		return (input) => input.toLowerCase().includes(test);
	}

	return (input) => input.includes(fn.text);
};

/**
 * Bar that allows filtering of the data. Can contain "footer" buttons.
 */
export const Filter: FunctionComponent<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  foot?: ComponentChild;
}> = ({ value, onChange, placeholder = 'Filter for function', foot }) => {
  const onChangeRaw = useCallback(
    (evt: Event) => {
      onChange((evt.target as HTMLInputElement).value);
    },
    [onChange],
  );

  return (
    <div className={styles.wrapper}>
      <input value={value} placeholder={placeholder} onPaste={onChangeRaw} onKeyUp={onChangeRaw} />
      {foot}
    </div>
  );
};
