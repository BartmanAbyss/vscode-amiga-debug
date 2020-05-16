/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { simpleExpressionFactories } from './simple';
import { MatchExpressionFactory } from './match';
import { HasStatementFactory, HasDeepStatementFactory, HasDeepExpressionFactory } from './has';
import { IOperatorFactory, IStatementFactory } from '.';
import { OrderByStatementFactory, AscendingExpression, DescendingExpression } from './orderBy';
import { SkipStatementFactory, LimitStatementFactory } from './limit';

export const expressionFactories: ReadonlyArray<IOperatorFactory> = [
  ...simpleExpressionFactories,
  new MatchExpressionFactory(),
  new AscendingExpression(),
  new DescendingExpression(),
  new HasDeepExpressionFactory(),
];

export const statementFactories: ReadonlyArray<IStatementFactory> = [
  new HasStatementFactory(),
  new HasDeepStatementFactory(),
  new OrderByStatementFactory(),
  new SkipStatementFactory(),
  new LimitStatementFactory(),
];
