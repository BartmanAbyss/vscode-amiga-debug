/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { DebugProtocol as Dap } from 'vscode-debugprotocol';

/**
 * References a specific line and column in a DAP source.
 */
export interface ISourceLocation {
  lineNumber: number;
  columnNumber: number;
  source: Dap.Source;
  relativePath?: string;
}
