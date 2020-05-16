/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { FunctionComponent, h } from 'preact';
import { useCallback } from 'preact/hooks';
import styles from './toggle-button.css';

export const ToggleButton: FunctionComponent<{
  icon: string;
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void;
}> = ({ icon, label, checked, onChange, onClick }) => {
  const toggle = useCallback(() => {
    onClick?.();
    onChange?.(!checked);
  }, [checked, onClick, onChange]);

  return (
    <button
      className={styles.button}
      type="button"
      role="switch"
      alt={label}
      aria-label={label}
      aria-checked={checked ? 'true' : 'false'}
      dangerouslySetInnerHTML={{ __html: icon }}
      onClick={toggle}
    />
  );
};
