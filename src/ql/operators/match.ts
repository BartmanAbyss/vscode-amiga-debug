/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IOperatorFactory, Expression, IExpression } from './index';
import { PrimitiveExpression } from './primitive';
import { expectedGenericType } from '../query-error';

export class MatchExpressionFactory implements IOperatorFactory {
  private static counter = 0;

  public readonly name = 'matches';

  public invoke(col: unknown, pattern: unknown, flags: unknown): IExpression {
    const expr = PrimitiveExpression.wrap(this.name, col);
    if (typeof pattern !== 'string') {
      throw expectedGenericType(this.name, 'string', pattern);
    }

    if (flags && typeof flags !== 'string') {
      throw expectedGenericType(this.name, 'string', flags);
    }

    const reName = `regex${MatchExpressionFactory.counter++}`;

    return {
      compile: (emitter, compilation) => {
        compilation.global.emit(
          `const ${reName} = new RegExp(${JSON.stringify(pattern)}, ${
            flags ? JSON.stringify(flags) : ''
          })`,
        );
        emitter.emit(`${reName}.test(String(`);
        expr.compile(emitter, compilation);
        emitter.emit('))');
      },
      source: () => `${this.name}(${expr.source()})`,
      [Expression]: true,
    };
  }
}
