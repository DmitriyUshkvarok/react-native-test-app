import EmptyFeed from '@/components/home/empty-feed';
import HomeHeader from '@/components/home/home-header';
import PostCard from '@/components/home/post-card';
import Stories from '@/components/home/stories';
import { PostSkeleton } from '@/components/post-skeleton';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const HomePrimary = () => {
  const postsData = useQuery(api.posts.getPosts);
  const [refreshing, setRefreshing] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const deletePost = useMutation(api.posts.deletePost);
  const updatePost = useMutation(api.posts.updatePost);

  const onRefresh = () => {
    setRefreshing(true);
    // Convex queries are reactive and auto-update
    // Just provide visual feedback
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  const handleDeletePost = async (postId: Id<'posts'>) => {
    try {
      await deletePost({ postId });
      // Convex автоматически обновит список постов через реактивный query
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    }
  };

  const handleEditPost = async (postId: Id<'posts'>, newCaption: string) => {
    try {
      await updatePost({ postId, caption: newCaption });
      // Convex автоматически обновит список постов через реактивный query
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'Failed to update caption. Please try again.');
    }
  };

  // Show skeleton while loading
  if (postsData === undefined) {
    return (
      <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
        <HomeHeader onLogout={handleLogout} />
        <PostSkeleton />
        <PostSkeleton />
      </ThemedView>
    );
  }

  const { posts, currentUserId } = postsData;

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      {/* Custom Header */}
      <HomeHeader onLogout={handleLogout} />

      <FlatList
        // Данные для отображения - массив постов из Convex
        data={posts}
        // Уникальный ключ для каждого поста (для виртуализации)
        keyExtractor={(item) => item._id}
        // Компонент в начале списка (истории)
        ListHeaderComponent={<Stories user={user} />}
        // Pull-to-refresh для обновления ленты
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // Стили контейнера - растягивать на всю высоту
        contentContainerStyle={{ flexGrow: 1 }}
        // Не блокировать горизонтальную прокрутку (для Stories)
        directionalLockEnabled={false}
        // Скрыть вертикальный индикатор прокрутки
        showsVerticalScrollIndicator={false}
        // Рендер каждого поста
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
        // Компонент для пустого состояния (когда нет постов)
        ListEmptyComponent={
          <EmptyFeed onCreatePost={() => router.push('/(home)/create')} />
        }
      />
    </ThemedView>
  );
};

export default HomePrimary;
