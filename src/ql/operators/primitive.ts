/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Expression, IExpression, Primitive, isExpression, isPrimitive } from './index';
import { expectedExpression } from '../query-error';
import { CodeEmitter } from '../emitter';

export class PrimitiveExpression implements IExpression {
  /**
   * Wraps a primitive value into a simple expression.
   */
  public static wrap(inClause: string, value: unknown) {
    if (isExpression(value)) {
      return value;
    }

    if (isPrimitive(value)) {
      return new PrimitiveExpression(value);
    }

    throw expectedExpression(inClause, value);
  }

  private readonly stringified: string;

  public [Expression] = true as const;

  constructor(primitive: Primitive) {
    this.stringified =
      primitive === undefined
        ? 'undefined'
        : primitive === null
        ? 'null'
        : JSON.stringify(primitive);
  }

  public compile(c: CodeEmitter) {
    c.emit(this.stringified);
  }

  public source() {
    return this.stringified;
  }
}
