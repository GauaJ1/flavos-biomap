import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  title: string;
  subtitle?: string;
  marginTop?: number;
}

export const SectionTitle = ({ title, subtitle, marginTop = 0 }: Props) => {
  return (
    <View style={[styles.container, { marginTop }]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  }
});
