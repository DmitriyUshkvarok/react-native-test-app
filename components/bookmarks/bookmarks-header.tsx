import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function BookmarksHeader() {
  return (
    <ThemedView className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
      <ThemedView className="flex-row items-baseline justify-between">
        <ThemedText className="text-3xl font-bold tracking-tight">
          Collection
        </ThemedText>
        <ThemedText className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
          Saved
        </ThemedText>
      </ThemedView>
      <ThemedText className="text-gray-500 dark:text-gray-400 mt-1">
        Your personal library of inspiration
      </ThemedText>
    </ThemedView>
  );
}
