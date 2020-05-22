/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent, Fragment, ComponentChild } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Filter } from './filter';
import { ToggleButton } from './toggle-button';
import * as CaseSensitive from './icons/case-sensitive.svg';
import * as Regex from './icons/regex.svg';
import styles from './rich-filter.css';
import { IDataSource } from './datasource';

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
    return input => re.test(input);
  }

  if (!fn.caseSensitive) {
    const test = fn.text.toLowerCase();
    return input => input.toLowerCase().includes(test);
  }

  return input => input.includes(fn.text);
};

export type RichFilterComponent<T> = FunctionComponent<{
  data: IDataSource<T>;
  placeholder: string;
  getDefaultFilterText: (value: T) => ReadonlyArray<string>;
  onChange: (data: ReadonlyArray<T>) => void;
  foot?: ComponentChild;
}>;

export const richFilter = <T extends {}>(): RichFilterComponent<T> => ({
  placeholder,
  data,
  getDefaultFilterText,
  onChange,
  foot,
}) => {
  const [regex, setRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const filter = compileFilter({ text, caseSensitive, regex });
    onChange(data.data.filter(d => getDefaultFilterText(d).some(filter)));
    return;
  }, [regex, caseSensitive, text]);

  return (
    <div className={styles.f}>
      <Filter
        value={text}
        placeholder={placeholder}
        onChange={setText}
        foot={
          <Fragment>
            <ToggleButton
              icon={CaseSensitive}
              label="Match Case"
              checked={caseSensitive}
              onChange={setCaseSensitive}
            />
            <ToggleButton
              icon={Regex}
              label="Use Regular Expression"
              checked={regex}
              onChange={setRegex}
            />
          </Fragment>
        }
      />
      {error && <div className={styles.error}>{error}</div>}
      {foot}
    </div>
  );
};
