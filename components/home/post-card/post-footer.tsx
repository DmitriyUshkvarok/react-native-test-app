import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatDistanceToNow } from 'date-fns';
import { TouchableOpacity } from 'react-native';
import { Post } from './types';

interface PostFooterProps {
  post: Post;
  onCommentPress: () => void;
}

export default function PostFooter({ post, onCommentPress }: PostFooterProps) {
  return (
    <>
      {/* Likes Count */}
      <ThemedView className="px-3">
        <ThemedText className="font-semibold">
          {post.likes} {post.likes === 1 ? 'like' : 'likes'}
        </ThemedText>
      </ThemedView>

      {/* Caption */}
      {post.caption && (
        <ThemedView className="mt-1 px-3">
          <ThemedText>
            <ThemedText className="font-semibold">
              {post.user?.fullName}{' '}
            </ThemedText>
            {post.caption}
          </ThemedText>
        </ThemedView>
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
      <ThemedView className="mt-1 px-3">
        <ThemedText className="text-xs text-gray-500 uppercase">
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}
        </ThemedText>
      </ThemedView>
    </>
  );
}
