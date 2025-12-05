import { ThemedText } from '@/components/themed-text';
import { Id } from '@/convex/_generated/dataModel';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { Alert, Pressable, View } from 'react-native';

export interface Comment {
  _id: Id<'comments'>;
  _creationTime: number;
  content: string;
  userId: Id<'users'>;
  user: {
    _id: Id<'users'>;
    name: string;
    fullName: string;
    image?: string;
  } | null;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId: string | undefined;
  isPostAuthor: boolean;
  onDelete: (commentId: Id<'comments'>) => void;
}

export default function CommentItem({
  comment,
  currentUserId,
  isPostAuthor,
  onDelete,
}: CommentItemProps) {
  const isOwnComment = comment.userId === currentUserId;
  const canDelete = isOwnComment || isPostAuthor;

  const handleLongPress = () => {
    if (!canDelete) return;

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(comment._id),
        },
      ],
    );
  };

  return (
    <Pressable
      onLongPress={handleLongPress}
      delayLongPress={500}
      className={`flex-row items-start px-4 py-3 gap-3 ${canDelete ? 'active:bg-gray-100 dark:active:bg-gray-800' : ''}`}
    >
      <Image
        source={comment.user?.image}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: '#e5e7eb',
        }}
        contentFit="cover"
        transition={200}
      />
      <View className="flex-1">
        <View className="flex-row items-baseline gap-2">
          <ThemedText type="defaultSemiBold" className="text-sm">
            {comment.user?.fullName || 'Unknown User'}
          </ThemedText>
          <ThemedText className="text-xs text-gray-500">
            {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
          </ThemedText>
        </View>
        <ThemedText className="text-sm mt-0.5 leading-5">
          {comment.content}
        </ThemedText>
      </View>
    </Pressable>
  );
}
