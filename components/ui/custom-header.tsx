import { Logo } from '@/components/icons/logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUser } from '@clerk/clerk-expo';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ButtonOpacity from './button-opacity';

export function CustomHeader({ options, route }: BottomTabHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tintColor = useThemeColor({}, 'tint');
  const { user } = useUser();

  // Получаем заголовок из options или используем название роута
  const title =
    typeof options.headerTitle === 'string'
      ? options.headerTitle
      : options.title || route.name;

  return (
    <ThemedView style={{ paddingTop: insets.top }}>
      <ThemedView className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        {/* Left: User Avatar */}
        <ButtonOpacity
          onPress={() => router.push('/(home)/profile')}
          className="w-8 h-8"
        >
          {user?.imageUrl ? (
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-8 h-8 rounded-full border-2 border-[#0a7ea4] dark:border-[#4ade80]"
            />
          ) : (
            <ThemedView className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 items-center justify-center">
              <IconSymbol name="person.fill" size={20} color={tintColor} />
            </ThemedView>
          )}
        </ButtonOpacity>

        {/* Center: Title */}
        <ThemedView className="flex-1 items-center">
          <ThemedText className="text-lg font-semibold">{title}</ThemedText>
        </ThemedView>

        {/* Right: Logo */}
        <ThemedView className="w-8 items-end">
          <Logo width={28} height={28} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
