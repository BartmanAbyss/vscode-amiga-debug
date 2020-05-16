declare module 'preact-virtual-list' {
  import { FunctionComponent, ComponentChild } from 'preact';

  interface IVirtualListProps<T> {
    data: ReadonlyArray<T>;
    className?: string;
    renderRow: (row: T) => ComponentChild;
    rowHeight: number;
    overscanCount: number;
    sync?: boolean;
  }

  const VirtualList: FunctionComponent<IVirtualListProps<any>>;
  export default VirtualList;
}
