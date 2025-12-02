import LayoutScroll from '@/components/_layout-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ButtonOpacity from '@/components/ui/button-opacity';
import { api } from '@/convex/_generated/api';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useUser();
  const iconColor = useThemeColor({}, 'icon');

  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
    }
  };

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const handleShare = async () => {
    if (!selectedImage) return;

    try {
      setIsSharing(true);
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: 'image/jpeg',
        },
      );

      if (uploadResult.status !== 200) throw new Error('Upload failed');

      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({ storageId, caption });

      setSelectedImage(null);
      setCaption('');

      router.push('/(home)');
    } catch (error) {
      console.log('Error sharing post');
    } finally {
      setIsSharing(false);
    }
  };

  if (!selectedImage) {
    return (
      <ThemedView className="flex-1">
        <TouchableOpacity
          className="flex-1 justify-center items-center gap-3"
          onPress={pickImage}
        >
          <Ionicons name="image-outline" size={48} color={iconColor} />
          <ThemedText className="text-gray-500 text-base">
            Tap to select an image
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ThemedView className="">
        {/* HEADER */}
        <ThemedView className="flex-row items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          <ButtonOpacity
            onPress={() => {
              setSelectedImage(null);
              setCaption('');
            }}
            disabled={isSharing}
          >
            <Ionicons name="arrow-back" size={28} color={iconColor} />
          </ButtonOpacity>
          <ThemedText className="text-base font-bold">New Post</ThemedText>
          <ButtonOpacity
            disabled={isSharing || !selectedImage}
            onPress={handleShare}
          >
            {isSharing ? (
              <ActivityIndicator size="small" color={iconColor} />
            ) : (
              <ThemedText className="text-blue-500 font-bold text-base">
                Share
              </ThemedText>
            )}
          </ButtonOpacity>
        </ThemedView>
      </ThemedView>

      <LayoutScroll
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="flex-1">
          {/* INPUT ROW */}
          <ThemedView className="flex-row p-4 gap-4 border-b border-gray-100 dark:border-gray-800">
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 70, height: 70, borderRadius: 4 }}
              contentFit="cover"
            />
            <TextInput
              className="flex-1 text-black dark:text-white text-base pt-0"
              placeholder="Write a caption..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={caption}
              onChangeText={setCaption}
              editable={!isSharing}
              autoFocus={true}
            />
          </ThemedView>
        </ThemedView>
      </LayoutScroll>
    </KeyboardAvoidingView>
  );
}
