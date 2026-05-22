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
      QRScanner: 'scan',
      Products: 'products',
      ProductDetails: 'product/:productSlug',
      Community: 'community/:communityId',
      About: 'about',
      BiomeMap: 'biomap',
      Home: '*', // Fallback wildcard redirects unmatched paths to Home
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
