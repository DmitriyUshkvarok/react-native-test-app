import { ThemedText } from '@/components/themed-text';
import { Id } from '@/convex/_generated/dataModel';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Keyboard, View } from 'react-native';
import ButtonOpacity from '@/components/ui/button-opacity';

interface EditCaptionSheetProps {
  visible: boolean;
  postId: Id<'posts'>;
  currentCaption?: string;
  onSave: (postId: Id<'posts'>, newCaption: string) => void;
  onClose: () => void;
}

export default function EditCaptionSheet({
  visible,
  postId,
  currentCaption = '',
  onSave,
  onClose,
}: EditCaptionSheetProps) {
  // Используем BottomSheetModal для рендеринга поверх всего (включая табы)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [caption, setCaption] = useState(currentCaption);
  const [isSaving, setIsSaving] = useState(false);

  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor(
    { light: '#E5E7EB', dark: '#374151' },
    'text',
  );
  const inputBg = useThemeColor(
    { light: '#F3F4F6', dark: '#1F2937' },
    'background',
  );

  // Snap points - will expand when keyboard opens
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // Open/close sheet based on visible prop
  useEffect(() => {
    if (visible) {
      setCaption(currentCaption);
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
      Keyboard.dismiss();
    }
  }, [visible, currentCaption]);

  // Backdrop component
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

  // Обработчик изменений состояния шторки
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(postId, caption);
      bottomSheetModalRef.current?.dismiss();
    } catch (error) {
      Alert.alert('Error', 'Failed to update caption');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCaption(currentCaption);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor }}
      handleIndicatorStyle={{ backgroundColor: borderColor }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView
        style={{
          backgroundColor,
          paddingHorizontal: 16,
          paddingBottom: 32,
          flex: 1,
        }}
      >
        <View className="border-b border-gray-200 py-4 dark:border-gray-700">
          <ThemedText className="text-center text-lg font-semibold">
            Edit Caption
          </ThemedText>
        </View>

        <View className="flex-1 py-4">
          <BottomSheetTextInput
            style={{
              minHeight: 120,
              borderRadius: 12,
              borderWidth: 1,
              padding: 16,
              fontSize: 16,
              backgroundColor: inputBg,
              color: iconColor,
              borderColor: borderColor,
              textAlignVertical: 'top',
            }}
            placeholder="Write a caption..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={caption}
            onChangeText={setCaption}
            autoFocus
            maxLength={2200}
          />
          <ThemedText className="mt-2 text-right text-xs text-gray-400">
            {caption.length}/2200
          </ThemedText>
        </View>

        <View className="flex-row gap-3 pb-4">
          <ButtonOpacity
            onPress={handleCancel}
            disabled={isSaving}
            className="flex-1 items-center justify-center rounded-xl bg-gray-100 py-3.5 dark:bg-gray-800"
          >
            <ThemedText className="text-base font-semibold text-gray-700 dark:text-gray-300">
              Cancel
            </ThemedText>
          </ButtonOpacity>

          <ButtonOpacity
            onPress={handleSave}
            disabled={isSaving || caption === currentCaption}
            className={`flex-1 items-center justify-center rounded-xl py-3.5 ${
              isSaving || caption === currentCaption
                ? 'bg-gray-400'
                : 'bg-blue-500'
            }`}
          >
            <ThemedText className="text-base font-semibold text-white">
              {isSaving ? 'Saving...' : 'Save'}
            </ThemedText>
          </ButtonOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
