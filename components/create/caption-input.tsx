import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { TextInput } from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

interface CaptionInputProps {
  imageUri: string;
  caption: string;
  onChangeCaption: (text: string) => void;
  isSharing: boolean;
}

export default function CaptionInput({
  imageUri,
  caption,
  onChangeCaption,
  isSharing,
}: CaptionInputProps) {
  return (
    <ThemedView className="flex-row p-4 gap-4 border-b border-gray-100 dark:border-gray-800">
      <Image
        source={{ uri: imageUri }}
        placeholder={{ blurhash }}
        style={{ width: 70, height: 70, borderRadius: 4 }}
        contentFit="cover"
        transition={300}
      />
      <TextInput
        className="flex-1 text-black dark:text-white text-base pt-0"
        placeholder="Write a caption..."
        placeholderTextColor="#9CA3AF"
        multiline
        value={caption}
        onChangeText={onChangeCaption}
        editable={!isSharing}
        autoFocus={true}
      />
    </ThemedView>
  );
}
