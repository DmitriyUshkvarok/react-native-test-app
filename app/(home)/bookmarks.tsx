import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bookmarks = () => {
  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ThemedView className="flex-1 justify-center items-center px-6">
        <View className="items-center">
          <IconSymbol name="bookmark.fill" size={64} color="#3B82F6" />
          <ThemedText className="text-2xl font-bold mt-4 mb-2">
            Закладки
          </ThemedText>
          <ThemedText className="text-center text-gray-600 dark:text-gray-400">
            Здесь будут отображаться ваши сохраненные элементы
          </ThemedText>

          <View className="mt-8 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <ThemedText className="text-sm text-center">
              💡 Этот экран использует SafeAreaView без ScrollView
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Bookmarks;
