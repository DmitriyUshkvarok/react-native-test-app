import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ButtonOpacity from '@/components/ui/button-opacity';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Create = () => {
  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <ThemedView className="p-6">
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center mb-3">
              <IconSymbol name="plus" size={32} color="#22C55E" />
            </View>
            <ThemedText className="text-2xl font-bold">
              Создать новый пост
            </ThemedText>
          </View>

          {/* Форма */}
          <ThemedView className="gap-4">
            <View>
              <ThemedText className="text-sm font-medium mb-2">
                Заголовок
              </ThemedText>
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-900 dark:text-white"
                placeholder="Введите заголовок..."
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View>
              <ThemedText className="text-sm font-medium mb-2">
                Описание
              </ThemedText>
              <TextInput
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-gray-900 dark:text-white"
                placeholder="Введите описание..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <ButtonOpacity
              className="bg-green-500 h-[50px] rounded-lg mt-4"
              onPress={() => {}}
            >
              <ThemedText className="text-white font-semibold text-center">
                Опубликовать
              </ThemedText>
            </ButtonOpacity>
          </ThemedView>

          {/* Информация */}
          <View className="mt-8 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <ThemedText className="text-sm font-semibold mb-2">
              💡 Совет по SafeAreaView с формами:
            </ThemedText>
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              При работе с формами SafeAreaView автоматически учитывает
              клавиатуру на iOS. На Android может потребоваться
              KeyboardAvoidingView.
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
