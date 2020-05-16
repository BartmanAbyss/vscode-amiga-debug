/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { isCompilable } from './operators';

export class QueryError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}

const stringify = (type: unknown) => {
  if (isCompilable(type)) {
    return `expression ${type.source()}`;
  }

  return JSON.stringify(type);
};

export const columnNotFound = (name: string, available: ReadonlyArray<string>) =>
  new QueryError(
    `The column "${name}" was not found, available columns are: ${available.join(', ')}.`,
  );

export const expectedColumn = (clauseType: string, actual: unknown) =>
  new QueryError(`Expected a column in ${clauseType}, but got ${stringify(actual)}.`);

export const expectedPrimitive = (clauseType: string, actual: unknown) =>
  new QueryError(`Expected a primitive in ${clauseType}, but got ${stringify(actual)}.`);

export const expectedExpression = (clauseType: string, actual: unknown) =>
  new QueryError(`Expected an expression in ${clauseType}, but got ${stringify(actual)}.`);

export const expectedStatement = (clauseType: string, actual: unknown) =>
  new QueryError(`Expected a statement in ${clauseType}, but got ${stringify(actual)}.`);

export const expectedGenericType = (clauseType: string, type: string, actual: unknown) =>
  new QueryError(`Expected a ${type} in ${clauseType}, but got ${stringify(actual)}.`);
