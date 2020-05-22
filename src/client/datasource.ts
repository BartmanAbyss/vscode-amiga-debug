/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

/**
 * Data source that provides a stream of items, and includes the list of
 * accessible properties and a function that can be used to recurse into
 * children.
 */
export interface IDataSource<T> {
  data: ReadonlyArray<T>;
  properties: { [key: string]: string };
  getChildren: string;
}
