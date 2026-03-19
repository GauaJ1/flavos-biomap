import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface Props {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  text: string;
  variant?: 'green' | 'earth' | 'yellow';
}

export const InfoBadge = ({ icon, title, text, variant = 'green' }: Props) => {
  
  const getTheme = () => {
    switch(variant) {
      case 'earth':
        return { bg: 'rgba(235, 230, 223, 0.6)', border: 'rgba(139, 115, 85, 0.15)', icon: COLORS.secondary, text: COLORS.secondary };
      case 'yellow':
        return { bg: 'rgba(255, 248, 225, 0.6)', border: 'rgba(184, 134, 11, 0.15)', icon: COLORS.accent, text: '#B8860B' };
      default:
        return { bg: 'rgba(232, 245, 233, 0.6)', border: 'rgba(44, 76, 59, 0.15)', icon: COLORS.primary, text: COLORS.primary };
    }
  };

  const theme = getTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Feather name={icon} size={18} color={theme.icon} />
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  text: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
  }
});

