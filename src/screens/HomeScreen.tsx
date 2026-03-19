import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring, withDelay, Easing } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING } from '../constants/colors';
import { AppButton } from '../components/ui/AppButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useInitialAnimation } from '../hooks/useAnimation';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  const section1 = useInitialAnimation(100);
  const section2 = useInitialAnimation(300);

  const heroStyle = useAnimatedStyle(() => ({
    opacity: section1.opacity.value,
    transform: [{ translateY: section1.translateY.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: section2.opacity.value,
    transform: [{ translateY: section2.translateY.value }],
  }));

  return (
    <ScreenContainer scroll={false} contentContainerStyle={styles.container}>
      <Animated.View style={[styles.topSection, heroStyle]}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>MOSTRA CULTURAL</Text>
        </View>
        <Text style={styles.title}>Flavos BioMap</Text>
        <Text style={styles.subtitle}>O rastro da floresta</Text>
        <Text style={styles.body}>
          Conecte-se com a origem social, cultural e biológica dos produtos da sociobiodiversidade brasileira. Escaneie, explore e preserve.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.actions, actionsStyle]}>
        <AppButton 
          title="Escanear Produto" 
          icon="maximize" 
          onPress={() => navigation.navigate('QRScanner')} 
          style={styles.scanButton}
        />
        <AppButton 
          title="Explorar Catálogo" 
          icon="grid" 
          type="outline" 
          onPress={() => navigation.navigate('Products')} 
        />
        <AppButton 
          title="Sobre o Projeto" 
          icon="info" 
          type="outline" 
          style={styles.aboutButton}
          onPress={() => navigation.navigate('About')} 
        />
      </Animated.View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  topSection: {
    marginTop: 60,
  },
  logoBadge: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  logoBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 22,
    color: COLORS.secondary,
    fontWeight: '600',
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  actions: {
    paddingBottom: 40,
  },
  scanButton: {
    marginBottom: 16,
  },
  aboutButton: {
    marginTop: 16,
    borderWidth: 0,
  }
});
