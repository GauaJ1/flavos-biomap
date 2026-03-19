import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolate, Extrapolate, withTiming, withSpring, Easing } from 'react-native-reanimated';
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

  const [product, setProduct] = React.useState<Product | null>(null);
  const [community, setCommunity] = React.useState<Community | null>(null);
  const [loadingDetails, setLoadingDetails] = React.useState(true);

  // Mural State (Supabase Integração)
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [likes, setLikes] = React.useState(0); 
  const [isLiked, setIsLiked] = React.useState(false);
  const [loadingMural, setLoadingMural] = React.useState(true);

  // Busca os Produtos e a Comunidade
  React.useEffect(() => {
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

  // Busca o Mural apenas se o Produto já carregou
  React.useEffect(() => {
    if (!product) return;
    const fetchMuralData = async () => {
      setLoadingMural(true);
      
      // Verifica se o usuário já curtiu
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

  const handleToggleLike = async () => {
    if (!product) return;
    const isLiking = !isLiked;
    setIsLiked(isLiking);
    setLikes(likes + (isLiking ? 1 : -1)); // Optimistic UI update
    
    // Salva no dispositivo 
    if (isLiking) {
      await AsyncStorage.setItem(`@liked_${product.id}`, 'true');
    } else {
      await AsyncStorage.removeItem(`@liked_${product.id}`);
    }

    await LikesAPI.toggleLike(product.id, isLiking); // Sincroniza via RPC
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

  // Staggered Section Animations
  const section1 = useInitialAnimation(100);
  const section2 = useInitialAnimation(200);
  const section3 = useInitialAnimation(300);
  const section4 = useInitialAnimation(400);

  const s1Style = useAnimatedStyle(() => ({ opacity: section1.opacity.value, transform: [{ translateY: section1.translateY.value }] }));
  const s2Style = useAnimatedStyle(() => ({ opacity: section2.opacity.value, transform: [{ translateY: section2.translateY.value }] }));
  const s3Style = useAnimatedStyle(() => ({ opacity: section3.opacity.value, transform: [{ translateY: section3.translateY.value }] }));
  const s4Style = useAnimatedStyle(() => ({ opacity: section4.opacity.value, transform: [{ translateY: section4.translateY.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
      >
        {loadingDetails ? (
          <View style={styles.loadingContainer}>
             <Text style={styles.loadingText}>Carregando produto da sociobiodiversidade...</Text>
          </View>
        ) : !product ? (
          <View style={styles.loadingContainer}>
             <Feather name="alert-circle" size={48} color={COLORS.secondary} style={{ marginBottom: 16 }} />
             <Text style={[styles.loadingText, { color: COLORS.primary, fontSize: 18, fontWeight: '700' }]}>Produto não encontrado!</Text>
             <Text style={[styles.loadingText, { textAlign: 'center', marginHorizontal: 32 }]}>O QR Code escaneado não corresponde a nenhum produto no banco de dados.</Text>
             <AppButton title="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
          </View>
        ) : (
          <>
            {/* Imagem Principal com Parallax */}
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

            <View style={styles.content}>
              {/* Cabeçalho */}
              <Animated.View style={[styles.header, s1Style]}>
                <Text style={styles.title}>{product.name}</Text>
                <View style={styles.biomeTag}>
                  <Text style={styles.biomeText}>{product.biome}</Text>
                </View>
              </Animated.View>

              <Animated.Text style={[styles.description, s1Style]}>{product.description}</Animated.Text>

              {/* Card de Comunidade */}
              {community && (
                <Animated.View style={s2Style}>
                  <TouchableOpacity 
                    style={styles.communityCard}
                    onPress={() => navigation.navigate('Community', { communityId: community.id })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.communityInfo}>
                      <Text style={styles.communityLabel}>Origem Produtora</Text>
                      <Text style={styles.communityName}>{community.name}</Text>
                      <Text style={styles.communityLocation}>📍 {community.location_name}</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Badges Info */}
              <Animated.View style={s2Style}>
                <InfoBadge 
                  icon="globe" 
                  title="Importância Sustentável" 
                  text={product.sustainable_importance} 
                  variant="green"
                />

                <InfoBadge 
                  icon="book-open" 
                  title="Saber Tradicional" 
                  text={product.traditional_knowledge} 
                  variant="yellow"
                />
              </Animated.View>

              {/* Origem Territorial */}
              <Animated.View style={[styles.futureArea, s3Style]}>
                <Text style={styles.futureTitle}>Origem do Produto</Text>
                
                <View style={styles.originInfoContainer}>
                  <View style={styles.originInfoItem}>
                    <Text style={styles.originInfoLabel}>Bioma</Text>
                    <Text style={styles.originInfoValue}>{product.biome}</Text>
                  </View>
                  <View style={styles.originInfoItem}>
                    <Text style={styles.originInfoLabel}>Estado</Text>
                    <Text style={styles.originInfoValue}>{product.state}</Text>
                  </View>
                  <View style={styles.originInfoItem}>
                    <Text style={styles.originInfoLabel}>Região</Text>
                    <Text style={styles.originInfoValue}>{product.region}</Text>
                  </View>
                </View>

                <View style={styles.mapContainer}>
                   {product.latitude && product.longitude ? (
                     <OriginMap latitude={product.latitude} longitude={product.longitude} />
                   ) : (
                     <View style={styles.mapFallback}>
                       <Feather name="map" size={32} color={COLORS.secondary} />
                       <Text style={styles.mapText}>Localização indisponível</Text>
                     </View>
                   )}
                </View>
              </Animated.View>

              {/* Mural de Saberes */}
              <Animated.View style={[styles.muralSection, s4Style]}>
                <View style={styles.muralHeader}>
                  <View>
                    <Text style={styles.futureTitle}>Mural de Saberes</Text>
                    <Text style={styles.muralSubtitle}>Compartilhe suas memórias ou dúvidas sobre este produto.</Text>
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
                    <Text style={styles.noCommentsText}>Carregando saberes...</Text>
                  ) : (
                    <>
                      {comments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} />
                      ))}
                      {comments.length === 0 && (
                        <Text style={styles.noCommentsText}>Seja o primeiro a deixar um saber!</Text>
                      )}
                    </>
                  )}
                </View>
              </Animated.View>
            </View>
          </>
        )}
      </Animated.ScrollView>
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
    minHeight: 300,
  },
  loadingText: {
    marginTop: 20,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  imageWrapper: {
    height: 300,
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
    marginBottom: 16,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginRight: 16,
    lineHeight: 32,
  },
  biomeTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  biomeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F1EA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  communityLocation: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  futureArea: {
    marginTop: 8,
    marginBottom: 24,
  },
  futureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  originInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F4F1EA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  originInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  originInfoLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  originInfoValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#EBE6DF',
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.medium,
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
  muralSection: {
    marginTop: 16,
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
  muralSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginTop: 4,
    maxWidth: '80%',
  },
  muralInputContainer: {
    marginBottom: 20,
  },
  commentsList: {
    marginTop: 8,
  },
  noCommentsText: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  }
});
