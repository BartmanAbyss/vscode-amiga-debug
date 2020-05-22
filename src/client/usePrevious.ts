/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { useRef, useEffect } from 'preact/hooks';

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ref as any).current = value;
  }, [value]);

  return ref.current;
};
