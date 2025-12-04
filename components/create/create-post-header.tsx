import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ButtonOpacity from '@/components/ui/button-opacity';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';

interface CreatePostHeaderProps {
  onBack: () => void;
  onShare: () => void;
  isSharing: boolean;
  hasImage: boolean;
}

export default function CreatePostHeader({
  onBack,
  onShare,
  isSharing,
  hasImage,
}: CreatePostHeaderProps) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
      <ButtonOpacity onPress={onBack} disabled={isSharing}>
        <Ionicons name="arrow-back" size={28} color={iconColor} />
      </ButtonOpacity>
      <ThemedText className="text-base font-bold">New Post</ThemedText>
      <ButtonOpacity disabled={isSharing || !hasImage} onPress={onShare}>
        {isSharing ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <ThemedText className="text-blue-500 font-bold text-base">
            Share
          </ThemedText>
        )}
      </ButtonOpacity>
    </ThemedView>
  );
}
