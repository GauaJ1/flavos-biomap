import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootStack } from './RootStack';

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};
