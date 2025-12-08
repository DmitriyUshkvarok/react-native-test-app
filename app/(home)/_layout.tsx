import { HapticTab } from '@/components/haptic-tab';
import { CustomHeader } from '@/components/ui/custom-header';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { Redirect, Tabs } from 'expo-router';

const HomeTabLayout = () => {
  const tintColor = useThemeColor({}, 'tint');
  const { isSignedIn } = useAuth();
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  if (!isSignedIn) {
    return <Redirect href={'/(auth)/login'} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: true,
        header: (props) => <CustomHeader {...props} />,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, // Отключаем стандартный header
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bookmark.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          headerTitle: 'New Post',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          headerShown: false,
          tabBarActiveTintColor: 'red', // Переопределяем цвет только для этой вкладки
          tabBarBadge: unreadCount ? unreadCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name="heart.fill"
              color={focused ? 'red' : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post/[id]"
        options={{
          href: null, // ВАЖНО: скрывает из табов, но маршрут остается доступным
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default HomeTabLayout;
