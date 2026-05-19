import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './RootStack';

const linking = {
  prefixes: [
    'flavosbiomap://',
    'http://localhost:19006',
    'https://*.vercel.app',
    'https://biomap.flavoscompany.xyz'
  ],
  config: {
    screens: {
      Home: '',
      QRScanner: 'scan',
      Products: 'products',
      ProductDetails: 'product/:productSlug',
      Community: 'community/:communityId',
      About: 'about',
    },
  },
};

export const AppNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <RootStack />
    </NavigationContainer>
  );
};
