import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';

export function Logo({ width = 32, height = 32 }) {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].tint;

  return (
    <View
      style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
    >
      <IconSymbol
        name="leaf.fill"
        size={Math.min(width, height)}
        color={color}
      />
    </View>
  );
}
