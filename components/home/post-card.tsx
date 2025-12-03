import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Id } from '@/convex/_generated/dataModel';
import { Image } from 'expo-image';
import { View } from 'react-native';

interface PostUser {
  _id: Id<'users'>;
  name: string;
  fullName: string;
  image: string | undefined;
}

interface Post {
  _id: Id<'posts'>;
  imageUrl: string;
  caption?: string;
  user: PostUser | null;
}

interface PostCardProps {
  post: Post;
  blurhash: string;
}

export default function PostCard({ post, blurhash }: PostCardProps) {
  return (
    <ThemedView className="mb-6">
      {/* Header */}
      <View className="flex-row items-center p-3">
        <Image
          source={{ uri: post.user?.image }}
          placeholder={{ blurhash }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
          contentFit="cover"
          transition={300}
        />
        <ThemedText className="ml-3 font-semibold">
          {post.user?.fullName || 'User'}
        </ThemedText>
      </View>

      {/* Image */}
      <Image
        source={{ uri: post.imageUrl }}
        placeholder={{ blurhash }}
        style={{ width: '100%', aspectRatio: 1 }}
        contentFit="cover"
        transition={500}
      />

      {/* Actions (Likes/Comments - Placeholder) */}
      <View className="flex-row p-3 gap-4">
        <ThemedText>❤️</ThemedText>
        <ThemedText>💬</ThemedText>
        <ThemedText>✈️</ThemedText>
      </View>

      {/* Caption */}
      {post.caption && (
        <View className="px-3 pb-2">
          <ThemedText>
            <ThemedText className="font-semibold">
              {post.user?.fullName || 'User'}{' '}
            </ThemedText>
            {post.caption}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}
