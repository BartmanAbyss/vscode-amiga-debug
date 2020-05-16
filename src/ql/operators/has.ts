/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import {
  Statement,
  IStatement,
  IStatementFactory,
  IExpressionFactory,
  Expression,
  IExpression,
} from './index';
import { PrimitiveExpression } from './primitive';

export class HasStatementFactory implements IStatementFactory {
  public readonly name = 'has';

  public invoke(a: unknown): IStatement {
    const expr = PrimitiveExpression.wrap(this.name, a);
    return {
      compile: c => {
        c.filter.emit('if (!(');
        expr.compile(c.filter, c);
        c.filter.emit(')) {', 'return false;', '}');
      },
      source: () => `has(${expr.source()})`,
      [Statement]: true,
    };
  }
}

export class HasDeepExpressionFactory implements IExpressionFactory {
  public readonly name = 'hasDeep';

  public invoke(a: unknown): IExpression {
    const expr = PrimitiveExpression.wrap(this.name, a);
    return {
      compile: (emitter, compilation) => {
        emitter.emit('!!breadthFirstSearch(node, node => (');
        expr.compile(emitter, compilation);
        emitter.emit(') ? true : undefined)');
      },
      source: () => `hasDeep(${expr.source()})`,
      [Expression]: true,
    };
  }
}

export class HasDeepStatementFactory implements IStatementFactory {
  public readonly name = 'hasDeep';

  public invoke(a: unknown): IStatement {
    const expr = new HasDeepExpressionFactory().invoke(a);
    return {
      compile: c => {
        c.filter.emit('if (!(');
        expr.compile(c.filter, c);
        c.filter.emit(')) {', 'return false;', '}');
      },
      source: () => `hasDeep(${expr.source()})`,
      [Statement]: true,
    };
  }
}
