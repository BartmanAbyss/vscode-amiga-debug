/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { ICompilation, IStatement } from './operators';
import { expressionFactories, statementFactories } from './operators/all';
import { createColumnProvider } from './column';
import { QueryError } from './query-error';
import { CodeEmitter } from './emitter';

/**
 * Type that allows chaining operators, and records the list of operators
 * chained onto it.
 */
type Builder = { [key: string]: (...args: unknown[]) => Builder };

/**
 * Creates a new builder.
 */
const createBuilder = () => {
  const builtOps: IStatement[] = [];
  const builder: Partial<Builder> = {};

  for (const factory of statementFactories) {
    builder[factory.name] = (...args: unknown[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      builtOps.push(factory.invoke(...args));
      return builder as Builder;
    };
  }

  return { builder: builder as Builder, builtOps };
};

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

/**
 * Options passed into evaluate().
 */
export interface IEvaluateOptions<T> {
  expression: string;
  dataSources: { [key: string]: IDataSource<T> };
}

const opsToString = (dataSource: IDataSource<unknown>, ops: IStatement[]) => {
  const global = new CodeEmitter();
  const filter = new CodeEmitter();
  const sort = new CodeEmitter();

  const compilation: ICompilation = { global, filter, sort, properties: dataSource.properties };

  global.emit('function getChildren(node) {', dataSource.getChildren, '}');
  for (const op of ops) {
    op.compile(compilation);
  }

  return `
    ${global.toString()}
    function test(node) {
      ${filter.toString()}
      return true;
    }

    function breadthFirstSearch(node, callback) {
      let queue = [node];
      while (queue.length) {
        const child = queue.shift();
        const result = callback(child);
        if (result !== undefined) {
          return result;
        }

        queue.push(...getChildren(child));
      }
    }

    let result = [];
    for (const node of nodes) {
      if (test(node)) {
        result.push(node);
      }
    }

    nodes = result;

    ${sort.toString()}

    return nodes;
  `;
};

export const compile = <T>(options: IEvaluateOptions<T>) => {
  const globals: { [key: string]: unknown } = {};
  const columns = createColumnProvider();
  globals.v = columns.provider;
  let built: { ds: IDataSource<T>; builtOps: IStatement[] } | undefined;

  for (const key of Object.keys(options.dataSources)) {
    globals[key] = () => {
      const { builder, builtOps } = createBuilder();
      built = { ds: options.dataSources[key], builtOps };
      return builder;
    };
  }

  for (const factory of expressionFactories) {
    globals[factory.name] = factory.invoke.bind(factory);
  }

  const globalKeys = Object.keys(globals);
  const globalValues = globalKeys.map(k => globals[k]);
  globalKeys.push(options.expression);
  try {
    new Function(...globalKeys)(...globalValues);
  } catch (e) {
    if (!(e instanceof QueryError)) {
      throw new QueryError(e.message);
    }

    throw e;
  }

  if (!built) {
    return undefined;
  }

  const filter = opsToString(built.ds, built.builtOps);
  return { code: filter, dataSource: built.ds };
};

export const evaluate = <T>(options: IEvaluateOptions<T>): T[] => {
  const compiled = compile(options);
  if (!compiled) {
    return [];
  }

  return new Function('nodes', compiled.code)(compiled.dataSource.data);
};
