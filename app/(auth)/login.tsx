import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSSO } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, TouchableOpacity, View } from 'react-native';

export default function login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace('/(home)');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  return (
    <ThemedView className="flex-1">
      {/* BRAND SECTION */}
      <View className="items-center mt-[12vh]">
        <View className="w-[60px] h-[60px] rounded-[18px] bg-green-400/15 justify-center items-center mb-5">
          <IconSymbol name="leaf.fill" size={32} color="#10b981" />
        </View>
        <ThemedText className="text-[42px] font-bold text-tint tracking-[0.5px] mb-2">
          spotlight
        </ThemedText>
        <ThemedText className="text-base text-icon tracking-[1px] lowercase">
          don't miss anything
        </ThemedText>
      </View>

      {/* ILLUSTRATION */}
      <View className="flex-1 justify-center items-center px-10">
        <Image
          source={require('@/assets/images/auth-bg-2.png')}
          className="w-[75vw] h-[75vw] max-h-[280px]"
          resizeMode="cover"
        />
      </View>

      {/* LOGIN SECTION */}
      <View className="w-full px-6 pb-10 items-center">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white dark:bg-[#2C2C2E] py-4 px-6 rounded-[14px] mb-5 w-full max-w-[300px] shadow-sm"
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View className="w-6 h-6 justify-center items-center mr-3">
            <Ionicons name="logo-google" size={20} color={textColor} />
          </View>
          <ThemedText className="text-base font-semibold">
            Continue with Google
          </ThemedText>
        </TouchableOpacity>

        <ThemedText className="text-center text-xs text-icon max-w-[280px]">
          By continuing, you agree to our Terms and Privacy Policy
        </ThemedText>
      </View>
    </ThemedView>
  );
}
