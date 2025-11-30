import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { IconSymbol, IconSymbolName } from './icon-symbol';

interface ButtonOpacityProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
  icon?: {
    name: IconSymbolName;
    size?: number;
    color?: string;
    position?: 'left' | 'right';
  };
}

const ButtonOpacity = ({
  children,
  className,
  icon,
  activeOpacity = 0.7,
  style,
  ...props
}: ButtonOpacityProps) => {
  return (
    <TouchableOpacity
      className={`rounded-lg flex items-center justify-center ${className}`}
      style={style}
      activeOpacity={activeOpacity}
      {...props}
    >
      {typeof children === 'string' || typeof children === 'number' || icon ? (
        <View className="flex-row items-center justify-center gap-2">
          {icon && icon.position !== 'right' && (
            <IconSymbol
              name={icon.name}
              size={icon.size || 20}
              color={icon.color || '#fff'}
            />
          )}
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text>{children}</Text>
          ) : (
            children
          )}
          {icon && icon.position === 'right' && (
            <IconSymbol
              name={icon.name}
              size={icon.size || 20}
              color={icon.color || '#fff'}
            />
          )}
        </View>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default ButtonOpacity;

const styles = StyleSheet.create({});
