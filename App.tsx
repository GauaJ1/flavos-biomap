import 'react-native-gesture-handler'; // MUST be first import
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { View, StyleSheet, Platform } from 'react-native';

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <SafeAreaProvider>
        <View style={styles.webContainer}>
          <View style={styles.webAppFrame}>
            <AppNavigator />
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#2C4C3B', // Brand Forest Green
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: Platform.OS === 'web' ? '100vh' as any : '100%',
  },
  webAppFrame: {
    width: '100%',
    maxWidth: 500,
    height: '100%',
    backgroundColor: '#FFFFFF',
    // Elegant border & shadow mock for the device view on desktop
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
    // Add thin border to separate from dark green background
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  }
});
