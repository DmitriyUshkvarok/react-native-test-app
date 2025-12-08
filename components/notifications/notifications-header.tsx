import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TouchableOpacity } from 'react-native';

interface NotificationsHeaderProps {
  hasUnread: boolean;
  onMarkAllRead: () => void;
}

export default function NotificationsHeader({
  hasUnread,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  return (
    <ThemedView className="flex-row justify-between items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
      <ThemedText className="text-3xl font-bold">Notifications</ThemedText>
      {hasUnread && (
        <TouchableOpacity onPress={onMarkAllRead}>
          <ThemedText className="text-blue-500 font-semibold">
            Mark all as read
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}
