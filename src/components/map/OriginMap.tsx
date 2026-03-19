import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface Props {
  latitude: number;
  longitude: number;
}

export const OriginMap = ({ latitude, longitude }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.webFallbackText}>
        🌍 Mapa de Origem ({latitude.toFixed(2)}, {longitude.toFixed(2)})
      </Text>
      <Text style={styles.webFallbackSubtext}>
        (A visualização do mapa interativo requer o aplicativo móvel nativo ou configuração avançada do Google Maps Web)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  webFallbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 8,
  },
  webFallbackSubtext: {
    fontSize: 14,
    color: '#388E3C',
    textAlign: 'center',
  }
});
