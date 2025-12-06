import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Id } from '@/convex/_generated/dataModel';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';
import { Alert, TouchableOpacity } from 'react-native';

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
  onEdit?: (comment: Comment) => void;
}

export default function CommentItem({
  comment,
  currentUserId,
  isPostAuthor,
  onDelete,
  onEdit,
}: CommentItemProps) {
  const isOwnComment = comment.userId === currentUserId;
  const canDelete = isOwnComment || isPostAuthor;
  const canEdit = isOwnComment;

  const handleDelete = () => {
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
    <ThemedView className="flex-row items-start px-4 py-3 gap-3">
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
      <ThemedView className="flex-1">
        <ThemedView className="flex-row items-baseline justify-between">
          <ThemedView className="flex-row items-baseline gap-2">
            <ThemedText type="defaultSemiBold" className="text-sm">
              {comment.user?.fullName || 'Unknown User'}
            </ThemedText>
            <ThemedText className="text-xs text-gray-500">
              {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedText className="text-sm mt-0.5 leading-5">
          {comment.content}
        </ThemedText>

        {/* Action Buttons */}
        {(canEdit || canDelete) && (
          <ThemedView className="flex-row gap-4 mt-2">
            {canEdit && (
              <TouchableOpacity
                onPress={() => onEdit?.(comment)}
                className="flex-row items-center gap-1"
              >
                <ThemedText className="text-xs text-gray-400 dark:text-orange-300 font-medium">
                  Edit
                </ThemedText>
              </TouchableOpacity>
            )}
            {canDelete && (
              <TouchableOpacity
                onPress={handleDelete}
                className="flex-row items-center gap-1"
              >
                <ThemedText className="text-xs text-red-400 dark:text-red-500 font-medium">
                  Delete
                </ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}
