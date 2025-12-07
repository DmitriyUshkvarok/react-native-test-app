import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { TouchableOpacity } from 'react-native';

interface PostBookmarkButtonProps {
  postId: Id<'posts'>;
  isBookmarked: boolean;
}

const PostBookmarkButton = ({
  postId,
  isBookmarked,
}: PostBookmarkButtonProps) => {
  const iconColor = useThemeColor({}, 'icon');
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

  const handleToggleBookmark = () => {
    toggleBookmark({ postId });
  };

  return (
    <TouchableOpacity onPress={handleToggleBookmark}>
      <Ionicons
        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
        size={26}
        color={isBookmarked ? iconColor : iconColor}
      />
    </TouchableOpacity>
  );
};

export default PostBookmarkButton;
