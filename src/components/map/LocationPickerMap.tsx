import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/colors';

interface Props {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

/**
 * Mapa interativo clicável para selecionar coordenadas.
 * Versão nativa: fallback com texto e coordenadas (mapa nativo exigiria config extra).
 */
export const LocationPickerMap = ({ latitude, longitude, onChange }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>📍 Localização no Mapa</Text>
      <View style={styles.mapFallback}>
        <Text style={styles.fallbackEmoji}>🗺️</Text>
        {latitude && longitude ? (
          <Text style={styles.coordsText}>
            Coordenadas: {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </Text>
        ) : (
          <Text style={styles.fallbackText}>
            O mapa interativo está disponível na versão web.{'\n'}
            As coordenadas serão definidas pelo administrador na aprovação.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  mapFallback: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2DBCF',
    backgroundColor: '#F5F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    ...SHADOWS.small,
  },
  fallbackEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 13,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 18,
  },
  coordsText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
