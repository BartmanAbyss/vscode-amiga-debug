/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { CodeEmitter } from '../emitter';

/**
 * Token for identifying compilable expressions.
 */
export const Expression = Symbol('isExpression');

/**
 * Token for identifying compilable statements.
 */
export const Statement = Symbol('isStatement');

export interface ICompilation {
  properties: { [key: string]: string };
  global: CodeEmitter;
  filter: CodeEmitter;
  sort: CodeEmitter;
}

/**
 * A type that can compile down into code.
 */
export interface ICompilable {
  source(): string;
}

/**
 * A compilable that creates an expression.
 */
export interface IExpression extends ICompilable {
  compile(emitter: CodeEmitter, compilation: ICompilation): void;
  [Expression]: true;
}

/**
 * A compilable that creates a statement.
 */
export interface IStatement extends ICompilable {
  compile(compilation: ICompilation): void;
  [Statement]: true;
}

/**
 * A type that creates an operator.
 */
export interface IOperatorFactory {
  readonly name: string;
  invoke(...args: unknown[]): ICompilable;
}

/**
 * A type that creates a statement.
 */
export interface IStatementFactory extends IOperatorFactory {
  invoke(...args: unknown[]): IStatement;
}

/**
 * A type that creates an expression.
 */
export interface IExpressionFactory extends IOperatorFactory {
  invoke(...args: unknown[]): IExpression;
}

/**
 * Gets whether the type can be compiled.
 */
export const isCompilable = (value: unknown): value is ICompilable =>
  typeof value === 'object' && !!value && typeof (value as ICompilable).source === 'function';

/**
 * Gets whether the type compiles an expression.
 */
export const isExpression = (value: unknown): value is IExpression =>
  typeof value === 'object' && !!value && !!(value as IExpression)[Expression];

/**
 * Gets whether the type compiles a statement.
 */
export const isStatement = (value: unknown): value is IExpression =>
  typeof value === 'object' && !!value && !!(value as IStatement)[Statement];

export type Primitive = string | boolean | null | undefined | number;

/**
 * Gets whether the type is a primitive.
 */
export const isPrimitive = (value: unknown): value is Primitive =>
  typeof value === 'boolean' ||
  typeof value === 'number' ||
  typeof value === 'string' ||
  typeof value === 'undefined' ||
  value === null;
