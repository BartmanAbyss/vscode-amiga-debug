/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { properRelative } from './path';
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

/**
 * Adds the relativePath to the candidate based on the given root path..
 */
export const addRelativeDiskPath = (
  rootPath: string,
  candidate: ISourceLocation,
): ISourceLocation => {
  if (candidate.source.path && candidate.source.sourceReference === 0) {
    return {
      ...candidate,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      relativePath: properRelative(rootPath, candidate.source.path!),
    };
  }

  return candidate;
};
