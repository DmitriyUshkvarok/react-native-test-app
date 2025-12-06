import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface CommentsEmptyStateProps {
  isLoading: boolean;
}

export default function CommentsEmptyState({
  isLoading,
}: CommentsEmptyStateProps) {
  if (isLoading) {
    return (
      <ThemedView className="flex-1 items-center justify-center py-10">
        <ActivityIndicator />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1 items-center justify-center py-10">
      <ThemedText className="text-gray-500">No comments yet.</ThemedText>
      <ThemedText className="text-gray-400 text-sm mt-1">
        Start the conversation.
      </ThemedText>
    </ThemedView>
  );
}
