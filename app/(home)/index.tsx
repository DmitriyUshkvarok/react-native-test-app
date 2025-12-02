import { PostSkeleton } from '@/components/post-skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePrimary = () => {
  const posts = useQuery(api.posts.getPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Convex queries are reactive and auto-update
    // Just provide visual feedback
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  // Show skeleton while loading
  if (posts === undefined) {
    return (
      <SafeAreaView
        className="flex-1 bg-white dark:bg-black"
        edges={['left', 'right']}
      >
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-black"
      edges={['left', 'right']}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <ThemedView className="mb-6">
            {/* Header */}
            <View className="flex-row items-center p-3">
              <Image
                source={{ uri: item.user?.image }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                contentFit="cover"
              />
              <ThemedText className="ml-3 font-semibold">
                {item.user?.fullName || 'User'}
              </ThemedText>
            </View>

            {/* Image */}
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: '100%', aspectRatio: 1 }}
              contentFit="cover"
              transition={200}
            />

            {/* Actions (Likes/Comments - Placeholder) */}
            <View className="flex-row p-3 gap-4">
              <ThemedText>❤️</ThemedText>
              <ThemedText>💬</ThemedText>
              <ThemedText>✈️</ThemedText>
            </View>

            {/* Caption */}
            {item.caption && (
              <View className="px-3 pb-2">
                <ThemedText>
                  <ThemedText className="font-semibold">
                    {item.user?.fullName || 'User'}{' '}
                  </ThemedText>
                  {item.caption}
                </ThemedText>
              </View>
            )}
          </ThemedView>
        )}
        ListEmptyComponent={() => (
          <ThemedView className="flex-1 justify-center items-center p-10">
            <ThemedText className="text-gray-500 text-center">
              No posts yet. Be the first to create one!
            </ThemedText>
          </ThemedView>
        )}
      />
    </SafeAreaView>
  );
};

export default HomePrimary;
