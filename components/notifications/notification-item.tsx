import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

interface NotificationItemProps {
  notification: any;
  onPress: () => void;
}

export const NotificationItem = ({
  notification,
  onPress,
}: NotificationItemProps) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return { name: 'heart.fill' as const, color: '#EF4444' };
      case 'comment':
        return { name: 'message.fill' as const, color: '#3B82F6' };
      default:
        return { name: 'bell.fill' as const, color: '#6B7280' };
    }
  };

  const getNotificationTitle = () => {
    const senderName = notification.sender?.fullName || 'Пользователь';
    switch (notification.type) {
      case 'like':
        return `${senderName} лайкнул ваш пост`;
      case 'comment':
        return `${senderName} прокомментировал(а) ваш пост`;
      default:
        return 'Новое уведомление';
    }
  };

  const getNotificationContent = () => {
    if (notification.type === 'comment' && notification.comment?.content) {
      return notification.comment.content;
    }
    return null;
  };

  const icon = getNotificationIcon();
  const timeAgo = formatDistanceToNow(notification._creationTime, {
    addSuffix: true,
    locale: ru,
  });

  const senderImage = notification.sender?.image;
  const commentContent = getNotificationContent();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView
        className={`flex-row items-start p-4 rounded-xl mb-3 mx-1 ${
          notification.read
            ? 'bg-gray-50 dark:bg-gray-800'
            : 'bg-blue-50 dark:bg-blue-950'
        }`}
      >
        {/* Аватар пользователя или иконка */}
        <View className="mr-3 relative">
          {senderImage ? (
            <Image
              source={{ uri: senderImage }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              contentFit="cover"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center">
              <IconSymbol name="person.fill" size={24} color="#9CA3AF" />
            </View>
          )}
          {/* Маленькая иконка типа уведомления */}
          <View
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white dark:border-gray-900"
            style={{ backgroundColor: icon.color }}
          >
            <IconSymbol name={icon.name} size={12} color="white" />
          </View>
        </View>

        {/* Контент */}
        <View className="flex-1">
          <ThemedText className="text-xs text-gray-500 mb-1">
            {getNotificationTitle()}
          </ThemedText>
          {commentContent && (
            <ThemedText className="font-semibold mb-1">
              {commentContent}
            </ThemedText>
          )}
          <ThemedText className="text-xs text-gray-500">{timeAgo}</ThemedText>
        </View>

        {/* Индикатор непрочитанного */}
        {!notification.read && (
          <View className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
        )}
      </ThemedView>
    </TouchableOpacity>
  );
};
