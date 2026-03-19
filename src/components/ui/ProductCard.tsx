import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Product } from '../../types/product';
import { COLORS, SHADOWS, SPACING } from '../../constants/colors';
import { Feather } from '@expo/vector-icons';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface Props {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: Props) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
      <View style={styles.imageContainer}>
        {product.image_url ? (
           <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
           <View style={styles.imagePlaceholder}>
             <Feather name="image" size={32} color={COLORS.secondary} />
           </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{product.name}</Text>
          <View style={styles.biomeTag}>
            <Text style={styles.biomeText}>{product.biome}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: '#EBE6DF',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#2C4C3B',
    marginRight: 8,
  },
  biomeTag: {
    backgroundColor: '#F4F1EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  biomeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  }
});
