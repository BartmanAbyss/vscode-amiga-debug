/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { useState, useEffect } from 'preact/hooks';
import { parseVariables } from './vscodeApi';

/**
 * Uses CSS variables from the body.
 */
export const useCssVariables = () => {
  const [vars, setVars] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setVars(parseVariables);

    const observer = new MutationObserver(() => {
      setVars(parseVariables());
    });

    observer.observe(document.documentElement, {
      attributeFilter: ['style'],
      childList: false,
      subtree: false,
    });

    return () => observer.disconnect();
  }, []);

  return vars;
};
