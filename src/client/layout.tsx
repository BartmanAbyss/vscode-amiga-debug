/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import { h, FunctionComponent, Fragment, ComponentType } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { richFilter, RichFilterComponent } from '../client/rich-filter';
import styles from './layout.css';
import { IDataSource } from '../ql';

export interface IBodyProps<T> {
  data: ReadonlyArray<T>;
}

type CpuProfileLayoutComponent<T> = FunctionComponent<{
  data: IDataSource<T>;
  getDefaultFilterText: (value: T) => ReadonlyArray<string>;
  body: ComponentType<IBodyProps<T>>;
  filterFooter?: ComponentType<{}>;
}>;

/**
 * Base layout component to display CPU-profile related info.
 */
export const cpuProfileLayoutFactory = <T extends {}>(): CpuProfileLayoutComponent<T> => ({
  data,
  getDefaultFilterText,
  body: RowBody,
  filterFooter: FilterFooter,
}) => {
  const RichFilter = useMemo<RichFilterComponent<T>>(richFilter, []);
  const [filteredData, setFilteredData] = useState<ReadonlyArray<T>>(data.data);
  const footer = useMemo(() => (FilterFooter ? <FilterFooter /> : undefined), [FilterFooter]);

  return (
    <Fragment>
      <div className={styles.filter}>
        <RichFilter
          data={data}
          getDefaultFilterText={getDefaultFilterText}
          onChange={setFilteredData}
          placeholder="Filter functions or files, or start a query()"
          foot={footer}
        />
      </div>
      <div className={styles.rows}>
        <RowBody data={filteredData} />
      </div>
    </Fragment>
  );
};
