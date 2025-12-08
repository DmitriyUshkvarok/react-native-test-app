import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EmptyNotifications() {
  return (
    <ThemedView className="flex-1 justify-center items-center px-6 py-20">
      <ThemedView className="items-center bg-gray-50 dark:bg-gray-900/50 p-8 rounded-full mb-6">
        <IconSymbol name="bell.fill" size={64} color="#3B82F6" />
      </ThemedView>
      <ThemedText className="text-2xl font-bold mb-3 text-center">
        Нет уведомлений
      </ThemedText>
      <ThemedText className="text-center text-gray-500 dark:text-gray-400 text-base leading-6 px-4">
        Когда кто-то лайкнет или прокомментирует ваш пост, вы увидите это здесь
      </ThemedText>
    </ThemedView>
  );
}
