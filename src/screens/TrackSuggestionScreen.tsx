import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/colors';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { SuggestionsAPI } from '../api/suggestions';
import type { SuggestionStatus } from '../api/suggestions';

const STATUS_CONFIG = {
  pending: {
    emoji: '⏳',
    label: 'Aguardando Revisão',
    color: '#D97706',
    bgColor: '#FFFBEB',
    message: 'Sua sugestão está na fila de moderação. A equipe curadora irá analisá-la em breve.',
  },
  approved: {
    emoji: '✅',
    label: 'Aprovada!',
    color: '#059669',
    bgColor: '#ECFDF5',
    message: 'Parabéns! Sua sugestão foi aprovada e já faz parte do catálogo oficial do Flavos BioMap!',
  },
  rejected: {
    emoji: '❌',
    label: 'Não Aprovada',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    message: 'Infelizmente sua sugestão não foi aprovada neste momento.',
  },
} as const;

export const TrackSuggestionScreen = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestionStatus | null>(null);
  const [error, setError] = useState('');

  const handleSearch = useCallback(async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    const response = await SuggestionsAPI.checkStatus(code);
    setLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'Erro ao consultar. Tente novamente.');
    }
  }, [code]);

  const formatCode = (text: string) => {
    const upper = text.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(upper);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const statusInfo = result ? STATUS_CONFIG[result.status] : null;

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACOMPANHAMENTO</Text>
        </View>
        <Text style={styles.title}>Consultar Sugestão</Text>
        <Text style={styles.subtitle}>
          Digite o código de acompanhamento que você recebeu ao enviar sua sugestão de produto.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchCard}>
        <Text style={styles.label}>Código de Acompanhamento</Text>
        <TextInput
          style={styles.codeInput}
          placeholder="BM-XXXXXX"
          placeholderTextColor={COLORS.lightText}
          value={code}
          onChangeText={formatCode}
          maxLength={9}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <AppButton
          title="Consultar Status"
          icon="search"
          onPress={handleSearch}
          loading={loading}
          disabled={loading || code.length < 9}
          style={{ marginTop: 16 }}
        />
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      {/* Result */}
      {result && statusInfo ? (
        <View style={[styles.resultCard, { borderColor: statusInfo.color }]}>
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <Text style={styles.statusEmoji}>{statusInfo.emoji}</Text>
            <Text style={[styles.statusLabel, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>

          {/* Product Name */}
          <Text style={styles.productName}>{result.name}</Text>

          {/* Status Message */}
          <Text style={styles.statusMessage}>{statusInfo.message}</Text>

          {/* Rejection Reason */}
          {result.status === 'rejected' && result.rejection_reason ? (
            <View style={styles.rejectionBox}>
              <Text style={styles.rejectionLabel}>Motivo:</Text>
              <Text style={styles.rejectionText}>{result.rejection_reason}</Text>
            </View>
          ) : null}

          {/* Dates */}
          <View style={styles.datesBox}>
            <View style={styles.dateRow}>
              <Text style={styles.dateLabel}>Enviada em:</Text>
              <Text style={styles.dateValue}>{formatDate(result.created_at)}</Text>
            </View>
            {result.reviewed_at ? (
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Revisada em:</Text>
                <Text style={styles.dateValue}>{formatDate(result.reviewed_at)}</Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  badge: {
    backgroundColor: '#EDE9FE',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  codeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 3,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  errorBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 2,
    ...SHADOWS.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  statusEmoji: {
    fontSize: 18,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  productName: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 14,
    color: COLORS.lightText,
    lineHeight: 20,
    marginBottom: 16,
  },
  rejectionBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  rejectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: '#991B1B',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  datesBox: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    gap: 6,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.lightText,
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
});
