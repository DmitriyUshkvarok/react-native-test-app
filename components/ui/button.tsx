import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { IconSymbol, IconSymbolName } from './icon-symbol';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  className?: string;
  icon?: {
    name: IconSymbolName;
    size?: number;
    color?: string;
    position?: 'left' | 'right';
  };
}

const Button = ({ children, className, icon, ...props }: ButtonProps) => {
  return (
    <Pressable
      className={`rounded-lg flex items-center justify-center ${className}`}
      {...props}
    >
      <View className="flex-row items-center justify-center gap-2">
        {icon && icon.position !== 'right' && (
          <IconSymbol
            name={icon.name}
            size={icon.size || 20}
            color={icon.color || '#fff'}
          />
        )}
        <Text>{children}</Text>
        {icon && icon.position === 'right' && (
          <IconSymbol
            name={icon.name}
            size={icon.size || 20}
            color={icon.color || '#fff'}
          />
        )}
      </View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({});
