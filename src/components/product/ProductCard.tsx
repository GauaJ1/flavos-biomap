import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Product } from '../../types/product';
import { COLORS } from '../../constants/colors';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.info}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.biome}>{product.biome}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.secondary,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  biome: {
    fontSize: 14,
    color: COLORS.lightText,
  }
});
