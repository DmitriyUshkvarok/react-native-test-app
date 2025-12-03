import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ButtonOpacity from '@/components/ui/button-opacity';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { View } from 'react-native';

interface EmptyFeedProps {
  onCreatePost: () => void;
}

export default function EmptyFeed({ onCreatePost }: EmptyFeedProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView className="flex-1 justify-center items-center p-10">
      <View className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-6">
        <IconSymbol name="camera.fill" size={48} color={tintColor} />
      </View>
      <ThemedText className="text-xl font-bold mb-2">No Posts Yet</ThemedText>
      <ThemedText className="text-gray-500 text-center mb-6">
        It looks like there are no posts here. Why not be the first to share
        something amazing?
      </ThemedText>
      <ButtonOpacity
        onPress={onCreatePost}
        className="bg-[#0a7ea4] dark:bg-[#4ade80] px-6 py-3 rounded-full"
      >
        <ThemedText className="text-white font-semibold">
          Create Post
        </ThemedText>
      </ButtonOpacity>
    </ThemedView>
  );
}
