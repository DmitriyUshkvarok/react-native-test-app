import { ThemedText } from '@/components/themed-text';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useMutation, useQuery } from 'convex/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, ListRenderItem } from 'react-native';
import CommentInput from './comment-input';
import CommentItem, { Comment as IComment } from './comment-item';
import CommentsEmptyState from './comments-empty-state';

interface CommentsSheetProps {
  visible: boolean;
  postId: Id<'posts'>;
  postAuthorId: Id<'users'>;
  onClose: () => void;
}

export default function CommentsSheet({
  visible,
  postId,
  postAuthorId,
  onClose,
}: CommentsSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [editingComment, setEditingComment] = useState<IComment | null>(null);

  // Получаем текущего пользователя из базы (для проверки ID)
  const currentUser = useQuery(api.users.currentUser);

  // Оптимизация: не загружаем комментарии, если шторка закрыта
  const comments = useQuery(
    api.comments.getComments,
    visible ? { postId } : 'skip',
  );
  const createComment = useMutation(api.comments.createComment);
  const updateComment = useMutation(api.comments.updateComment);
  const deleteComment = useMutation(api.comments.deleteComment);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: '#E5E7EB', dark: '#374151' },
    'text',
  );

  // Высоты шторки
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // Показываем/скрываем шторку при изменении visible
  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      setEditingComment(null); // Reset edit state on close
    }
  }, [visible]);

  // Обработка изменений шторки
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
        Keyboard.dismiss();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        // Индекс, при котором затемнение исчезает (-1 означает, что шторка закрыта)
        disappearsOnIndex={-1}
        // Индекс, при котором затемнение появляется (0 означает первый snap point)
        appearsOnIndex={0}
        // Прозрачность затемнения (0.5 = 50% прозрачности)
        opacity={0.5}
      />
    ),
    [],
  );

  const handleSubmit = useCallback(
    async (content: string) => {
      try {
        if (editingComment) {
          await updateComment({
            commentId: editingComment._id,
            content: content.trim(),
          });
          setEditingComment(null);
        } else {
          await createComment({ postId, content: content.trim() });
        }
      } catch (error) {
        console.error('Failed to submit comment:', error);
      }
    },
    [createComment, updateComment, postId, editingComment],
  );

  const handleDelete = useCallback(
    async (commentId: Id<'comments'>) => {
      try {
        await deleteComment({ commentId });
        if (editingComment?._id === commentId) {
          setEditingComment(null);
        }
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    },
    [deleteComment, editingComment],
  );

  const handleEdit = useCallback((comment: IComment) => {
    setEditingComment(comment);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
    Keyboard.dismiss();
  }, []);

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <CommentInput
          onSubmit={handleSubmit}
          initialValue={editingComment?.content}
          isEditing={!!editingComment}
          onCancel={handleCancelEdit}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          textColor={textColor}
        />
      </BottomSheetFooter>
    ),
    [
      backgroundColor,
      borderColor,
      textColor,
      handleSubmit,
      editingComment,
      handleCancelEdit,
    ],
  );

  const renderItem = useCallback<ListRenderItem<IComment>>(
    ({ item }) => (
      <CommentItem
        comment={item}
        currentUserId={currentUser?._id}
        isPostAuthor={currentUser?._id === postAuthorId}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    ),
    [currentUser, postAuthorId, handleDelete, handleEdit],
  );

  const renderHeader = useCallback(
    () => (
      <ThemedText
        className="text-center font-semibold text-base py-2 border-b mb-2"
        style={{ borderColor }}
      >
        Comments
      </ThemedText>
    ),
    [borderColor],
  );

  // Используем useMemo для стабильности компонента, чтобы FlatList не ре-рендерил его каждый раз
  const renderEmptyComponent = useMemo(
    () => <CommentsEmptyState isLoading={comments === undefined} />,
    [comments],
  );

  return (
    <BottomSheetModal
      // Ссылка для управления шторкой (открыть/закрыть программно)
      ref={bottomSheetModalRef}
      // Начальный индекс открытия (0 = первый snap point, т.е. 50%)
      index={0}
      // Точки остановки шторки ['50%', '90%']
      snapPoints={snapPoints}
      // Функция обратного вызова при изменении состояния (отслеживание закрытия)
      onChange={handleSheetChanges}
      // Компонент затемнения заднего фона
      backdropComponent={renderBackdrop}
      // Стили фона самой шторки
      backgroundStyle={{ backgroundColor }}
      // Стили полоски-индикатора сверху шторки
      handleIndicatorStyle={{ backgroundColor: borderColor }}
      // Разрешить закрытие шторки свайпом вниз
      enablePanDownToClose={true}
      // Поведение клавиатуры: интерактивное (шторка двигается вместе с клавиатурой)
      keyboardBehavior="interactive"
      // Поведение при потере фокуса клавиатуры: восстановить положение
      keyboardBlurBehavior="restore"
      // Режим ввода для Android: изменение размера окна при появлении клавиатуры
      android_keyboardInputMode="adjustResize"
      // Компонент футера (где находится инпут ввода)
      footerComponent={renderFooter}
    >
      <BottomSheetFlatList
        data={comments || []}
        keyExtractor={(item: IComment) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
      />
    </BottomSheetModal>
  );
}
