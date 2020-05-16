/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IOperatorFactory, Expression, IExpression } from './index';
import { PrimitiveExpression } from './primitive';

export class ContainsOperatorFactory implements IOperatorFactory {
  public readonly name = 'contains';

  public invoke(a: unknown, b: unknown): IExpression {
    const exprA = PrimitiveExpression.wrap(this.name, a);
    const exprB = PrimitiveExpression.wrap(this.name, b);

    return {
      compile: (emitter, compilation) => {
        emitter.emit('String(');
        exprA.compile(emitter, compilation);
        emitter.emit(').contains(String(');
        exprB.compile(emitter, compilation);
        emitter.emit(')');
      },
      source: () => `contains(${exprA.source()}, ${exprB.source()})`,
      [Expression]: true,
    };
  }
}

const makeBinaryExpression = (name: string, before: string, between: string, after: string) =>
  class BinaryExpression implements IOperatorFactory {
    public readonly name = name;

    public invoke(a: unknown, b: unknown): IExpression {
      const exprA = PrimitiveExpression.wrap(this.name, a);
      const exprB = PrimitiveExpression.wrap(this.name, b);

      return {
        compile: (emitter, compilation) => {
          emitter.emit(before);
          exprA.compile(emitter, compilation);
          emitter.emit(between);
          exprB.compile(emitter, compilation);
          emitter.emit(after);
        },
        source: () => `${this.name}(${exprA.source()}, ${exprB.source()})`,
        [Expression]: true,
      };
    }
  };

const makeUnaryExpression = (name: string, before: string, after: string) =>
  class UnaryExpression implements IOperatorFactory {
    public readonly name = name;

    public invoke(a: unknown): IExpression {
      const exprA = PrimitiveExpression.wrap(this.name, a);

      return {
        compile: (emitter, compilation) => {
          emitter.emit(before);
          exprA.compile(emitter, compilation);
          emitter.emit(after);
        },
        source: () => `${this.name}(${exprA.source()})`,
        [Expression]: true,
      };
    }
  };

const makeStringExpression = (name: string, method: string = name) =>
  makeBinaryExpression(name, 'String(', `).${method}(String(`, '))');

export const simpleExpressionFactories = [
  makeUnaryExpression('not', '!(', ')'),
  makeBinaryExpression('and', '(', ') && (', ')'),
  makeBinaryExpression('or', '(', ') || (', ')'),
  makeBinaryExpression('xor', '!(', ') !== !(', ')'),

  makeBinaryExpression('eq', '', ' == ', ''),
  makeBinaryExpression('neq', '', ' !== ', ''),
  makeBinaryExpression('gt', '', ' > ', ''),
  makeBinaryExpression('gte', '', ' >= ', ''),
  makeBinaryExpression('lt', '', ' < ', ''),
  makeBinaryExpression('lte', '', ' <= ', ''),

  makeStringExpression('contains', 'includes'),
  makeStringExpression('endsWith'),
  makeStringExpression('startsWith'),
].map(f => new f());
