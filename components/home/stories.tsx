import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MOCK_STORIES, StoryUser } from '@/constants/mock-stories';
import { UserResource } from '@clerk/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

interface StoryItemProps {
  user: StoryUser;
  isFirst?: boolean;
}

function StoryItem({ user, isFirst }: StoryItemProps) {
  const isYourStory = isFirst; // First item is always "Your Story"

  return (
    <TouchableOpacity className="items-center" activeOpacity={0.7}>
      <View className="relative">
        {/* Gradient border for stories */}
        {user.hasStory && !isYourStory ? (
          <LinearGradient
            colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              padding: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View className="bg-white dark:bg-black rounded-full p-0.5">
              <Image
                source={{ uri: user.avatar }}
                style={{ width: 64, height: 64, borderRadius: 32 }}
                contentFit="cover"
                transition={200}
              />
            </View>
          </LinearGradient>
        ) : (
          <View
            className="bg-gray-200 dark:bg-gray-800 rounded-full"
            style={{ width: 66, height: 66, padding: 1 }}
          >
            <Image
              source={{ uri: user.avatar }}
              style={{ width: 64, height: 64, borderRadius: 32 }}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}

        {/* Add story button for "Your Story" */}
        {isYourStory && (
          <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-5 h-5 items-center justify-center border-2 border-white dark:border-black">
            <Ionicons name="add" size={14} color="white" />
          </View>
        )}
      </View>

      {/* Username */}
      <ThemedText
        className="text-xs mt-1 text-center"
        numberOfLines={1}
        style={{ width: 70 }}
      >
        {user.username}
      </ThemedText>
    </TouchableOpacity>
  );
}

export default function Stories({
  user,
}: {
  user: UserResource | null | undefined;
}) {
  // Merge real user data with mock stories
  const storiesData = useMemo(() => {
    if (!user) return MOCK_STORIES;

    const yourStory: StoryUser = {
      id: user.id,
      username: user.fullName || 'You',
      avatar: user.imageUrl,
      hasStory: false,
    };

    // Replace first item with real user data
    return [yourStory, ...MOCK_STORIES.slice(1)];
  }, [user]);

  return (
    <ThemedView className="border-b border-gray-200 dark:border-gray-800">
      <FlatList
        // Данные для отображения - массив историй
        data={storiesData}
        // Горизонтальная прокрутка (слева направо)
        horizontal
        // Скрыть горизонтальный индикатор прокрутки
        showsHorizontalScrollIndicator={false}
        // Уникальный ключ для каждого элемента (для оптимизации)
        keyExtractor={(item) => item.id}
        // Рендер каждой истории
        renderItem={({ item, index }) => (
          <StoryItem user={item} isFirst={index === 0} />
        )}
        // Разделитель между историями (16px отступ)
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        // Отступы контейнера (12px по бокам, 16px сверху/снизу)
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 16,
        }}
        // Плавная инерционная прокрутка как на главной странице
        scrollEventThrottle={16} // Частота обновления события скролла (60 FPS)
        decelerationRate={0.998} // Скорость замедления после отпускания пальца (0.998 = очень плавно)
        // Разрешить вложенную прокрутку (для работы внутри вертикального FlatList)
        nestedScrollEnabled={true}
        // Оптимизация производительности
        removeClippedSubviews={true} // Удалять невидимые элементы из памяти
        maxToRenderPerBatch={10} // Рендерить максимум 10 элементов за раз
        windowSize={5} // Держать в памяти 5 экранов (2.5 сверху + 2.5 снизу)
        initialNumToRender={5} // Изначально отрендерить 5 элементов
      />
    </ThemedView>
  );
}
