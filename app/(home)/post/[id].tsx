import LayoutScroll from '@/components/_layout-scroll';
import PostCard from '@/components/home/post-card';
import PostDetailFooter from '@/components/home/post-detail-footer';
import { PostSkeleton } from '@/components/post-skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const postData = useQuery(api.posts.getPostById, {
    postId: id as Id<'posts'>,
  });

  const deletePost = useMutation(api.posts.deletePost);
  const updatePost = useMutation(api.posts.updatePost);

  const handleDeletePost = async (postId: Id<'posts'>) => {
    try {
      await deletePost({ postId });
      router.back();
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  const handleEditPost = async (postId: Id<'posts'>, newCaption: string) => {
    try {
      await updatePost({ postId, caption: newCaption });
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'Failed to update caption. Please try again.');
    }
  };

  if (postData === undefined) {
    return (
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <ThemedText className="text-xl font-bold ml-4">Post</ThemedText>
        </ThemedView>
        <PostSkeleton />
        <PostSkeleton />
      </SafeAreaView>
    );
  }

  if (!postData) {
    return (
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <ThemedText className="text-xl font-bold ml-4">Post</ThemedText>
        </ThemedView>
        <ThemedView className="flex-1 items-center justify-center">
          <ThemedText className="text-gray-500">Post not found</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const { post, currentUserId } = postData;

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <ThemedView className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <ThemedText className="text-xl font-bold ml-4">Post</ThemedText>
      </ThemedView>
      <LayoutScroll
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <PostCard
          post={post}
          blurhash={blurhash}
          currentUserId={currentUserId}
          onDelete={handleDeletePost}
          onEdit={handleEditPost}
        />

        {/* Footer with metadata and more posts */}
        {post.user && (
          <PostDetailFooter
            authorId={post.userId}
            authorName={post.user.name}
            postId={post._id}
            createdAt={post._creationTime}
          />
        )}
      </LayoutScroll>
    </ThemedView>
  );
}
