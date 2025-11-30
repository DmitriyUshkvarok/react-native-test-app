import { Text, type TextProps } from 'react-native';

import { cn } from '@/lib/utils';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={style}
      className={cn(
        'text-text',
        type === 'default' && 'text-base leading-6',
        type === 'defaultSemiBold' && 'text-base leading-6 font-semibold',
        type === 'title' && 'text-[29px] font-bold leading-[29px]',
        type === 'subtitle' && 'text-xl font-bold',
        type === 'link' && 'text-base leading-[30px] text-tint',
        className,
      )}
      {...rest}
    />
  );
}
