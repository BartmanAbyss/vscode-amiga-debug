/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

export const classes = (...classes: readonly (string | false | 0 | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');
