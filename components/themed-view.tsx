import { View, type ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedViewProps = ViewProps & {
  className?: string;
};

export function ThemedView({
  style,
  className,
  ...otherProps
}: ThemedViewProps) {
  return (
    <View
      style={style}
      className={cn('bg-white dark:bg-[#151718]', className)}
      {...otherProps}
    />
  );
}
