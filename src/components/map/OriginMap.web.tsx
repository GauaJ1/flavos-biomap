import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  latitude: number;
  longitude: number;
}

export const OriginMap = ({ latitude, longitude }: Props) => {
  return (
    <View style={styles.container}>
      {/* 
        No React Native Web, podemos usar tags HTML padrões diretamente.
        Aqui estamos invocando o serviço público (sem chave) do Google Maps embutido.
      */}
      <iframe 
        title="Google Maps Embed"
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        loading="lazy" 
        src={`https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EBE6DF',
  }
});
