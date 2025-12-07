import BookmarksFooter from '@/components/bookmarks/bookmarks-footer';
import BookmarksHeader from '@/components/bookmarks/bookmarks-header';
import EmptyBookmarks from '@/components/bookmarks/empty-bookmarks';
import PostCard from '@/components/home/post-card';
import { PostSkeleton } from '@/components/post-skeleton';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Bookmarks = () => {
  const bookmarksData = useQuery(api.bookmarks.getBookmarkedPosts);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const deletePost = useMutation(api.posts.deletePost);
  const updatePost = useMutation(api.posts.updatePost);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const handleDeletePost = async (postId: Id<'posts'>) => {
    try {
      await deletePost({ postId });
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

  if (bookmarksData === undefined) {
    return (
      <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
        <BookmarksHeader />
        <PostSkeleton />
        <PostSkeleton />
      </ThemedView>
    );
  }

  const { posts, currentUserId } = bookmarksData;

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<BookmarksHeader />}
        ListFooterComponent={posts.length > 0 ? <BookmarksFooter /> : null}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            blurhash={blurhash}
            currentUserId={currentUserId}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
          />
        )}
        ItemSeparatorComponent={() => <ThemedView className="h-4" />}
        ListEmptyComponent={<EmptyBookmarks />}
      />
    </ThemedView>
  );
};

export default Bookmarks;
