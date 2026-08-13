import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, SHADOWS } from '../constants/colors';
import { AppButton } from '../components/ui/AppButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useInitialAnimation } from '../hooks/useAnimation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  const heroAnim = useInitialAnimation(80);
  const actionsAnim = useInitialAnimation(200);
  const aboutAnim = useInitialAnimation(320);
  const companyAnim = useInitialAnimation(440);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: heroAnim.opacity.value,
    transform: [{ translateY: heroAnim.translateY.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsAnim.opacity.value,
    transform: [{ translateY: actionsAnim.translateY.value }],
  }));

  const aboutStyle = useAnimatedStyle(() => ({
    opacity: aboutAnim.opacity.value,
    transform: [{ translateY: aboutAnim.translateY.value }],
  }));

  const companyStyle = useAnimatedStyle(() => ({
    opacity: companyAnim.opacity.value,
    transform: [{ translateY: companyAnim.translateY.value }],
  }));

  const handleOpenInstagram = () => {
    Linking.openURL('https://instagram.com/flavoscompany');
  };

  const handleOpenWebsite = () => {
    Linking.openURL('https://flavoscompany.xyz');
  };

  return (
    <ScreenContainer scroll={true} contentContainerStyle={styles.container}>
      {/* ─── 1. HERO SECTION ─── */}
      <Animated.View style={[styles.heroSection, heroStyle]}>
        <View style={styles.topBadgeRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>MOSTRA CULTURAL</Text>
          </View>
          <View style={styles.tagBadge}>
            <Feather name="globe" size={12} color={COLORS.secondary} style={{ marginRight: 4 }} />
            <Text style={styles.tagBadgeText}>SOCIOBIODIVERSIDADE</Text>
          </View>
        </View>

        <Text style={styles.title}>Flavos BioMap</Text>
        <Text style={styles.subtitle}>O Rastro da Floresta</Text>
        <Text style={styles.body}>
          Escaneie um produto da mostra cultural ou explore o mapa para descobrir suas origens, biomas e os saberes tradicionais por trás de cada item.
        </Text>
      </Animated.View>

      {/* ─── 2. BANNER VISUAL ─── */}
      <Animated.View style={[styles.imageCardContainer, heroStyle]}>
        <Image 
          source={require('../../public/flavosbiobanner.jpeg')} 
          style={styles.bannerImage} 
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Feather name="compass" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.bannerOverlayText}>Da Floresta Viva ao Consumidor Consciente</Text>
        </View>
      </Animated.View>

      {/* ─── 3. EXPERIÊNCIAS PRINCIPAIS (CTA & CARDS) ─── */}
      <Animated.View style={[styles.experiencesSection, actionsStyle]}>
        <SectionTitle 
          title="Descubra a Mostra" 
          subtitle="Escolha como deseja explorar a sociobiodiversidade brasileira" 
        />

        {/* Botão Principal em Destaque: QR Code */}
        <AppButton 
          title="Escanear QR Code do Produto" 
          icon="maximize" 
          onPress={() => navigation.navigate('QRScanner')} 
          style={styles.primaryCta}
        />

        {/* Grid de Ações Secundárias */}
        <View style={styles.gridContainer}>
          <TouchableOpacity 
            style={styles.gridCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Products')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="grid" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.gridCardTitle}>Catálogo de Produtos</Text>
            <Text style={styles.gridCardDesc}>Veja todos os bio-produtos mapeados na mostra.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('BiomeMap')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="map" size={22} color={COLORS.secondary} />
            </View>
            <Text style={styles.gridCardTitle}>Mapa dos Biomas</Text>
            <Text style={styles.gridCardDesc}>Localize comunidades e territórios no mapa interativo.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SuggestProduct')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#EDE9FE' }]}>
              <Feather name="plus-circle" size={22} color="#6D28D9" />
            </View>
            <Text style={styles.gridCardTitle}>Sugerir Produto</Text>
            <Text style={styles.gridCardDesc}>Cadastre um novo item da sua comunidade ou região.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.gridCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TrackSuggestion')}
          >
            <View style={[styles.gridIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Feather name="search" size={22} color="#0284C7" />
            </View>
            <Text style={styles.gridCardTitle}>Acompanhar Status</Text>
            <Text style={styles.gridCardDesc}>Consulte o andamento da sua sugestão enviada.</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ─── 4. SEÇÃO INTEGRADA: SOBRE O PROJETO ─── */}
      <Animated.View style={[styles.aboutSection, aboutStyle]}>
        <View style={styles.aboutHeaderBadge}>
          <Feather name="feather" size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={styles.aboutBadgeText}>SOBRE A INICIATIVA</Text>
        </View>
        
        <SectionTitle 
          title="O que é o Flavos BioMap?" 
          subtitle="Uma ponte digital entre o consumidor e a floresta em pé"
        />

        <Text style={styles.aboutParagraph}>
          O <Text style={styles.bold}>Flavos BioMap</Text> é uma plataforma interativa criada para dar visibilidade aos produtos da sociobiodiversidade brasileira.
        </Text>

        <Text style={styles.aboutParagraph}>
          Nosso objetivo é ir além do consumo comum: queremos conectar cada item exposto na mostra cultural à sua origem social, cultural e biológica, revelando as histórias, as mãos de quem produz e os territórios de onde eles nascem.
        </Text>

        {/* Box de Citação / Manifesto */}
        <View style={styles.manifestoCard}>
          <Feather name="bookmark" size={20} color={COLORS.secondary} style={{ marginBottom: 8 }} />
          <Text style={styles.manifestoQuote}>
            “Viver e conviver com a sociobiodiversidade como caminho para o futuro.”
          </Text>
        </View>

        {/* 3 Pilares do Projeto */}
        <View style={styles.pillarsContainer}>
          <View style={styles.pillarItem}>
            <View style={styles.pillarIconBox}>
              <Feather name="sun" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.pillarTitle}>Produto Natural</Text>
            <Text style={styles.pillarText}>Manejo extrativista e cultivo limpo sem agressão ao solo.</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={styles.pillarIconBox}>
              <Feather name="users" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.pillarTitle}>Comunidade Viva</Text>
            <Text style={styles.pillarText}>Geração de renda e autonomia para famílias tradicionais.</Text>
          </View>

          <View style={styles.pillarItem}>
            <View style={styles.pillarIconBox}>
              <Feather name="shield" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.pillarTitle}>Floresta em Pé</Text>
            <Text style={styles.pillarText}>Preservação ativa dos biomas contra o desmatamento.</Text>
          </View>
        </View>
      </Animated.View>

      {/* ─── 5. SEÇÃO INTEGRADA: SOBRE A FLAVOS COMPANY & REALIZAÇÃO ─── */}
      <Animated.View style={[styles.realizationSection, companyStyle]}>
        <SectionTitle 
          title="Realização" 
          subtitle="Desenvolvido com foco em experiência, design e impacto"
        />

        <Text style={styles.aboutParagraph}>
          O <Text style={styles.bold}>Flavos BioMap</Text> é uma iniciativa concebida e desenvolvida pela <Text style={styles.bold}>Flavos Company</Text>. Somos uma organização focada no desenvolvimento de aplicações digitais modernas, com atenção especial a produto, design e experiência do usuário.
        </Text>

        <Text style={styles.aboutParagraph}>
          Com o compromisso de criar soluções simples, úteis e acessíveis, desenvolvemos este projeto para aproximar os consumidores das histórias e territórios que sustentam a sociobiodiversidade brasileira.
        </Text>

        {/* Botões de Redes e Site Oficial */}
        <View style={styles.companyButtonsRow}>
          <TouchableOpacity 
            style={styles.websiteBtn} 
            activeOpacity={0.8}
            onPress={handleOpenWebsite}
          >
            <Feather name="globe" size={16} color="#FFF" />
            <Text style={styles.companyBtnText}>Visitar Website</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.instagramBtn} 
            activeOpacity={0.8}
            onPress={handleOpenInstagram}
          >
            <Feather name="instagram" size={16} color="#FFF" />
            <Text style={styles.companyBtnText}>@flavoscompany</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.moreDetailsBtn} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('About')}
          >
            <Feather name="info" size={16} color={COLORS.primary} />
            <Text style={styles.moreDetailsBtnText}>Página Completa /about</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ─── 6. FOOTER ─── */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>Flavos BioMap • Mostra Cultural</Text>
        <Text style={styles.footerCopy}>© {new Date().getFullYear()} Flavos Company. Todos os direitos reservados.</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    paddingTop: 48,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: SPACING.lg,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  logoBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logoBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF6E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagBadgeText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 22,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 23,
  },
  imageCardContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    position: 'relative',
    ...SHADOWS.medium,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(30, 86, 49, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerOverlayText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  experiencesSection: {
    marginBottom: SPACING.xxl,
  },
  primaryCta: {
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  gridIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  gridCardDesc: {
    fontSize: 12,
    color: COLORS.lightText,
    lineHeight: 17,
  },
  aboutSection: {
    backgroundColor: '#F7F6F2',
    borderRadius: 24,
    padding: 24,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#EAE6DD',
    ...SHADOWS.small,
  },
  aboutHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  aboutBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  aboutParagraph: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 14,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  manifestoCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    marginVertical: 14,
    ...SHADOWS.small,
  },
  manifestoQuote: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 23,
    fontStyle: 'italic',
  },
  pillarsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  pillarItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EBE1',
  },
  pillarIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  pillarText: {
    fontSize: 12,
    color: COLORS.lightText,
    lineHeight: 18,
  },
  realizationSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.small,
  },
  companyButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  websiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    ...SHADOWS.small,
  },
  instagramBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1306C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    ...SHADOWS.small,
  },
  moreDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  companyBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  moreDetailsBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 24,
    alignItems: 'center',
  },
  footerBrand: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  footerCopy: {
    fontSize: 11,
    color: COLORS.lightText,
    textAlign: 'center',
  },
});
