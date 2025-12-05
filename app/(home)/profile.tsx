import LayoutScroll from '@/components/_layout-scroll';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ButtonOpacity from '@/components/ui/button-opacity';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setTheme } from '@/store/theme-slice';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  RefreshControl,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

const Profile = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showSplash, setShowSplash] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <LayoutScroll
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex items-center p-6">
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 4,
            borderColor: 'white',
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          // className="w-32 h-32 rounded-full border-4 border-white shadow-sm"
          contentFit="cover"
          transition={1000}
        />
        <ThemedText className="mt-4 text-2xl font-bold">
          {user?.fullName || 'User'}
        </ThemedText>
        <ThemedText className="mt-1 text-gray-500">
          {user?.primaryEmailAddress?.emailAddress || 'No email'}
        </ThemedText>

        {/* Stats Section */}
        <ThemedView className="flex-row justify-around w-full mt-8 rounded-2xl p-4 bg-[#F3F4F6] dark:bg-[#1F2937]">
          <View className="items-center">
            <ThemedText className="text-xl font-bold">12</ThemedText>
            <ThemedText className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Orders
            </ThemedText>
          </View>
          <ThemedView className="w-[1px] bg-[#E5E7EB] dark:bg-[#374151]" />
          <View className="items-center">
            <ThemedText className="text-xl font-bold">5</ThemedText>
            <ThemedText className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Reviews
            </ThemedText>
          </View>
          <ThemedView className="w-[1px] bg-[#E5E7EB] dark:bg-[#374151]" />
          <View className="items-center">
            <ThemedText className="text-xl font-bold">240</ThemedText>
            <ThemedText className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Points
            </ThemedText>
          </View>
        </ThemedView>

        {/* Menu Section */}
        <ThemedView className="w-full mt-8 gap-4">
          <ThemedText className="text-lg font-semibold mb-2">
            Settings
          </ThemedText>

          <ThemedView className="flex-row items-center justify-between p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937]">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
                <IconSymbol name="bell.fill" size={20} color="#3B82F6" />
              </View>
              <ThemedText className="font-medium">Notifications</ThemedText>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#3B82F6' }}
            />
          </ThemedView>

          <ThemedView className="flex-row items-center justify-between p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937]">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center">
                <IconSymbol name="moon.fill" size={20} color="#A855F7" />
              </View>
              <ThemedText className="font-medium">Dark Mode</ThemedText>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#A855F7' }}
            />
          </ThemedView>

          <ButtonOpacity
            className="flex-row items-center justify-between p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937]"
            onPress={() => {}}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                <IconSymbol name="lock.fill" size={20} color="#22C55E" />
              </View>
              <ThemedText className="font-medium">
                Privacy & Security
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
          </ButtonOpacity>

          {/* DEV: Test Splash Screen */}
          <ButtonOpacity
            className="flex-row items-center justify-between p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937]"
            onPress={() => {
              setShowSplash(true);
              setTimeout(() => {
                setShowSplash(false);
              }, 3000); // Показать на 3 секунды
            }}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
                <IconSymbol name="leaf.fill" size={20} color="#EAB308" />
              </View>
              <ThemedText className="font-medium">
                Test Splash Screen
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
          </ButtonOpacity>

          <ButtonOpacity
            className="flex-row items-center justify-between p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#1F2937]"
            onPress={() => {}}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center">
                <IconSymbol
                  name="questionmark.circle.fill"
                  size={20}
                  color="#F97316"
                />
              </View>
              <ThemedText className="font-medium">Help & Support</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
          </ButtonOpacity>
        </ThemedView>

        <ButtonOpacity
          onPress={handleLogout}
          icon={{
            name: 'rectangle.portrait.and.arrow.right',
            size: 20,
            color: '#9CA3AF',
          }}
          className="mt-8 w-full h-[50px] border border-red-200 dark:border-red-800 bg-[#FEF2F2] dark:bg-[#450A0A]"
        >
          <ThemedText className="text-red-600 dark:text-red-400 font-semibold text-center">
            Log Out
          </ThemedText>
        </ButtonOpacity>

        <ThemedText className="mt-8 text-xs text-gray-400 text-center">
          Version 1.0.0
        </ThemedText>
      </View>

      <Modal
        visible={showSplash}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setShowSplash(false)}
      >
        <View className="flex-1 bg-[#151718] items-center justify-center">
          <Image
            source={require('@/assets/images/splash-icon.png')}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain" // Изменить на contain вместо cover
            transition={500}
          />
        </View>
      </Modal>
    </LayoutScroll>
  );
};

export default Profile;

const styles = StyleSheet.create({});
