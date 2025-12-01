import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      icon: 'heart.fill',
      color: '#EF4444',
      title: 'Новый лайк',
      message: 'Пользователь отметил ваш пост',
      time: '5 мин назад',
    },
    {
      id: 2,
      icon: 'message.fill',
      color: '#3B82F6',
      title: 'Новый комментарий',
      message: 'Кто-то прокомментировал ваш пост',
      time: '1 час назад',
    },
    {
      id: 3,
      icon: 'person.fill.badge.plus',
      color: '#22C55E',
      title: 'Новый подписчик',
      message: 'У вас новый подписчик',
      time: '2 часа назад',
    },
  ];

  return (
    <SafeAreaView className="flex-1" edges={['left', 'right']}>
      <ScrollView className="flex-1">
        <ThemedView className="p-6">
          <ThemedText className="text-2xl font-bold mb-6">
            Уведомления
          </ThemedText>

          {/* Список уведомлений */}
          {notifications.map((notification) => (
            <ThemedView
              key={notification.id}
              className="flex-row items-start bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-3"
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${notification.color}20` }}
              >
                <IconSymbol
                  name={notification.icon as any}
                  size={24}
                  color={notification.color}
                />
              </View>
              <View className="flex-1">
                <ThemedText className="font-semibold mb-1">
                  {notification.title}
                </ThemedText>
                <ThemedText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {notification.message}
                </ThemedText>
                <ThemedText className="text-xs text-gray-500">
                  {notification.time}
                </ThemedText>
              </View>
            </ThemedView>
          ))}

          {/* Информационный блок */}
          <View className="mt-4 bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <ThemedText className="text-sm font-semibold mb-2">
              ❤️ Особенность этого экрана:
            </ThemedText>
            <ThemedText className="text-sm text-gray-600 dark:text-gray-400">
              Обратите внимание, что в _layout.tsx для этой вкладки установлен
              tabBarActiveTintColor: 'red', что переопределяет глобальный цвет.
            </ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
