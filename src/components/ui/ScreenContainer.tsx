import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, ViewStyle, View, StatusBar } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  bgWhite?: boolean;
}

export const ScreenContainer = ({ 
  children, 
  scroll = true, 
  style, 
  contentContainerStyle,
  bgWhite = false 
}: Props) => {
  const bgColor = bgWhite ? COLORS.surface : COLORS.background;

  const content = scroll ? (
    <ScrollView 
      style={styles.flex} 
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor={bgColor} />
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  }
});
