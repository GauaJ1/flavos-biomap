import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface Props {
  latitude: number;
  longitude: number;
}

export const OriginMap = ({ latitude, longitude }: Props) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 5.0,
          longitudeDelta: 5.0,
        }}
      >
        <Marker 
          coordinate={{ latitude, longitude }}
          title="Comunidade Produtora"
          description="Origem do produto"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
