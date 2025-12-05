import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import PostLikeButton from './post-like-button';
import { Post } from './types';

interface PostActionsProps {
  post: Post;
  onCommentPress: () => void;
}

export default function PostActions({
  post,
  onCommentPress,
}: PostActionsProps) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View className="flex-row items-center justify-between px-3 py-3">
      <View className="flex-row items-center gap-4">
        <PostLikeButton postId={post._id} isLiked={post.isLiked} />
        <TouchableOpacity onPress={onCommentPress}>
          <Ionicons name="chatbubble-outline" size={26} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={26} color={iconColor} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity>
        <Ionicons name="bookmark-outline" size={26} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}
