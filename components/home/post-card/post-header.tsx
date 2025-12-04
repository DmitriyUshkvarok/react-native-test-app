import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { PostUser } from './types';

interface PostHeaderProps {
  user: PostUser | null;
  blurhash: string;
  isOwner: boolean;
  onMenuPress: () => void;
}

export default function PostHeader({
  user,
  blurhash,
  isOwner,
  onMenuPress,
}: PostHeaderProps) {
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View className="flex-row items-center justify-between px-3 py-2">
      {user?._id ? (
        <Link href={`/(home)/notifications`} asChild>
          <TouchableOpacity className="flex-row items-center gap-2">
            <Image
              source={{ uri: user?.image }}
              placeholder={{ blurhash }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
              contentFit="cover"
              transition={300}
              cachePolicy="memory-disk"
              priority="high"
              recyclingKey={user?._id}
            />
            <ThemedText className="font-semibold">
              {user?.fullName || 'Unknown User'}
            </ThemedText>
          </TouchableOpacity>
        </Link>
      ) : (
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: user?.image }}
            placeholder={{ blurhash }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
            contentFit="cover"
            transition={300}
            cachePolicy="memory-disk"
            priority="high"
            recyclingKey={user?._id}
          />
          <ThemedText className="font-semibold">
            {user?.fullName || 'Unknown User'}
          </ThemedText>
        </View>
      )}

      {isOwner && (
        <TouchableOpacity onPress={onMenuPress}>
          <Ionicons name="ellipsis-horizontal" size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}
