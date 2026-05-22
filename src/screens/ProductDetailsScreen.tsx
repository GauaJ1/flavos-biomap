import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolate, Extrapolate, withTiming, withSpring, Easing, runOnJS } from 'react-native-reanimated';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SHADOWS, SPACING } from '../constants/colors';
import { InfoBadge } from '../components/ui/InfoBadge';
import { AppButton } from '../components/ui/AppButton';
import { useInitialAnimation } from '../hooks/useAnimation';
import { OriginMap } from '../components/map/OriginMap';
import { Comment } from '../types/comment';
import { CommentCard } from '../components/mural/CommentCard';
import { CommentInput } from '../components/mural/CommentInput';
import { LikeButton } from '../components/mural/LikeButton';
import { CommentsAPI } from '../api/comments';
import { LikesAPI } from '../api/likes';
import { ProductsAPI } from '../api/products';
import { CommunitiesAPI } from '../api/communities';
import { Product } from '../types/product';
import { Community } from '../types/community';

type RouteProps = RouteProp<RootStackParamList, 'ProductDetails'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { productSlug } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Discovery Game Hook State
  const [hasRevealed, setHasRevealed] = useState(false);
  const [hookUnmounted, setHookUnmounted] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'history' | 'producer' | 'impact'>('history');

  // Mural State
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(0); 
  const [isLiked, setIsLiked] = useState(false);
  const [loadingMural, setLoadingMural] = useState(true);

  // Animations values
  const hookOpacity = useSharedValue(1);
  const detailsOpacity = useSharedValue(0);
  const detailsScale = useSharedValue(0.95);

  // Fetch Details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      const fetchedProduct = await ProductsAPI.getProductBySlug(productSlug);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        const fetchedCommunity = await CommunitiesAPI.getCommunityById(fetchedProduct.community_id);
        setCommunity(fetchedCommunity);
      }
      setLoadingDetails(false);
    };
    fetchDetails();
  }, [productSlug]);

  // Fetch Mural Data
  useEffect(() => {
    if (!product) return;
    const fetchMuralData = async () => {
      setLoadingMural(true);
      
      const localLiked = await AsyncStorage.getItem(`@liked_${product.id}`);
      if (localLiked === 'true') {
        setIsLiked(true);
      }

      const [fetchedComments, fetchedLikes] = await Promise.all([
        CommentsAPI.getCommentsByProductId(product.id),
        LikesAPI.getLikesByProductId(product.id)
      ]);
      setComments(fetchedComments);
      setLikes(fetchedLikes);
      setLoadingMural(false);
    };
    fetchMuralData();
  }, [product]);

  const handleReveal = () => {
    // Fade out and scale down the hook wrapper softly
    hookOpacity.value = withTiming(0, { 
      duration: 500,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    }, (finished) => {
      if (finished) {
        runOnJS(setHookUnmounted)(true);
      }
    });
    setHasRevealed(true);
    
    // Smooth cross-fade to details with ease-out timing curve
    detailsOpacity.value = withTiming(1, { 
      duration: 650,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
    detailsScale.value = withTiming(1, { 
      duration: 650,
      easing: Easing.bezier(0.25, 1, 0.5, 1)
    });
  };

  const handleToggleLike = async () => {
    if (!product) return;
    const isLiking = !isLiked;
    setIsLiked(isLiking);
    setLikes(likes + (isLiking ? 1 : -1));
    
    if (isLiking) {
      await AsyncStorage.setItem(`@liked_${product.id}`, 'true');
    } else {
      await AsyncStorage.removeItem(`@liked_${product.id}`);
    }

    await LikesAPI.toggleLike(product.id, isLiking);
  };

  const handleAddComment = async (text: string, authorName: string) => {
    if (!product) return;
    const newComment = await CommentsAPI.addComment(product.id, text, authorName);
    if (newComment) {
       setComments([newComment, ...comments]);
    }
  };

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const imageAnimStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-300, 0, 300],
      [-150, 0, 100],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-300, 0],
      [2, 1],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const hookAnimStyle = useAnimatedStyle(() => ({
    opacity: hookOpacity.value,
    transform: [{ scale: interpolate(hookOpacity.value, [1, 0], [1, 0.9]) }]
  }));

  const detailsAnimStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
    transform: [{ scale: detailsScale.value }]
  }));

  // Biome-specific custom styling helper
  const getBiomeColor = (biome: string) => {
    switch (biome.toLowerCase()) {
      case 'amazônia': return '#2E7D32';
      case 'cerrado': return '#E65100';
      case 'caatinga': return '#8D6E63';
      case 'mata atlântica': return '#00897B';
      default: return COLORS.primary;
    }
  };

  const currentBiomeColor = product ? getBiomeColor(product.biome) : COLORS.primary;

  if (loadingDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Conectando ao rastro da floresta...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color={COLORS.secondary} style={{ marginBottom: 16 }} />
        <Text style={[styles.loadingText, { color: COLORS.primary, fontSize: 18, fontWeight: '700' }]}>
          Produto não encontrado!
        </Text>
        <Text style={[styles.loadingText, { textAlign: 'center', marginHorizontal: 32 }]}>
          O QR Code escaneado não corresponde a nenhum produto no nosso catálogo da sociobiodiversidade.
        </Text>
        <AppButton title="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
      </View>
    );
  }

  // PHASE 2: Main Details View with Card Tabs & Mural + Overlay
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
        scrollEnabled={hasRevealed}
      >
        {/* Parallax Image Banner */}
        <View style={styles.imageWrapper}>
          <Animated.View style={[styles.imageContainer, imageAnimStyle]}>
            {product.image_url ? (
              <Image source={{ uri: product.image_url }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="image" size={40} color={COLORS.secondary} />
              </View>
            )}
          </Animated.View>
        </View>

        {/* Content Panel */}
        <Animated.View style={[styles.content, detailsAnimStyle]}>
          {/* Header section (Revealed instantly) */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.locationSubtitle}>📍 {product.state} • {product.region}</Text>
            </View>
            <View style={[styles.biomeTag, { backgroundColor: currentBiomeColor + '15' }]}>
              <Text style={[styles.biomeText, { color: currentBiomeColor }]}>{product.biome}</Text>
            </View>
          </View>

          {/* Cards Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'history' && { backgroundColor: currentBiomeColor, borderColor: 'transparent' }
              ]}
              onPress={() => setActiveTab('history')}
            >
              <Feather name="book-open" size={14} color={activeTab === 'history' ? '#FFF' : COLORS.lightText} />
              <Text style={[styles.tabButtonText, activeTab === 'history' && styles.tabButtonTextActive]}>História</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'producer' && { backgroundColor: currentBiomeColor, borderColor: 'transparent' }
              ]}
              onPress={() => setActiveTab('producer')}
            >
              <Feather name="users" size={14} color={activeTab === 'producer' ? '#FFF' : COLORS.lightText} />
              <Text style={[styles.tabButtonText, activeTab === 'producer' && styles.tabButtonTextActive]}>Produtor</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.tabButton, 
                activeTab === 'impact' && { backgroundColor: currentBiomeColor, borderColor: 'transparent' }
              ]}
              onPress={() => setActiveTab('impact')}
            >
              <Feather name="activity" size={14} color={activeTab === 'impact' ? '#FFF' : COLORS.lightText} />
              <Text style={[styles.tabButtonText, activeTab === 'impact' && styles.tabButtonTextActive]}>Impacto</Text>
            </TouchableOpacity>
          </View>

          {/* Card/Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === 'history' && (
              <View style={styles.tabPane}>
                <Text style={styles.sectionHeading}>O que é o produto?</Text>
                <Text style={styles.bodyText}>{product.description}</Text>
                
                <View style={styles.knowledgeDivider} />
                
                <Text style={styles.sectionHeading}>Saber Tradicional & Produção</Text>
                <Text style={[styles.bodyText, styles.italicText]}>{product.traditional_knowledge}</Text>
              </View>
            )}

            {activeTab === 'producer' && (
              <View style={styles.tabPane}>
                {community ? (
                  <>
                    <TouchableOpacity 
                      style={styles.communityProfileCard}
                      onPress={() => navigation.navigate('Community', { communityId: community.id })}
                      activeOpacity={0.9}
                    >
                      <View style={styles.communityRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.communityLabel}>Comunidade Guardiã</Text>
                          <Text style={styles.communityName}>{community.name}</Text>
                          <Text style={styles.communityLocation}>📍 {community.location_name}</Text>
                        </View>
                        <Feather name="arrow-right-circle" size={24} color={currentBiomeColor} />
                      </View>
                      <Text style={styles.communityMiniDesc} numberOfLines={3}>
                        {community.description}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionHeading}>Localização no Território</Text>
                    <View style={styles.mapContainer}>
                      {product.latitude && product.longitude ? (
                        <OriginMap latitude={product.latitude} longitude={product.longitude} />
                      ) : (
                        <View style={styles.mapFallback}>
                          <Feather name="map" size={32} color={COLORS.secondary} />
                          <Text style={styles.mapText}>Coordenadas não cadastradas</Text>
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <Text style={styles.bodyText}>Informações da comunidade indisponíveis para este produto.</Text>
                )}
              </View>
            )}

            {activeTab === 'impact' && (
              <View style={styles.tabPane}>
                <Text style={styles.sectionHeading}>Importância Sustentável</Text>
                <Text style={styles.bodyText}>{product.sustainable_importance}</Text>
                
                <View style={styles.impactHighlightBox}>
                  <Feather name="shield" size={20} color={COLORS.primary} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.impactHighlightTitle}>Conservação Ativa</Text>
                    <Text style={styles.impactHighlightDesc}>
                      Ao adquirir produtos deste bioma ({product.biome}), você incentiva diretamente a conservação da biodiversidade nacional e protege florestas de pé.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Mural de Saberes Section */}
          <View style={styles.muralSection}>
            <View style={styles.muralHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.muralTitle}>Mural de Saberes</Text>
                <Text style={styles.muralSubtitle}>Compartilhe suas memórias ou deixe uma mensagem.</Text>
              </View>
              <LikeButton 
                count={likes} 
                isLiked={isLiked} 
                onToggle={handleToggleLike} 
              />
            </View>
            
            <View style={styles.muralInputContainer}>
              <CommentInput onSubmit={handleAddComment} />
            </View>

            <View style={styles.commentsList}>
              {loadingMural ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <>
                  {comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                  {comments.length === 0 && (
                    <Text style={styles.noCommentsText}>Seja o primeiro a deixar um saber no mural!</Text>
                  )}
                </>
              )}
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* PHASE 1: Hook / Curiosity Challenge Overlay */}
      {!hookUnmounted && (
        <Animated.View 
          style={[styles.hookWrapper, hookAnimStyle]} 
          pointerEvents={hasRevealed ? 'none' : 'auto'}
        >
          <Animated.View style={styles.hookContainer}>
            <View style={styles.hookHeader}>
              <Feather name="help-circle" size={40} color={COLORS.secondary} />
              <Text style={styles.hookTitle}>Você sabe de onde veio este produto antes de chegar aqui?</Text>
            </View>
            
            <View style={styles.hookCuriosityCard}>
              <Text style={styles.hookCuriosityLabel}>PISTA DO PRODUTOR</Text>
              <Text style={styles.hookCuriosityText}>
                {product.curiosity_clue ? product.curiosity_clue : (product.traditional_knowledge ? product.traditional_knowledge.substring(0, 180) + '...' : 'Este produto carrega segredos ancestrais de um bioma brasileiro e o suor de uma comunidade guardiã da floresta.')}
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.revealButton, { backgroundColor: currentBiomeColor }]} 
              onPress={handleReveal}
              activeOpacity={0.85}
            >
              <Text style={styles.revealButtonText}>DESCOBRIR A ORIGEM</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 40,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    minHeight: 350,
  },
  loadingText: {
    marginTop: 20,
    color: COLORS.secondary,
    fontWeight: '600',
    fontSize: 15,
  },
  hookWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
  },
  hookContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: '#ECEAE0',
    alignItems: 'center',
    gap: 24,
    ...SHADOWS.large,
  },
  hookHeader: {
    alignItems: 'center',
    gap: 12,
  },
  hookTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 28,
  },
  hookCuriosityCard: {
    backgroundColor: '#FAF8F5',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ECEAE0',
    width: '100%',
  },
  hookCuriosityLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  hookCuriosityText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    ...SHADOWS.medium,
  },
  revealButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  imageWrapper: {
    height: 280,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F4F1EA',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
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
    padding: 24,
    marginTop: -30,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 500,
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 32,
  },
  locationSubtitle: {
    fontSize: 13,
    color: COLORS.lightText,
    marginTop: 4,
    fontWeight: '600',
  },
  biomeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  biomeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F4F1EA',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.lightText,
  },
  tabButtonTextActive: {
    color: '#FFF',
  },
  tabContentContainer: {
    minHeight: 180,
  },
  tabPane: {
    gap: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bodyText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  italicText: {
    fontStyle: 'italic',
    color: COLORS.text,
  },
  knowledgeDivider: {
    height: 1,
    backgroundColor: '#EBE6DF',
    marginVertical: 4,
  },
  communityProfileCard: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#ECEAE0',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    ...SHADOWS.small,
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  communityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  communityLocation: {
    fontSize: 13,
    color: COLORS.lightText,
    marginTop: 2,
  },
  communityMiniDesc: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  mapContainer: {
    height: 180,
    backgroundColor: '#EBE6DF',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    ...SHADOWS.small,
  },
  mapFallback: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderStyle: 'dashed',
    borderRadius: 20,
  },
  mapText: {
    marginTop: 8,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  impactHighlightBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  impactHighlightTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  impactHighlightDesc: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  muralSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#EBE6DF',
  },
  muralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  muralTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  muralSubtitle: {
    fontSize: 13,
    color: COLORS.lightText,
    marginTop: 4,
  },
  muralInputContainer: {
    marginBottom: 20,
  },
  commentsList: {
    marginTop: 8,
    gap: 12,
  },
  noCommentsText: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  }
});
