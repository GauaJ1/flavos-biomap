import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { RootStackParamList } from './types';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.surface,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
        animationTypeForReplace: 'pop',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} options={{ title: 'Escanear Produto', animation: 'slide_from_bottom', headerShown: false }} />
      <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Catálogo' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: '' }} />
      <Stack.Screen name="Community" component={CommunityScreen} options={{ title: '' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre o Projeto' }} />
    </Stack.Navigator>
  );
};
