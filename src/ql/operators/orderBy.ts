/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
  Statement,
  IStatement,
  IStatementFactory,
  ICompilation,
  IExpressionFactory,
  Expression,
  IExpression,
} from './index';
import { PrimitiveExpression } from './primitive';
import { expectedGenericType } from '../query-error';

const OrderByScore = Symbol('OrderByScore');
const OrderByOperator = Symbol('OrderByOperator');

interface IOrderByExpression extends IExpression {
  [OrderByOperator]: string;
}

export class OrderByStatementFactory implements IStatementFactory {
  public readonly name = 'orderBy';

  public invoke(...directives: IOrderByExpression[]): IStatement {
    for (const directive of directives) {
      if (!directive || typeof directive[OrderByOperator] !== 'string') {
        throw expectedGenericType('asc() or desc()', this.name, directive);
      }
    }

    return {
      compile: c => {
        this.emitOrderFunction(c);

        c.sort.emit('nodes.sort((a, b) => {');
        c.sort.emit('let node, scoreA, scoreB, score;');
        for (const directive of directives) {
          c.sort.emit('node = a;');
          c.sort.emit('scoreA = ');
          directive.compile(c.sort, c);
          c.sort.emit(';', 'node = b;', 'scoreB = ');
          directive.compile(c.sort, c);
          c.sort.emit(
            ';',
            `score = ${directive[OrderByOperator]}orderByScore(scoreA, scoreB);`,
            'if (score !== 0) {',
            'return score;',
            '}',
          );
        }
        c.sort.emit('return 0;', '});');
      },
      source: () => `sort(${directives.map(d => d.source()).join(', ')})`,
      [Statement]: true,
    };
  }

  private emitOrderFunction(c: ICompilation) {
    c.global.emitOnce(
      OrderByScore,
      'function orderByScore(a, b) {',
      'if (typeof a === "number" && typeof b === "number") {',
      'return a - b;',
      '}',
      'return String(a).localeCompare(String(b));',
      '}',
    );
  }
}

/**
 * Ascending expression. Doesn't actually emit any code, but is used
 * to pass information when given to orderBy.
 */
export class AscendingExpression implements IExpressionFactory {
  public readonly name = 'asc';

  public invoke(a: unknown): IOrderByExpression {
    const expr = PrimitiveExpression.wrap(this.name, a);
    return {
      compile: (e, c) => expr.compile(e, c),
      source: () => `${this.name}(${expr.source()})`,
      [Expression]: true,
      [OrderByOperator]: '+',
    };
  }
}

/**
 * Descending expression. Doesn't actually emit any code, but is used
 * to pass information when given to orderBy.
 */
export class DescendingExpression implements IExpressionFactory {
  public readonly name = 'desc';

  public invoke(a: unknown): IOrderByExpression {
    const expr = PrimitiveExpression.wrap(this.name, a);
    return {
      compile: (e, c) => expr.compile(e, c),
      source: () => `${this.name}(${expr.source()})`,
      [Expression]: true,
      [OrderByOperator]: '-',
    };
  }
}
