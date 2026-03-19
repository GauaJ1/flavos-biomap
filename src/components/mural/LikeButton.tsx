import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { COLORS } from '../../constants/colors';

interface Props {
  count: number;
  isLiked: boolean;
  onToggle: () => void;
}

export const LikeButton = ({ count, isLiked, onToggle }: Props) => {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    // Pop animation on press
    scale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 12, stiffness: 150 })
    );
    onToggle();
  }, [onToggle, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <TouchableOpacity 
      style={[styles.container, isLiked && styles.containerLiked]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={animStyle}>
        <Feather 
          name="heart" 
          size={20} 
          color={isLiked ? '#E53E3E' : COLORS.lightText} 
          style={styles.icon}
        />
      </Animated.View>
      <Text style={[styles.count, isLiked && styles.countLiked]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F1EA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBE6DF',
  },
  containerLiked: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FED7D7',
  },
  icon: {
    marginRight: 8,
  },
  count: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.lightText,
  },
  countLiked: {
    color: '#E53E3E',
  }
});
