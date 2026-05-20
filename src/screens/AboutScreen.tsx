import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, SPACING, SHADOWS } from '../constants/colors';
import { SectionTitle } from '../components/ui/SectionTitle';
import { useInitialAnimation } from '../hooks/useAnimation';
import { Feather } from '@expo/vector-icons';

export const AboutScreen = () => {  
  const s1 = useInitialAnimation(100);
  const s2 = useInitialAnimation(200);
  const s3 = useInitialAnimation(300);

  const s1Style = useAnimatedStyle(() => ({ opacity: s1.opacity.value, transform: [{ translateY: s1.translateY.value }] }));
  const s2Style = useAnimatedStyle(() => ({ opacity: s2.opacity.value, transform: [{ translateY: s2.translateY.value }] }));
  const s3Style = useAnimatedStyle(() => ({ opacity: s3.opacity.value, transform: [{ translateY: s3.translateY.value }] }));

  const handleOpenInstagram = () => {
    Linking.openURL('https://instagram.com/flavoscompany');
  };

  const handleOpenWebsite = () => {
    Linking.openURL('https://flavoscompany.xyz');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Animated.View style={[styles.header, s1Style]}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>FLAVOS BIOMAP</Text>
        </View>
        <Text style={styles.title}>O rastro da floresta</Text>
      </Animated.View>

      <Animated.View style={[styles.imageContainer, s1Style]}>
        <Image 
          source={require('../../public/flavosbiobanner.jpeg')} 
          style={styles.image} 
          resizeMode="cover"
        />
      </Animated.View>

      <Animated.View style={[styles.section, s2Style]}>
        <Text style={styles.paragraph}>
          O <Text style={styles.bold}>Flavos BioMap</Text> é uma plataforma interativa criada para dar visibilidade aos produtos da sociobiodiversidade brasileira. 
        </Text>
        
        <Text style={styles.paragraph}>
          Nosso objetivo é ir além do consumo: queremos conectar cada item exposto na mostra cultural à sua origem social, cultural e biológica, revelando as histórias, as mãos e os territórios de onde eles nascem.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.highlightBox, s2Style]}>
        <Text style={styles.highlightTitle}>Viver e conviver com a sociobiodiversidade como caminho para o futuro.</Text>
      </Animated.View>

      <Animated.View style={[styles.section, s3Style]}>
        <SectionTitle title="Nossa Proposta" />
        <Text style={styles.paragraph}>
          Ao valorizar os saberes tradicionais e as comunidades extrativistas, o app incentiva uma mudança de perspectiva. Queremos que você compreenda o papel vital que esses guardiões desempenham na manutenção da floresta em pé e na regeneração dos biomas (Amazônia, Cerrado, Caatinga, entre outros).
        </Text>
        <Text style={styles.paragraph}>
          Use o leitor de QR Code nos produtos físicos da mostra para desvendar seus segredos, conhecer suas origens no mapa e participar do nosso Mural de Saberes.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.section, s3Style]}>
        <SectionTitle title="Realização" />
        <Text style={styles.paragraph}>
          O <Text style={styles.bold}>Flavos BioMap</Text> é uma iniciativa concebida e desenvolvida pela <Text style={styles.bold}>Flavos Company</Text>. Somos uma organização focada no desenvolvimento de aplicações digitais modernas, com atenção especial a produto, design e experiência do usuário.
        </Text>
        <Text style={styles.paragraph}>
          Com o compromisso de criar soluções simples, úteis e acessíveis, desenvolvemos este projeto para conectar os consumidores às histórias, territórios e comunidades que dão vida à sociobiodiversidade brasileira.
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.websiteButton} onPress={handleOpenWebsite}>
            <Feather name="globe" size={16} color="#FFF" />
            <Text style={styles.buttonText}>Visitar Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.instagramButton} onPress={handleOpenInstagram}>
            <Feather name="instagram" size={16} color="#FFF" />
            <Text style={styles.buttonText}>Siga @flavoscompany</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  logoBadge: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  logoBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  imageContainer: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: 16,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  italicText: {
    fontStyle: 'italic',
    color: COLORS.primary,
    fontWeight: '600',
  },
  highlightBox: {
    backgroundColor: '#F4F1EA',
    padding: 24,
    borderRadius: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    marginBottom: SPACING.xl,
    ...SHADOWS.small,
  },
  highlightTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 28,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    gap: 6,
    ...SHADOWS.small,
  },
  instagramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1306C',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    gap: 6,
    ...SHADOWS.small,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  }
});
