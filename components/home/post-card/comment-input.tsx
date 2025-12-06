import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useEffect, useState } from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  initialValue?: string;
  onCancel?: () => void;
  isEditing?: boolean;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export default function CommentInput({
  onSubmit,
  initialValue = '',
  onCancel,
  isEditing = false,
  backgroundColor,
  borderColor,
  textColor,
}: CommentInputProps) {
  const [content, setContent] = useState(initialValue);
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({}, 'icon');

  // сброс при изменении initialValue
  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    // для новых комментариев очищаем сразу (Оптимистичное UI)
    if (!isEditing) {
      const contentToSubmit = content;
      setContent('');
      Keyboard.dismiss();
      await onSubmit(contentToSubmit);
    } else {
      // для редактирования ждем пока комментарий обновится
      await onSubmit(content);
      // родительский компонент будет обрабатывать закрытие режима редактирования, что сбросит этот компонент
    }
  };

  const handleCancel = () => {
    setContent('');
    onCancel?.();
  };

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    !content.trim() || (isEditing && content === initialValue);

  return (
    <ThemedView
      className="px-4 py-3 border-t flex-row items-center gap-3"
      style={{
        backgroundColor,
        borderColor,
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      <BottomSheetTextInput
        value={content}
        onChangeText={setContent}
        placeholder={isEditing ? 'Update comment...' : 'Add a comment...'}
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
          lineHeight: 20,
          // Минимальная высота (одна строка)
          minHeight: 40,
          // Максимальная высота (примерно 4-5 строк), дальше появится скролл
          maxHeight: 100,
        }}
        // Включаем многострочный режим
        multiline={true}
        // Ограничение на количество символов
        maxLength={500}
        // Отключаем автоматический скролл к началу при блюре (для удобства)
        textAlignVertical="top"
        // Кнопка "Return" на клавиатуре не отправляет, а делает перенос строки
        // Но для удобства отправки можно оставить 'default' или 'send' (зависит от UX)
        // В данном случае 'default' позволяет делать переносы строк пользователю
        returnKeyType="default"
      />
      {isEditing && (
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close-circle" size={32} color="#EF4444" />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
        style={{
          opacity: isSubmitDisabled ? 0.5 : 1,
          backgroundColor: isEditing ? '#3B82F6' : undefined, // Optional: blue bg for update button circle
          borderRadius: 50,
          padding: 8,
          // Выравниваем кнопку по низу, если инпут вырос
          alignSelf: 'flex-end',
        }}
      >
        {isEditing ? (
          <Ionicons
            name="checkmark"
            size={24}
            color={isSubmitDisabled ? '#9CA3AF' : '#FFFFFF'} // White if active (on blue bg)
          />
        ) : (
          <Ionicons
            name="arrow-up-circle"
            size={32}
            color={isSubmitDisabled ? '#9CA3AF' : '#3B82F6'}
          />
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}
