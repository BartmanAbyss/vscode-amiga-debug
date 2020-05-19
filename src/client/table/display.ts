/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { ILocation } from '../model';

/**
 * Gets the human-readable label for the given location.
 */
export const getLocationText = (location: ILocation) => {
  if (!location.callFrame.url) {
    return; // 'virtual' frames like (program) or (idle)
  }

  if (!location.src?.source.path) {
    let text = `${location.callFrame.url}`;
    if (location.callFrame.lineNumber >= 0) {
      text += `:${location.callFrame.lineNumber}`;
    }

    return text;
  }

  if (location.src.relativePath) {
    return `${location.src.relativePath}:${location.src.lineNumber}`;
  }

  return `${location.src.source.path}:${location.src.lineNumber}`;
};

export const decimalFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});
