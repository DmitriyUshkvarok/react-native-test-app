import LayoutScroll from '@/components/_layout-scroll';
import CaptionInput from '@/components/create/caption-input';
import CreatePostHeader from '@/components/create/create-post-header';
import ImageSelector from '@/components/create/image-selector';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function CreateScreen() {
  const router = useRouter();

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
    return <ImageSelector onSelect={pickImage} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-black"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ThemedView>
        <CreatePostHeader
          onBack={() => {
            setSelectedImage(null);
            setCaption('');
          }}
          onShare={handleShare}
          isSharing={isSharing}
          hasImage={!!selectedImage}
        />
      </ThemedView>

      <LayoutScroll
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView className="flex-1">
          <CaptionInput
            imageUri={selectedImage}
            caption={caption}
            onChangeCaption={setCaption}
            isSharing={isSharing}
          />
        </ThemedView>
      </LayoutScroll>
    </KeyboardAvoidingView>
  );
}
