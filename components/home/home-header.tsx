import { Logo } from '@/components/icons/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ButtonOpacity from '@/components/ui/button-opacity';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { View } from 'react-native';

interface HomeHeaderProps {
  onLogout: () => void;
}

export default function HomeHeader({ onLogout }: HomeHeaderProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      {/* Left: Logo + App Name */}
      <View className="flex-row items-center gap-2">
        <Logo width={32} height={32} />
        <ThemedText
          style={{ color: tintColor }}
          className="text-2xl font-serif"
        >
          Spotlight
        </ThemedText>
      </View>

      {/* Right: Logout Button */}
      <ButtonOpacity onPress={onLogout} className="w-10 h-10">
        <IconSymbol
          name="rectangle.portrait.and.arrow.right"
          size={24}
          color="#EF4444"
        />
      </ButtonOpacity>
    </ThemedView>
  );
}
