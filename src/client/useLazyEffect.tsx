/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { useRef, useEffect, Inputs } from 'preact/hooks';

/**
 * Like useEffect, but only runs when its inputs change, not on the first render.
 */
export const useLazyEffect = (fn: () => void | (() => void), inputs: Inputs): void => {
  const isFirst = useRef(true);
  useEffect(() => {
    if (!isFirst.current) {
      return fn();
    }

    isFirst.current = false;
  }, inputs);
};
