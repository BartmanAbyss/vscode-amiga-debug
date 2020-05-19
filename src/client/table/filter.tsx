/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent, ComponentChild } from 'preact';
import { useCallback } from 'preact/hooks';
import styles from './filter.css';

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
