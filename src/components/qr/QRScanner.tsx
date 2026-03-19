import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { COLORS, SHADOWS, SPACING } from '../../constants/colors';
import { AppButton } from '../ui/AppButton';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'QRScanner'>;

export const QRScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(Platform.OS === 'web');
  const navigation = useNavigation<NavigationProp>();

  // Animations
  const contentTranslate = useSharedValue(50);
  const contentOpacity = useSharedValue(0);

  useFocusEffect(
    React.useCallback(() => {
      contentTranslate.value = withSpring(0, { damping: 15 });
      contentOpacity.value = withSpring(1);
    }, [])
  );

  const animStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslate.value }]
  }));

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    let productSlug = data;
    if (data.includes('product/')) {
      productSlug = data.split('product/')[1];
    }
    navigation.replace('ProductDetails', { productSlug });
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      handleBarCodeScanned({ data: manualCode.trim() });
    }
  };

  if (Platform.OS !== 'web' && !permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Verificando permissão da câmera...</Text>
      </View>
    );
  }

  if (Platform.OS !== 'web' && !permission?.granted) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.iconCircle}>
          <Feather name="camera-off" size={48} color={COLORS.secondary} />
        </View>
        <Text style={styles.title}>Câmera Bloqueada</Text>
        <Text style={styles.text}>Precisamos de acesso à câmera para ler a origem biológica dos produtos.</Text>
        <AppButton title="Liberar Câmera" onPress={requestPermission} style={{ marginBottom: 16, width: '100%' }} />
        <AppButton title="Digitar Código" type="outline" icon="edit-2" onPress={() => setShowManual(true)} style={{ width: '100%' }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {!showManual && Platform.OS !== 'web' ? (
        <>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
          <View style={styles.overlay}>
            <View style={styles.overlayHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                <Feather name="chevron-left" size={28} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.overlayTitle}>Escanear Origem</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.viewfinderArea}>
              <View style={styles.scanArea}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
                {scanned && (
                  <View style={styles.scannedSuccess}>
                     <Feather name="check" size={40} color="#FFF" />
                  </View>
                )}
              </View>
              <Text style={styles.overlayHint}>Aponte para o QR Code do produto</Text>
            </View>

            <Animated.View style={[styles.bottomControls, animStyle]}>
              {scanned ? (
                <AppButton title="Tentar Novamente" icon="refresh-cw" onPress={() => setScanned(false)} style={styles.actionBtn} />
              ) : (
                <AppButton title="Digitar Código Manualmente" type="secondary" icon="edit-2" onPress={() => setShowManual(true)} style={styles.actionBtn} />
              )}
            </Animated.View>
          </View>
        </>
      ) : (
        <View style={styles.manualContainer}>
          {Platform.OS !== 'web' && (
            <TouchableOpacity onPress={() => setShowManual(false)} style={styles.manualClose}>
              <Feather name="camera" size={20} color={COLORS.primary} />
              <Text style={styles.manualCloseText}>Voltar para câmera</Text>
            </TouchableOpacity>
          )}

          <Animated.View style={[styles.manualBox, animStyle]}>
            <View style={styles.manualHeader}>
              <View style={styles.manualIconBg}>
                <Feather name="hash" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.manualTitle}>Código do Produto</Text>
            </View>
            <Text style={styles.manualDescription}>
              Digite a URL ou o identificador (slug) para acessar as informações do produto.
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="ex: oleo-de-andiroba"
              placeholderTextColor={COLORS.lightText}
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={handleManualSubmit}
            />
            
            <AppButton 
              title="Acessar Produto" 
              icon="arrow-right"
              onPress={handleManualSubmit} 
              style={{ marginTop: 8 }}
            />
          </Animated.View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  viewfinderArea: {
    alignItems: 'center',
  },
  scanArea: {
    width: 280,
    height: 280,
    backgroundColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFF',
    borderRadius: 8,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  scannedSuccess: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  overlayHint: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 32,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bottomControls: {
    paddingHorizontal: 16,
  },
  actionBtn: {
    ...SHADOWS.large,
  },
  manualContainer: {
    flex: 1,
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  manualClose: {
    position: 'absolute',
    top: 60,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    gap: 8,
    zIndex: 10,
  },
  manualCloseText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  manualBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: 32,
    ...SHADOWS.large,
    alignItems: 'center',
  },
  manualHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  manualIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  manualTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  manualDescription: {
    fontSize: 15,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 24,
  },
});
