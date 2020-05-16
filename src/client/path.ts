/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as path from 'path';
import { promises as fs } from 'fs';

export const exists = async (file: string) => {
  try {
    await fs.stat(file);
    return true;
  } catch {
    return false;
  }
};

/**
 * Resolves path segments properly based on whether they appear to be c:/ -style or / style.
 */
export function properRelative(fromPath: string, toPath: string): string {
  if (path.posix.isAbsolute(fromPath)) {
    return path.posix.relative(fromPath, toPath);
  } else if (path.win32.isAbsolute(fromPath)) {
    return path.win32.relative(fromPath, toPath);
  } else {
    return path.relative(fromPath, toPath);
  }
}

let isCaseSensitive = process.platform !== 'win32';

export function resetCaseSensitivePaths() {
  isCaseSensitive = process.platform !== 'win32';
}

export function setCaseSensitivePaths(sensitive: boolean) {
  isCaseSensitive = sensitive;
}

export function getCaseSensitivePaths() {
  return isCaseSensitive;
}

/**
 * Lowercases the path if the filesystem is case-insensitive. Warning: this
 * should only be done for the purposes of comparing paths.
 */
export function lowerCaseInsensitivePath(path: string) {
  return isCaseSensitive ? path : path.toLowerCase();
}

/**
 * Converts the file URL to an absolute path, if possible.
 */
export function maybeFileUrlToPath(fileUrl: string): string {
  if (!fileUrl.startsWith('file:///')) {
    return fileUrl;
  }

  fileUrl = fileUrl.replace('file:///', '');
  fileUrl = decodeURIComponent(fileUrl);
  if (fileUrl[0] !== '/' && !fileUrl.match(/^[A-Za-z]:/)) {
    // If it has a : before the first /, assume it's a windows path or url.
    // Ensure unix-style path starts with /, it can be removed when file:/// was stripped.
    // Don't add if the url still has a protocol
    fileUrl = '/' + fileUrl;
  }

  if (isWindowsPath(fileUrl)) {
    // If the path starts with a drive letter, ensure lowercase. VS Code uses a lowercase drive letter
    fileUrl = fileUrl[0].toLowerCase() + fileUrl.substr(1);
  }

  return fileUrl;
}

/**
 * Returns whether the path looks like a Windows path.
 */
export const isWindowsPath = (path: string) => /^[A-Za-z]:/.test(path);
