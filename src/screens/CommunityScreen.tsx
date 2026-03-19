import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler, interpolate, Extrapolate } from 'react-native-reanimated';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../constants/colors';
import { SectionTitle } from '../components/ui/SectionTitle';
import { InfoBadge } from '../components/ui/InfoBadge';
import { OriginMap } from '../components/map/OriginMap';
import { CommunitiesAPI } from '../api/communities';
import { Community } from '../types/community';
import { useInitialAnimation } from '../hooks/useAnimation';

type RouteProps = RouteProp<RootStackParamList, 'Community'>;

export const CommunityScreen = () => {
  const route = useRoute<RouteProps>();
  const { communityId } = route.params;

  const [community, setCommunity] = React.useState<Community | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCommunity = async () => {
      setLoading(true);
      const data = await CommunitiesAPI.getCommunityById(communityId);
      setCommunity(data);
      setLoading(false);
    };
    fetchCommunity();
  }, [communityId]);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const imageAnimStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [-250, 0, 250], [-125, 0, 80], Extrapolate.CLAMP);
    const scale = interpolate(scrollY.value, [-250, 0], [1.5, 1], Extrapolate.CLAMP);
    return { transform: [{ translateY }, { scale }] };
  });

  const s1 = useInitialAnimation(100);
  const s2 = useInitialAnimation(200);
  const s3 = useInitialAnimation(300);

  const s1Style = useAnimatedStyle(() => ({ opacity: s1.opacity.value, transform: [{ translateY: s1.translateY.value }] }));
  const s2Style = useAnimatedStyle(() => ({ opacity: s2.opacity.value, transform: [{ translateY: s2.translateY.value }] }));
  const s3Style = useAnimatedStyle(() => ({ opacity: s3.opacity.value, transform: [{ translateY: s3.translateY.value }] }));

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
      >
        {loading || !community ? (
          <View style={styles.loadingContainer}>
             <Text style={styles.loadingText}>Carregando comunidade da sociobiodiversidade...</Text>
          </View>
        ) : (
          <>
            <View style={styles.imageWrapper}>
              <Animated.View style={[styles.imageContainer, imageAnimStyle]}>
                {community.image_url ? (
                  <Image source={{ uri: community.image_url }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Feather name="users" size={40} color={COLORS.secondary} />
                  </View>
                )}
              </Animated.View>
            </View>

            <View style={styles.content}>
              <Animated.View style={s1Style}>
                <Text style={styles.regionBadge}>📍 {community.location_name}</Text>
                <Text style={styles.title}>{community.name}</Text>
                <Text style={styles.description}>{community.description}</Text>
              </Animated.View>
              
              <Animated.View style={s2Style}>
                <InfoBadge 
                  icon="shield" 
                  title="Guardiões do Território" 
                  text="Esta comunidade desempenha um papel fundamental na proteção do bioma local, mantendo a floresta em pé e preservando técnicas ancestrais de cultivo e extração."
                  variant="earth"
                />
              </Animated.View>

              <Animated.View style={[styles.futureArea, s3Style]}>
                <Text style={styles.futureTitle}>Atuação no Mapa</Text>
                <View style={styles.mapContainer}>
                   {community.latitude && community.longitude ? (
                     <OriginMap latitude={community.latitude} longitude={community.longitude} />
                   ) : (
                     <View style={styles.mapFallback}>
                       <Feather name="map-pin" size={32} color={COLORS.secondary} />
                       <Text style={styles.mapText}>Localização indisponível</Text>
                     </View>
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
    width: '100%',
    height: 250,
    backgroundColor: '#F4F1EA',
    overflow: 'hidden',
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
    padding: SPACING.lg,
    marginTop: -30,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...SHADOWS.large,
    minHeight: 400,
  },
  regionBadge: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  futureArea: {
    marginTop: 24,
  },
  futureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
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
  }
});
