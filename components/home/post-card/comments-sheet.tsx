import { ThemedText } from '@/components/themed-text';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@clerk/clerk-expo';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useMutation, useQuery } from 'convex/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ListRenderItem,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommentItem, { Comment as IComment } from './comment-item';

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
  const [content, setContent] = useState('');
  const { userId: clerkUserId } = useAuth();
  const insets = useSafeAreaInsets();

  // Получаем текущего пользователя из базы (для проверки ID)
  const currentUser = useQuery(api.users.currentUser);

  const comments = useQuery(api.comments.getComments, { postId });
  const createComment = useMutation(api.comments.createComment);
  const deleteComment = useMutation(api.comments.deleteComment);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor(
    { light: '#E5E7EB', dark: '#374151' },
    'text',
  );

  const snapPoints = useMemo(() => ['50%', '90%'], []);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

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
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      await createComment({ postId, content: content.trim() });
      setContent('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleDelete = async (commentId: Id<'comments'>) => {
    try {
      await deleteComment({ commentId });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={insets.bottom}>
        <View
          className="px-4 py-3 border-t flex-row items-center gap-3"
          style={{
            backgroundColor,
            borderColor,
            paddingBottom: Platform.OS === 'android' ? 12 : 12, // Корректировка для андроида если нужно
          }}
        >
          <BottomSheetTextInput
            value={content}
            onChangeText={setContent}
            placeholder="Add a comment..."
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              backgroundColor: useThemeColor(
                { light: '#F3F4F6', dark: '#1F2937' },
                'background',
              ),
              color: textColor,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 16,
              // Fix for android line height issue
              lineHeight: undefined,
              height: 44,
            }}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!content.trim()}
            style={{ opacity: content.trim() ? 1 : 0.5 }}
          >
            <ThemedText className="font-semibold text-blue-500">
              Post
            </ThemedText>
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    ),
    [
      backgroundColor,
      borderColor,
      content,
      insets.bottom,
      textColor,
      handleSubmit,
    ],
  );

  const renderItem = useCallback<ListRenderItem<IComment>>(
    ({ item }) => (
      <CommentItem
        comment={item}
        currentUserId={currentUser?._id}
        isPostAuthor={currentUser?._id === postAuthorId}
        onDelete={handleDelete}
      />
    ),
    [currentUser, postAuthorId, handleDelete],
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor }}
      handleIndicatorStyle={{ backgroundColor: borderColor }}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      footerComponent={renderFooter}
    >
      <View style={{ flex: 1 }}>
        <ThemedText
          className="text-center font-semibold text-base py-2 border-b"
          style={{ borderColor }}
        >
          Comments
        </ThemedText>

        {comments === undefined ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <BottomSheetFlatList
            data={comments}
            keyExtractor={(item: IComment) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-10">
                <ThemedText className="text-gray-500">
                  No comments yet.
                </ThemedText>
                <ThemedText className="text-gray-400 text-sm mt-1">
                  Start the conversation.
                </ThemedText>
              </View>
            }
          />
        )}
      </View>
    </BottomSheetModal>
  );
}
