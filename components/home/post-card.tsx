import { ThemedView } from '@/components/themed-view';
import { Id } from '@/convex/_generated/dataModel';
import { Image } from 'expo-image';
import { useState } from 'react';
import PostActionsSheet from './post-actions-sheet';
import CommentsSheet from './post-card/comments-sheet';
import EditCaptionSheet from './post-card/edit-caption-sheet';
import PostActions from './post-card/post-actions';
import PostFooter from './post-card/post-footer';
import PostHeader from './post-card/post-header';
import { Post } from './post-card/types';

interface PostCardProps {
  post: Post;
  blurhash: string;
  currentUserId?: Id<'users'>; // ID текущего пользователя для проверки владельца поста
  onDelete?: (postId: Id<'posts'>) => void; // Callback для удаления поста
  onEdit?: (postId: Id<'posts'>, newCaption: string) => void; // Callback для редактирования
}

export default function PostCard({
  post,
  blurhash,
  currentUserId,
  onDelete,
  onEdit,
}: PostCardProps) {
  const [showActionsSheet, setShowActionsSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const handleMenuPress = () => {
    setShowActionsSheet(true);
  };

  const handleEdit = () => {
    setShowEditSheet(true);
  };

  const handleSaveEdit = async (postId: Id<'posts'>, newCaption: string) => {
    if (onEdit) {
      await onEdit(postId, newCaption);
    }
  };

  const handleDelete = (postId: Id<'posts'>) => {
    if (onDelete) {
      onDelete(postId);
    }
  };

  return (
    <>
      <ThemedView>
        {/* Header */}
        <PostHeader
          user={post.user}
          blurhash={blurhash}
          isOwner={currentUserId === post.user?._id}
          onMenuPress={handleMenuPress}
        />

        {/* Image */}
        <Image
          source={{ uri: post.imageUrl }}
          blurRadius={0}
          placeholder={{ blurhash }}
          style={{ width: '100%', aspectRatio: 1 }}
          contentFit="cover"
          transition={500}
          cachePolicy="memory-disk"
          priority="normal"
          recyclingKey={post._id}
          allowDownscaling
        />

        {/* Actions */}
        <PostActions post={post} onCommentPress={() => setShowComments(true)} />

        {/* Footer (Likes, Caption, Comments, Timestamp) */}
        <PostFooter post={post} />
      </ThemedView>

      {/* Modals */}
      <PostActionsSheet
        visible={showActionsSheet}
        postId={post._id}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClose={() => setShowActionsSheet(false)}
      />

      <EditCaptionSheet
        visible={showEditSheet}
        postId={post._id}
        currentCaption={post.caption}
        onSave={handleSaveEdit}
        onClose={() => setShowEditSheet(false)}
      />

      <CommentsSheet
        visible={showComments}
        postId={post._id}
        postAuthorId={post.userId}
        onClose={() => setShowComments(false)}
      />
    </>
  );
}
