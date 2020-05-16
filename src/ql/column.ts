/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IExpression, Expression, ICompilation } from './operators';
import { CodeEmitter } from './emitter';
import { columnNotFound } from './query-error';

/**
 * Contains a column name. Wrapped in a class for type safety.
 */
export class Column implements IExpression {
  constructor(public readonly name: string) {}

  public [Expression] = true as const;

  public source() {
    return `v.${this.name}`;
  }

  public compile(emitter: CodeEmitter, compilation: ICompilation) {
    if (!compilation.properties.hasOwnProperty(this.name)) {
      throw columnNotFound(this.name, Object.keys(compilation.properties));
    }

    emitter.emit(compilation.properties[this.name]);
  }
}

/**
 * Creates a type that provides columns that can be consumed in the queries.
 * The provider this creates is what's the `v` object in the query.
 */
export const createColumnProvider = () => {
  const cache = new Map<string, Column>();

  return {
    get list() {
      return [...cache.values()];
    },
    provider: new Proxy(
      {},
      {
        get(_target, prop: string) {
          let column = cache.get(prop);
          if (!column) {
            column = new Column(prop);
            cache.set(prop, column);
          }

          return column;
        },
      },
    ),
  };
};
