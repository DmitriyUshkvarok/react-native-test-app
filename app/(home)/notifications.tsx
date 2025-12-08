import EmptyNotifications from '@/components/notifications/empty-notifications';
import NotificationFooter from '@/components/notifications/notification-footer';
import { NotificationItem } from '@/components/notifications/notification-item';
import { NotificationSkeleton } from '@/components/notifications/notification-skeleton';
import NotificationsHeader from '@/components/notifications/notifications-header';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Notifications = () => {
  const router = useRouter();
  const notifications = useQuery(api.notifications.get);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Convex queries update automatically, but we can simulate a refresh for UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleNotificationPress = async (notification: any) => {
    // 1. Отметить как прочитанное
    if (!notification.read) {
      await markAsRead({ notificationIds: [notification._id] });
    }

    // 2. Навигация к посту (динамический роутинг)
    if (notification.postId) {
      // Используем относительный путь, так как мы уже внутри группы (home)
      router.push(`/post/${notification.postId}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // Показываем скелетон при загрузке
  if (notifications === undefined) {
    return (
      <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
        <NotificationsHeader hasUnread={false} onMarkAllRead={() => {}} />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
        <NotificationSkeleton />
      </ThemedView>
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
      {/* Фиксированный заголовок */}
      <NotificationsHeader
        hasUnread={hasUnread}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Список уведомлений */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<NotificationFooter />}
        ListEmptyComponent={<EmptyNotifications />}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
          />
        )}
      />
    </ThemedView>
  );
};

export default Notifications;
