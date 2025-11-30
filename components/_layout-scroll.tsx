import { ThemedView } from '@/components/themed-view';
import { cn } from '@/lib/utils';
import { ScrollView, ScrollViewProps } from 'react-native';

interface LayoutScrollProps extends ScrollViewProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutScroll = ({ children, className, ...props }: LayoutScrollProps) => {
  return (
    <ThemedView className={cn(`h-full w-full pt-16`, className)}>
      <ScrollView showsVerticalScrollIndicator={false} {...props}>
        {children}
      </ScrollView>
    </ThemedView>
  );
};

export default LayoutScroll;
