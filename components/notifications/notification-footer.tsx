import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function NotificationFooter() {
  return (
    <ThemedView className="py-4 items-center border-t border-gray-200 dark:border-gray-800">
      <ThemedView className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-3" />
      <ThemedText className="text-xs text-gray-400 font-medium">
        End of notifications
      </ThemedText>
    </ThemedView>
  );
}
