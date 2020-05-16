/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { h, FunctionComponent } from 'preact';

export const Icon: FunctionComponent<{ i: string }> = ({ i }) => (
  <span dangerouslySetInnerHTML={{ __html: i }} />
);
