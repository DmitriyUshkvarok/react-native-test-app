import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BookmarksFooter() {
  return (
    <ThemedView className="py-8 items-center">
      <ThemedView className="w-12 h-1 bg-gray-200 dark:bg-gray-800 rounded-full mb-3" />
      <ThemedText className="text-xs text-gray-400 font-medium">
        End of collection
      </ThemedText>
    </ThemedView>
  );
}
