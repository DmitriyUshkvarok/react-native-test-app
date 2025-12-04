import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { TouchableOpacity } from 'react-native';

interface PostLikeButtonProps {
  postId: Id<'posts'>;
  isLiked: boolean;
}

export default function PostLikeButton({
  postId,
  isLiked,
}: PostLikeButtonProps) {
  const iconColor = useThemeColor({}, 'icon');
  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = () => {
    toggleLike({ postId });
  };

  return (
    <TouchableOpacity onPress={handleLike}>
      <Ionicons
        name={isLiked ? 'heart' : 'heart-outline'}
        size={28}
        color={isLiked ? '#FF3040' : iconColor}
      />
    </TouchableOpacity>
  );
}
