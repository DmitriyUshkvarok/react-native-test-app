import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export const PostSkeleton = () => {
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
    <ThemedView className="mb-6">
      {/* Header Skeleton */}
      <View className="flex-row items-center p-3">
        <Animated.View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: skeletonColor,
            opacity,
          }}
        />
        <Animated.View
          style={{
            width: 120,
            height: 16,
            borderRadius: 4,
            backgroundColor: skeletonColor,
            marginLeft: 12,
            opacity,
          }}
        />
      </View>

      {/* Image Skeleton */}
      <Animated.View
        style={{
          width: '100%',
          aspectRatio: 1,
          backgroundColor: skeletonColor,
          opacity,
        }}
      />

      {/* Actions Skeleton */}
      <View className="flex-row p-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Animated.View
            key={i}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: skeletonColor,
              opacity,
            }}
          />
        ))}
      </View>

      {/* Caption Skeleton */}
      <View className="px-3 pb-2">
        <Animated.View
          style={{
            width: '80%',
            height: 14,
            borderRadius: 4,
            backgroundColor: skeletonColor,
            marginBottom: 6,
            opacity,
          }}
        />
        <Animated.View
          style={{
            width: '60%',
            height: 14,
            borderRadius: 4,
            backgroundColor: skeletonColor,
            opacity,
          }}
        />
      </View>
    </ThemedView>
  );
};
