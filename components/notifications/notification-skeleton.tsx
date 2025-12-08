import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export const NotificationSkeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const skeletonColor = useThemeColor(
    { light: '#E5E7EB', dark: '#374151' },
    'text',
  );

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <ThemedView className="p-4">
      {[1, 2, 3].map((i) => (
        <View key={i} className="flex-row items-start mb-4">
          {/* Avatar Skeleton */}
          <Animated.View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: skeletonColor,
              marginRight: 12,
              opacity,
            }}
          />

          {/* Content Skeleton */}
          <View className="flex-1">
            <Animated.View
              style={{
                width: '80%',
                height: 12,
                borderRadius: 4,
                backgroundColor: skeletonColor,
                marginBottom: 8,
                opacity,
              }}
            />
            <Animated.View
              style={{
                width: '60%',
                height: 16,
                borderRadius: 4,
                backgroundColor: skeletonColor,
                marginBottom: 6,
                opacity,
              }}
            />
            <Animated.View
              style={{
                width: '40%',
                height: 10,
                borderRadius: 4,
                backgroundColor: skeletonColor,
                opacity,
              }}
            />
          </View>
        </View>
      ))}
    </ThemedView>
  );
};
