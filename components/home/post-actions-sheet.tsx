import { ThemedText } from '@/components/themed-text';
import { Id } from '@/convex/_generated/dataModel';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, Pressable, View } from 'react-native';

// Интерфейс свойств компонента (Props)
interface PostActionsSheetProps {
  // Флаг видимости модального окна (true - открыто, false - закрыто)
  visible: boolean;
  // ID поста, с которым мы работаем (из базы данных Convex)
  postId: Id<'posts'>;
  // Функция обратного вызова для редактирования (получает ID поста)
  onEdit: (postId: Id<'posts'>) => void;
  // Функция обратного вызова для удаления (получает ID поста)
  onDelete: (postId: Id<'posts'>) => void;
  // Функция для закрытия модального окна
  onClose: () => void;
}

export default function PostActionsSheet({
  visible,
  postId,
  onEdit,
  onDelete,
  onClose,
}: PostActionsSheetProps) {
  // Ссылка (ref) на компонент BottomSheetModal
  // ВАЖНО: Используем BottomSheetModal вместо обычного BottomSheet
  // Это позволяет шторке рендериться поверх всего приложения (через портал)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Получаем цвет иконки из текущей темы (светлая/темная)
  const iconColor = useThemeColor({}, 'icon');
  // Получаем цвет фона из текущей темы
  const backgroundColor = useThemeColor({}, 'background');
  // Получаем цвет границ (бордеров) в зависимости от темы
  const borderColor = useThemeColor(
    { light: '#E5E7EB', dark: '#374151' },
    'text',
  );

  // Точки привязки (Snap points)
  const snapPoints = useMemo(() => ['30%'], []);

  // Эффект для управления видимостью через ref
  useEffect(() => {
    if (visible) {
      // present() вместо expand() для модального режима
      bottomSheetModalRef.current?.present();
    } else {
      // dismiss() вместо close() для модального режима
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  // Компонент заднего фона (Backdrop)
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  // Обработчик закрытия шторки (вызывается библиотекой)
  const handleSheetChanges = useCallback(
    (index: number) => {
      // Если индекс -1, значит шторка закрылась
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const handleEdit = () => {
    bottomSheetModalRef.current?.dismiss();
    // Небольшая задержка не обязательна для логики, но полезна для анимации
    onEdit(postId);
  };

  const handleDelete = () => {
    bottomSheetModalRef.current?.dismiss();
    // Показываем алерт после закрытия шторки
    setTimeout(() => {
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => onDelete(postId),
          },
        ],
      );
    }, 100);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      // Позволяет закрыть свайпом вниз
      enablePanDownToClose={true}
      // Callback при изменении состояния (открыт/закрыт)
      onChange={handleSheetChanges}
      // Компонент фона
      backdropComponent={renderBackdrop}
      // Стили
      backgroundStyle={{ backgroundColor }}
      handleIndicatorStyle={{ backgroundColor: borderColor }}
    >
      <BottomSheetView
        style={{ backgroundColor, paddingHorizontal: 16, paddingBottom: 32 }}
      >
        {/* Опция "Редактировать" */}
        <Pressable
          className="flex-row items-center justify-between py-4"
          onPress={handleEdit}
        >
          <View className="flex-row items-center gap-4">
            <Ionicons name="create-outline" size={24} color={iconColor} />
            <ThemedText className="text-base font-medium">
              Edit Caption
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </Pressable>

        {/* Разделительная линия */}
        <View
          className="my-1 h-[1px]"
          style={{ backgroundColor: borderColor }}
        />

        {/* Опция "Удалить" */}
        <Pressable
          className="flex-row items-center justify-between py-4"
          onPress={handleDelete}
        >
          <View className="flex-row items-center gap-4">
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <ThemedText className="text-base font-medium text-red-500">
              Delete Post
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#EF4444" />
        </Pressable>

        {/* Кнопка "Отмена" */}
        <Pressable
          className="flex-row items-center justify-center py-4"
          onPress={() => bottomSheetModalRef.current?.dismiss()}
        >
          <ThemedText className="text-base font-semibold text-gray-500">
            Cancel
          </ThemedText>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
