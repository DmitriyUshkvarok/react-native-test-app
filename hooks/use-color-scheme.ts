import { useAppSelector } from '@/hooks/redux';

export function useColorScheme() {
  const theme = useAppSelector((state) => state.theme.theme);
  return theme;
}
