import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface ImageSelectorProps {
  onSelect: () => void;
}

export default function ImageSelector({ onSelect }: ImageSelectorProps) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView className="flex-1">
      <TouchableOpacity
        className="flex-1 justify-center items-center gap-3"
        onPress={onSelect}
      >
        <Ionicons name="image-outline" size={48} color={iconColor} />
        <ThemedText className="text-gray-500 text-base">
          Tap to select an image
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
