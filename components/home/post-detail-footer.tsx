import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';

interface PostDetailFooterProps {
  authorId: Id<'users'>;
  authorName: string;
  postId: Id<'posts'>;
  createdAt: number;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function PostDetailFooter({
  authorId,
  authorName,
  postId,
}: PostDetailFooterProps) {
  const router = useRouter();

  const authorPosts = useQuery(api.posts.getPostsByAuthor, {
    userId: authorId,
    excludePostId: postId,
    limit: 5,
  });

  const handlePostPress = (postId: Id<'posts'>) => {
    router.push(`/post/${postId}`);
  };

  return (
    <ThemedView>
      {/* More from Author Section */}
      {authorPosts && authorPosts.length > 0 && (
        <ThemedView>
          <ThemedView className="px-4 my-4">
            <ThemedText className="text-lg font-bold mb-3">
              More from @{authorName}
            </ThemedText>
          </ThemedView>

          <FlatList
            data={authorPosts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handlePostPress(item._id)}>
                <Image
                  source={{ uri: item.imageUrl }}
                  placeholder={{ blurhash }}
                  style={{ width: 130, height: 130, borderRadius: 12 }}
                  contentFit="cover"
                  transition={300}
                />
              </Pressable>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
            scrollEventThrottle={16}
            decelerationRate={0.998}
            nestedScrollEnabled={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={3}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
}
