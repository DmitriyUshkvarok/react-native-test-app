import { ThemedText } from '@/components/themed-text';
import { TouchableOpacity, View } from 'react-native';
import { Post } from './types';

interface PostFooterProps {
  post: Post;
  onCommentPress: () => void;
}

export default function PostFooter({ post, onCommentPress }: PostFooterProps) {
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
  };

  return (
    <>
      {/* Likes Count */}
      <View className="px-3">
        <ThemedText className="font-semibold">
          {post.likes} {post.likes === 1 ? 'like' : 'likes'}
        </ThemedText>
      </View>

      {/* Caption */}
      {post.caption && (
        <View className="mt-1 px-3">
          <ThemedText>
            <ThemedText className="font-semibold">
              {post.user?.fullName}{' '}
            </ThemedText>
            {post.caption}
          </ThemedText>
        </View>
      )}

      {/* Comments Link */}
      {post.comments > 0 && (
        <TouchableOpacity className="mt-1 px-3" onPress={onCommentPress}>
          <ThemedText className="text-gray-500">
            View all {post.comments} comments
          </ThemedText>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <View className="mt-1 px-3">
        <ThemedText className="text-xs text-gray-500 uppercase">
          {formatTimeAgo(post._creationTime)}
        </ThemedText>
      </View>
    </>
  );
}
