import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { COLORS, SHADOWS } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

interface Props {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline';
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const AppButton = ({ 
  title, 
  onPress, 
  type = 'primary', 
  icon, 
  loading = false, 
  disabled = false,
  style 
}: Props) => {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const getContainerStyle = (): ViewStyle => {
    switch(type) {
      case 'secondary': return styles.secondaryContainer;
      case 'outline': return styles.outlineContainer;
      default: return styles.primaryContainer;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch(type) {
      case 'secondary': return styles.secondaryText;
      case 'outline': return styles.outlineText;
      default: return styles.primaryText;
    }
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable 
        style={[styles.container, getContainerStyle(), disabled && styles.disabled]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color={type === 'outline' ? COLORS.primary : COLORS.surface} />
        ) : (
          <>
            {icon && <Feather name={icon} size={20} color={getTextStyle().color} style={styles.icon} />}
            <Text style={[styles.text, getTextStyle()]}>{title}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    ...SHADOWS.medium,
  },
  primaryContainer: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.primary,
  },
  secondaryContainer: {
    backgroundColor: COLORS.secondary,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: COLORS.surface,
  },
  secondaryText: {
    color: COLORS.surface,
  },
  outlineText: {
    color: COLORS.primary,
  },
  icon: {
    marginRight: 10,
  }
});
