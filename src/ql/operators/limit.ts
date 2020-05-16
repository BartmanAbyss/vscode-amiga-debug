/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Statement, IStatement, IStatementFactory } from './index';
import { expectedGenericType } from '../query-error';

export class LimitStatementFactory implements IStatementFactory {
  public readonly name = 'limit';

  public invoke(a: unknown): IStatement {
    if (typeof a !== 'number') {
      throw expectedGenericType(this.name, 'number', a);
    }
    return {
      compile: c => {
        c.sort.emit(`nodes = nodes.slice(0, ${a});`);
      },
      source: () => `limit(${a})`,
      [Statement]: true,
    };
  }
}

export class SkipStatementFactory implements IStatementFactory {
  public readonly name = 'skip';

  public invoke(a: unknown): IStatement {
    if (typeof a !== 'number') {
      throw expectedGenericType(this.name, 'number', a);
    }

    return {
      compile: c => {
        c.sort.emit(`nodes = nodes.slice(${a});`);
      },
      source: () => `skip(${a})`,
      [Statement]: true,
    };
  }
}
