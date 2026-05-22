import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../constants/colors';
import { ProductsAPI } from '../api/products';
import { CommunitiesAPI } from '../api/communities';
import { Product } from '../types/product';
import { Community } from '../types/community';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BiomeMap'>;

interface BiomeInfo {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: keyof typeof Feather.glyphMap;
  region: string;
  description: string;
  curiosity: string;
  impact: string;
}

const BIOMES_DATA: BiomeInfo[] = [
  {
    id: 'Amazônia',
    name: 'Amazônia',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    textColor: '#1B5E20',
    icon: 'feather',
    region: 'Região Norte do Brasil',
    description: 'A maior floresta tropical do mundo, lar de uma biodiversidade incomparável. O extrativismo sustentável aqui retém carbono na atmosfera e sustenta milhares de famílias ribeirinhas e indígenas.',
    curiosity: 'Muitas árvores da Amazônia, como a Castanheira, podem viver por mais de 500 anos e dependem de ecossistemas totalmente intactos para produzir frutos.',
    impact: 'Manutenção da cobertura florestal ativa, regulação de chuvas para todo o continente e geração de renda justa para comunidades tradicionais.'
  },
  {
    id: 'Cerrado',
    name: 'Cerrado',
    color: '#E65100',
    bgColor: '#FFF3E0',
    textColor: '#E65100',
    icon: 'sun',
    region: 'Planalto Central do Brasil',
    description: 'A savana com maior biodiversidade do planeta. Conhecido como o "berço das águas", o Cerrado abriga as nascentes das principais bacias hidrográficas da América do Sul.',
    curiosity: 'O Cerrado possui uma "floresta invertida": as raízes das árvores são extremamente profundas para buscar água, chegando a medir até três vezes o tamanho da copa.',
    impact: 'Conservação de recursos hídricos vitais, contenção da expansão agrícola agressiva e valorização de frutos nativos como Baru e Pequi.'
  },
  {
    id: 'Caatinga',
    name: 'Caatinga',
    color: '#8D6E63',
    bgColor: '#EFEBE9',
    textColor: '#4E342E',
    icon: 'cloud-drizzle',
    region: 'Sertão Nordestino',
    description: 'O único bioma exclusivamente brasileiro. Suas plantas e comunidades tradicionais desenvolveram adaptações extraordinárias para conviver com a escassez cíclica de água.',
    curiosity: 'O termo Caatinga vem do Tupi e significa "floresta branca", devido ao aspecto cinzento que a vegetação assume durante o longo período de seca.',
    impact: 'Combate à desertificação, valorização de cadeias produtivas de alta resiliência climática (como o Licuri e o Umbu) e fortalecimento da economia familiar.'
  },
  {
    id: 'Mata Atlântica',
    name: 'Mata Atlântica',
    color: '#00897B',
    bgColor: '#E0F2F1',
    textColor: '#004D40',
    icon: 'wind',
    region: 'Faixa Litorânea e Serrana',
    description: 'Uma das florestas mais ricas do mundo em espécies endêmicas (que não existem em nenhum outro lugar). Altamente fragmentada, necessita urgentemente de restauração ecológica.',
    curiosity: 'A Mata Atlântica possui mais de 20 mil espécies de plantas catalogadas, o que representa cerca de 8% de todas as espécies vegetais do planeta.',
    impact: 'Restauração de corredores ecológicos, proteção de mananciais de água para as maiores metrópoles do país e incentivo a sistemas agroflorestais.'
  }
];

export const BiomeMapScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedBiome, setSelectedBiome] = useState<string>('Amazônia');
  const [products, setProducts] = useState<Product[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  // Animating the detail panel
  const panelOpacity = useSharedValue(1);
  const panelTranslateY = useSharedValue(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [allProducts, allCommunities] = await Promise.all([
        ProductsAPI.getProducts(),
        CommunitiesAPI.getCommunities()
      ]);
      setProducts(allProducts);
      setCommunities(allCommunities);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSelectBiome = (biomeName: string) => {
    // Smooth timing transition: fade out slightly first, then switch state and slide back up
    panelOpacity.value = withTiming(0, { duration: 150 }, (finished) => {
      if (finished) {
        runOnJS(setSelectedBiome)(biomeName);
        panelTranslateY.value = 12; // Start slightly lower for a gentle lift
        panelOpacity.value = withTiming(1, { duration: 250 });
        panelTranslateY.value = withTiming(0, { duration: 300 });
      }
    });
  };

  const animStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [{ translateY: panelTranslateY.value }]
  }));

  const currentBiome = BIOMES_DATA.find(b => b.id === selectedBiome) || BIOMES_DATA[0];

  const filteredProducts = products.filter(p => 
    p.biome.toLowerCase() === selectedBiome.toLowerCase()
  );

  const filteredCommunities = communities.filter(c => 
    filteredProducts.some(p => p.community_id === c.id)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa Vivo</Text>
        <Text style={styles.subtitle}>Explore a sociobiodiversidade de cada bioma brasileiro</Text>
      </View>

      {/* Biome Selector List */}
      <View style={styles.selectorWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorContainer}
        >
          {BIOMES_DATA.map((biome) => {
            const isSelected = selectedBiome === biome.id;
            return (
              <TouchableOpacity
                key={biome.id}
                style={[
                  styles.biomeTab,
                  { backgroundColor: isSelected ? biome.color : COLORS.surface },
                  isSelected && styles.selectedTabShadow
                ]}
                onPress={() => handleSelectBiome(biome.id)}
              >
                <Feather 
                  name={biome.icon} 
                  size={16} 
                  color={isSelected ? '#FFF' : biome.color} 
                />
                <Text style={[
                  styles.biomeTabLabel,
                  { color: isSelected ? '#FFF' : COLORS.text }
                ]}>
                  {biome.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Conectando ao Mapa Vivo...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.biomePanel, animStyle]}>
          {/* Main Info Box */}
          <View style={[styles.card, { borderLeftColor: currentBiome.color }]}>
            <View style={styles.badgeRow}>
              <View style={[styles.biomeBadge, { backgroundColor: currentBiome.bgColor }]}>
                <Text style={[styles.biomeBadgeText, { color: currentBiome.textColor }]}>
                  {currentBiome.region}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.biomeTitle, { color: currentBiome.color }]}>
              {currentBiome.name}
            </Text>
            
            <Text style={styles.biomeDescription}>
              {currentBiome.description}
            </Text>
          </View>

          {/* Você Sabia? Box */}
          <View style={styles.curiosityBox}>
            <View style={styles.curiosityHeader}>
              <Feather name="help-circle" size={18} color={COLORS.secondary} />
              <Text style={styles.curiosityTitle}>Você sabia?</Text>
            </View>
            <Text style={styles.curiosityText}>
              {currentBiome.curiosity}
            </Text>
          </View>

          {/* Impact Box */}
          <View style={styles.impactBox}>
            <View style={styles.impactHeader}>
              <Feather name="shield" size={18} color={COLORS.primary} />
              <Text style={styles.impactTitle}>Impacto Ecológico & Social</Text>
            </View>
            <Text style={styles.impactText}>
              {currentBiome.impact}
            </Text>
          </View>

          {/* Products Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtos Deste Bioma</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredProducts.length === 0 
                ? 'Nenhum produto cadastrado para este bioma ainda.' 
                : `${filteredProducts.length} produto(s) na mostra`
              }
            </Text>
          </View>

          {filteredProducts.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productMiniCard}
                  onPress={() => navigation.navigate('ProductDetails', { productSlug: product.slug })}
                  activeOpacity={0.9}
                >
                  {product.image_url ? (
                    <Image source={{ uri: product.image_url }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productPlaceholder}>
                      <Feather name="image" size={24} color={COLORS.lightText} />
                    </View>
                  )}
                  <View style={styles.productMeta}>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.productCommunity} numberOfLines={1}>
                      📍 {product.state}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Communities Section */}
          {filteredCommunities.length > 0 && (
            <View style={styles.communitiesWrapper}>
              <Text style={styles.sectionTitle}>Comunidades Tradicionais</Text>
              {filteredCommunities.map((community) => (
                <TouchableOpacity
                  key={community.id}
                  style={styles.communityListItem}
                  onPress={() => navigation.navigate('Community', { communityId: community.id })}
                >
                  <View style={styles.communityDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.communityListName}>{community.name}</Text>
                    <Text style={styles.communityListLocation}>{community.location_name}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginTop: 4,
  },
  selectorWrapper: {
    marginBottom: SPACING.lg,
    marginHorizontal: -SPACING.lg,
  },
  selectorContainer: {
    paddingHorizontal: SPACING.lg,
    gap: 10,
    paddingBottom: 8,
  },
  biomeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  selectedTabShadow: {
    ...SHADOWS.medium,
    borderColor: 'transparent',
  },
  biomeTabLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.lightText,
    fontWeight: '600',
  },
  biomePanel: {
    gap: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    borderLeftWidth: 6,
    ...SHADOWS.medium,
  },
  badgeRow: {
    marginBottom: 8,
  },
  biomeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  biomeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  biomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  biomeDescription: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  curiosityBox: {
    backgroundColor: '#F7F6F0',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECEAE0',
    ...SHADOWS.small,
  },
  curiosityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  curiosityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  curiosityText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  impactBox: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  impactText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  sectionHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.lightText,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingBottom: 8,
    gap: 12,
  },
  productMiniCard: {
    width: 160,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECEAE0',
    ...SHADOWS.small,
  },
  productImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  productPlaceholder: {
    width: '100%',
    height: 110,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productMeta: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  productCommunity: {
    fontSize: 11,
    color: COLORS.lightText,
  },
  communitiesWrapper: {
    marginTop: 12,
    gap: 10,
  },
  communityListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEAE0',
    gap: 12,
    ...SHADOWS.small,
  },
  communityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  communityListName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  communityListLocation: {
    fontSize: 12,
    color: COLORS.lightText,
  }
});
