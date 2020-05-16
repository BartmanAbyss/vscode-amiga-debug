/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { createContext } from 'preact';

/**
 * VS Code API exposed to webviews.
 */
export interface IVscodeApi<T = unknown> {
  getState(): T;
  setState(s: T): T;
  postMessage<M>(message: M): void;
}

declare const acquireVsCodeApi: () => IVscodeApi;

/**
 * Context key for the VS Code API object.
 */
export const VsCodeApi = createContext(acquireVsCodeApi());

/**
 * Parses the vscode CSS variables from the document.
 */
export const parseVariables = () => {
  const rawVars = String(document.documentElement.getAttribute('style'));
  const re = new RegExp('--vscode-(.*?):(.*?)(;|$)', 'g');
  const vars: { [key: string]: string } = {};

  let match: string[] | null;
  while ((match = re.exec(rawVars)) !== null) {
    const [, key, value] = match;
    vars[key] = value;
  }

  return vars;
};
