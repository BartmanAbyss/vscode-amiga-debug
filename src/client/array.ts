/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

/**
 * Runs a binary search in the array. Returns the index where the exact value
 * is found, or the *negative* of the index where it should be placed to
 * maintain sort order.
 */
export function binarySearch<T>(array: ReadonlyArray<T>, comparator: (value: T) => number): number {
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = ((low + high) / 2) | 0;
    const comp = comparator(array[mid]);
    if (comp < 0) {
      low = mid + 1;
    } else if (comp > 0) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -(low + 1);
}

/**
 * Immutably adds the value to the set.
 */
export const addToSet = <T>(set: ReadonlySet<T>, value: T) => {
  const next = new Set([...set, value]);
  next.add(value);
  return next;
};

/**
 * Immutably removes the value from the set.
 */
export const removeFromSet = <T>(set: ReadonlySet<T>, value: T) => {
  const next = new Set([...set]);
  next.delete(value);
  return next;
};

/**
 * Immutably removes the value from the set if it's present,
 * or adds it if it's not.
 */
export const toggleInSet = <T>(set: ReadonlySet<T>, value: T) => {
  const next = new Set([...set]);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }

  return next;
};
