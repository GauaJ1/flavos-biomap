import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QRScanner } from '../components/qr/QRScanner';

export const QRScannerScreen = () => {
  return (
    <View style={styles.container}>
      <QRScanner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  }
});

