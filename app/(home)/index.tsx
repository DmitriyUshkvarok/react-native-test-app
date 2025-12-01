import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomePrimary = () => {
  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView className="flex-1">
        <ThemedView className="p-6">
          <ThemedText className="text-2xl font-bold mb-4">
            SafeAreaView Demo
          </ThemedText>

          <ThemedText className="text-base mb-4">
            Этот экран использует SafeAreaView с edges={['left', 'right']}
          </ThemedText>

          {/* Визуальная демонстрация границ */}
          <View className="border-2 border-blue-500 p-4 rounded-lg mb-4">
            <ThemedText className="text-sm font-semibold mb-2">
              🔵 Синяя граница показывает контент
            </ThemedText>
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              На iPhone с notch контент не будет касаться краев экрана благодаря
              SafeAreaView
            </ThemedText>
          </View>

          {/* Объяснение edges */}
          <ThemedView className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <ThemedText className="font-semibold mb-2">
              Параметр edges={['left', 'right']}:
            </ThemedText>
            <ThemedText className="text-sm mb-1">
              ✅ Left - защита от левого края
            </ThemedText>
            <ThemedText className="text-sm mb-1">
              ✅ Right - защита от правого края
            </ThemedText>
            <ThemedText className="text-sm mb-1">
              ❌ Top - не используем (есть Header)
            </ThemedText>
            <ThemedText className="text-sm">
              ❌ Bottom - не используем (есть Tab Bar)
            </ThemedText>
          </ThemedView>

          {/* Примеры контента */}
          <ThemedText className="text-lg font-semibold mb-2">
            Примеры контента:
          </ThemedText>

          {[1, 2, 3, 4, 5].map((item) => (
            <ThemedView
              key={item}
              className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg mb-3"
            >
              <ThemedText className="font-medium">Карточка #{item}</ThemedText>
              <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Этот контент безопасно отображается на всех устройствах
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePrimary;
