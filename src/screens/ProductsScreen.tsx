import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Animated, { useAnimatedStyle, Easing } from 'react-native-reanimated';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING } from '../constants/colors';
import { SectionTitle } from '../components/ui/SectionTitle';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductsAPI } from '../api/products';
import { Product } from '../types/product';
import { useInitialAnimation } from '../hooks/useAnimation';

export const ProductsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await ProductsAPI.getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const headerAnim = useInitialAnimation(100);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.opacity.value,
    transform: [{ translateY: headerAnim.translateY.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 40 }}
        ListHeaderComponent={
          <Animated.View style={headerStyle}>
            <SectionTitle 
              title="Catálogo BioMap" 
              subtitle="Explore a riqueza da nossa sociobiodiversidade"
            />
          </Animated.View>
        }
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetails', { productSlug: item.slug })} 
          />
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    marginTop: SPACING.md,
  }
});
