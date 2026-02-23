import type { ComponentProps } from 'react';
import { AppChip } from '../atoms';

interface FilterChipProps extends ComponentProps<typeof AppChip> {
  label: string;
  count?: number;
}

export function FilterChip({ label, count, ...props }: FilterChipProps) {
  const displayLabel = typeof count === 'number' ? `${label} ${count}` : label;

  return <AppChip label={displayLabel} {...props} />;
}
