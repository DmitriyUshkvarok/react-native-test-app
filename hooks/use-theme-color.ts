/**
 * Hook to get color values from Tailwind CSS variables.
 * Uses colors defined in global.css and tailwind.config.js
 */

import { useColorScheme } from '@/hooks/use-color-scheme';

type ColorName =
  | 'text'
  | 'background'
  | 'tint'
  | 'icon'
  | 'surface'
  | 'tabIconDefault'
  | 'tabIconSelected';

// These values match the CSS variables in global.css
const TAILWIND_COLORS = {
  light: {
    text: 'rgb(17, 24, 28)',
    background: 'rgb(255, 255, 255)',
    tint: 'rgb(10, 126, 164)',
    icon: 'rgb(104, 112, 118)',
    surface: 'rgb(243, 244, 246)',
    tabIconDefault: 'rgb(104, 112, 118)',
    tabIconSelected: 'rgb(10, 126, 164)',
  },
  dark: {
    text: 'rgb(236, 237, 238)',
    background: 'rgb(21, 23, 24)',
    tint: 'rgb(74, 222, 128)',
    icon: 'rgb(155, 161, 166)',
    surface: 'rgb(31, 41, 55)',
    tabIconDefault: 'rgb(155, 161, 166)',
    tabIconSelected: 'rgb(74, 222, 128)',
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return TAILWIND_COLORS[theme][colorName];
  }
}
