import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform, Share, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/colors';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { AppButton } from '../components/ui/AppButton';
import { LocationPickerMap } from '../components/map/LocationPickerMap';
import { SuggestionsAPI, generateCaptcha, ALLOWED_BIOMES, ALLOWED_REGIONS } from '../api/suggestions';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const COMMUNITY_TAGS_OPTIONS = [
  'Guardiões do Território',
  'Extração Sustentável',
  'Ancestralidade',
  'Área Protegida',
  'Manejo Comunitário',
  'Certificação Orgânica',
  'Comércio Justo',
  'Quilombola',
  'Indígena',
  'Ribeirinha',
];

export const SuggestProductScreen = () => {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  // Form fields — Produto
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [biome, setBiome] = useState('');
  const [state, setState] = useState('');
  const [region, setRegion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [sustainableImportance, setSustainableImportance] = useState('');
  const [traditionalKnowledge, setTraditionalKnowledge] = useState('');
  const [curiosityClue, setCuriosityClue] = useState('');

  // Form fields — Comunidade
  const [communityName, setCommunityName] = useState('');
  const [communityLocation, setCommunityLocation] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [communityTags, setCommunityTags] = useState<string[]>([]);

  // Form fields — Sobre Você
  const [submitterName, setSubmitterName] = useState('');
  const [submitterContact, setSubmitterContact] = useState('');

  // CAPTCHA
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // Honeypot (campo invisível — bots preenchem, humanos não)
  const [honeypot, setHoneypot] = useState('');

  // Timing check
  const formRenderedAt = useRef(Date.now());

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaAnswer('');
  };

  const toggleTag = (tag: string) => {
    setCommunityTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !biome.trim() || !state.trim() || !region.trim() || !submitterName.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o nome do produto, bioma, estado, região e seu nome.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Campos obrigatórios', 'A descrição geral do produto é obrigatória.');
      return;
    }

    const elapsed = Date.now() - formRenderedAt.current;
    if (elapsed < 3000) {
      Alert.alert('Erro', 'Envio muito rápido. Aguarde um momento e tente novamente.');
      return;
    }

    const answer = parseInt(captchaAnswer, 10);
    if (isNaN(answer)) {
      Alert.alert('Verificação', 'Por favor, responda a pergunta de segurança.');
      return;
    }

    setLoading(true);
    const result = await SuggestionsAPI.submitSuggestion(
      {
        name: name.trim(),
        description: description.trim(),
        biome,
        state: state.trim(),
        region,
        image_url: imageUrl.trim() || undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        community_name: communityName.trim() || undefined,
        community_location: communityLocation.trim() || undefined,
        community_description: communityDescription.trim() || undefined,
        community_tags: communityTags.length > 0 ? communityTags : undefined,
        sustainable_importance: sustainableImportance.trim() || undefined,
        traditional_knowledge: traditionalKnowledge.trim() || undefined,
        curiosity_clue: curiosityClue.trim() || undefined,
        submitter_name: submitterName.trim(),
        submitter_contact: submitterContact.trim() || undefined,
      },
      { num1: captcha.num1, num2: captcha.num2, answer },
      honeypot,
    );
    setLoading(false);

    if (result.success && result.tracking_code) {
      setTrackingCode(result.tracking_code);
      setSubmitted(true);
    } else {
      if (result.error?.includes('verificação')) refreshCaptcha();
      Alert.alert('Erro', result.error || 'Não foi possível enviar a sugestão. Tente novamente.');
    }
  }, [name, description, biome, state, region, imageUrl, latitude, longitude, communityName, communityLocation, communityDescription, communityTags, sustainableImportance, traditionalKnowledge, curiosityClue, submitterName, submitterContact, captcha, captchaAnswer, honeypot]);

  const handleShareCode = () => {
    Share.share({ message: `Meu código de acompanhamento Flavos BioMap: ${trackingCode}` });
  };

  // ─── SUCCESS SCREEN ───────────────────────────────────────────
  if (submitted) {
    return (
      <ScreenContainer contentContainerStyle={styles.successContainer}>
        <View style={styles.successCard}>
          <Text style={styles.successEmoji}>🌿</Text>
          <Text style={styles.successTitle}>Sugestão Enviada!</Text>
          <Text style={styles.successMessage}>
            Sua contribuição foi recebida e será analisada pela equipe curadora do Flavos BioMap.
          </Text>
          <View style={styles.trackingBox}>
            <Text style={styles.trackingLabel}>SEU CÓDIGO DE ACOMPANHAMENTO</Text>
            <Text style={styles.trackingCode} selectable>{trackingCode}</Text>
            <Text style={styles.trackingHint}>
              📝 Anote ou compartilhe este código!{'\n'}
              Use-o em "Acompanhar Sugestão" para ver o status.
            </Text>
          </View>
          <AppButton title="Compartilhar Código" icon="share-2" type="outline" onPress={handleShareCode} style={{ marginTop: 16 }} />
          <AppButton title="Acompanhar Sugestão" icon="search" type="secondary" onPress={() => navigation.replace('TrackSuggestion')} style={{ marginTop: 12 }} />
          <AppButton title="Voltar ao Início" icon="home" onPress={() => navigation.navigate('Home')} style={{ marginTop: 12 }} />
        </View>
      </ScreenContainer>
    );
  }

  // ─── FORM SCREEN ──────────────────────────────────────────────
  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CIÊNCIA CIDADÃ</Text>
          </View>
          <Text style={styles.title}>Sugerir um Produto</Text>
          <Text style={styles.subtitle}>
            Conhece um produto da sociobiodiversidade da sua região? Conte para nós! Sua sugestão será analisada pela equipe curadora.
          </Text>
        </View>

        {/* ═══ SEÇÃO 1: IDENTIFICAÇÃO DO PRODUTO ═══ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>🌿 Identificação do Produto</Text>

          <Text style={styles.label}>Nome do Produto *</Text>
          <TextInput style={styles.input} placeholder="Ex: Mel de Jataí, Óleo de Licuri, Farinha de Baru..." placeholderTextColor={COLORS.lightText} value={name} onChangeText={setName} maxLength={100} />

          <Text style={styles.label}>URL da Imagem do Produto</Text>
          <Text style={styles.hint}>Se tiver um link para foto do produto, cole aqui.</Text>
          <TextInput style={styles.input} placeholder="https://exemplo.com/foto-do-produto.jpg" placeholderTextColor={COLORS.lightText} value={imageUrl} onChangeText={setImageUrl} maxLength={500} keyboardType="url" autoCapitalize="none" />
        </View>

        {/* ═══ SEÇÃO 2: LOCALIZAÇÃO ═══ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>📍 Localização</Text>

          <Text style={styles.label}>Bioma *</Text>
          <View style={styles.chipGroup}>
            {ALLOWED_BIOMES.map((b) => (
              <TouchableOpacity key={b} style={[styles.chip, biome === b && styles.chipActive]} onPress={() => setBiome(b)} activeOpacity={0.7}>
                <Text style={[styles.chipText, biome === b && styles.chipTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Estado da Federação *</Text>
          <TextInput style={styles.input} placeholder="Ex: Maranhão, Bahia, Pará..." placeholderTextColor={COLORS.lightText} value={state} onChangeText={setState} maxLength={50} />

          <Text style={styles.label}>Região *</Text>
          <View style={styles.chipGroup}>
            {ALLOWED_REGIONS.map((r) => (
              <TouchableOpacity key={r} style={[styles.chip, region === r && styles.chipActive]} onPress={() => setRegion(r)} activeOpacity={0.7}>
                <Text style={[styles.chipText, region === r && styles.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <LocationPickerMap
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </View>

        {/* ═══ SEÇÃO 3: COMUNIDADE PRODUTORA ═══ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>🏘️ Comunidade Produtora</Text>
          <Text style={styles.sectionHint}>Se souber, conte sobre quem produz esse produto.</Text>

          <Text style={styles.label}>Nome da Comunidade</Text>
          <TextInput style={styles.input} placeholder="Ex: Comunidade Quilombola do Rio Preto, Reserva Extrativista..." placeholderTextColor={COLORS.lightText} value={communityName} onChangeText={setCommunityName} maxLength={100} />

          <Text style={styles.label}>Local da Comunidade (Região/Estado)</Text>
          <TextInput style={styles.input} placeholder="Ex: Reserva Extrativista Chico Mendes, Acre" placeholderTextColor={COLORS.lightText} value={communityLocation} onChangeText={setCommunityLocation} maxLength={200} />

          <Text style={styles.label}>Descrição e História</Text>
          <Text style={styles.hint}>Conte sobre a origem e as tradições dessa comunidade.</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva a comunidade, suas tradições, como vivem e se organizam..." placeholderTextColor={COLORS.lightText} value={communityDescription} onChangeText={setCommunityDescription} multiline numberOfLines={4} textAlignVertical="top" maxLength={500} />
          <Text style={styles.charCount}>{communityDescription.length}/500</Text>

          <Text style={styles.label}>Emblemas (Selos da Comunidade)</Text>
          <Text style={styles.hint}>Selecione os que se aplicam a essa comunidade.</Text>
          <View style={styles.chipGroup}>
            {COMMUNITY_TAGS_OPTIONS.map((tag) => (
              <TouchableOpacity key={tag} style={[styles.chip, communityTags.includes(tag) && styles.chipActiveGold]} onPress={() => toggleTag(tag)} activeOpacity={0.7}>
                <Text style={[styles.chipText, communityTags.includes(tag) && styles.chipTextActiveGold]}>
                  {communityTags.includes(tag) ? '✓ ' : '+ '}{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══ SEÇÃO 4: DETALHES DO PRODUTO ═══ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>📋 Detalhes do Produto</Text>

          <Text style={styles.label}>Descrição Geral *</Text>
          <Text style={styles.hint}>Conte o que é esse produto, como é usado e por que é importante.</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva o produto: o que é, para que serve, como é encontrado na natureza..." placeholderTextColor={COLORS.lightText} value={description} onChangeText={setDescription} multiline numberOfLines={5} textAlignVertical="top" maxLength={1000} />
          <Text style={styles.charCount}>{description.length}/1000</Text>

          <Text style={styles.label}>Importância Sustentável (Para a floresta)</Text>
          <Text style={styles.hint}>Como a produção desse produto ajuda a preservar o bioma?</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ex: A coleta do fruto incentiva a manutenção da floresta em pé..." placeholderTextColor={COLORS.lightText} value={sustainableImportance} onChangeText={setSustainableImportance} multiline numberOfLines={4} textAlignVertical="top" maxLength={500} />
          <Text style={styles.charCount}>{sustainableImportance.length}/500</Text>

          <Text style={styles.label}>Saber Tradicional (Como é feito)</Text>
          <Text style={styles.hint}>Descreva o processo artesanal ou tradicional de produção.</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Ex: O óleo é extraído das sementes por prensagem manual, um conhecimento passado de geração em geração..." placeholderTextColor={COLORS.lightText} value={traditionalKnowledge} onChangeText={setTraditionalKnowledge} multiline numberOfLines={4} textAlignVertical="top" maxLength={500} />
          <Text style={styles.charCount}>{traditionalKnowledge.length}/500</Text>

          <Text style={styles.label}>Pista de Curiosidade</Text>
          <Text style={styles.hint}>Uma curiosidade interessante sobre o produto.</Text>
          <TextInput style={[styles.input, styles.textAreaSmall]} placeholder="Ex: Este fruto é colhido por comunidades locais utilizando conchas ou madeira nativa..." placeholderTextColor={COLORS.lightText} value={curiosityClue} onChangeText={setCuriosityClue} multiline numberOfLines={3} textAlignVertical="top" maxLength={300} />
          <Text style={styles.charCount}>{curiosityClue.length}/300</Text>
        </View>

        {/* ═══ SEÇÃO 5: SOBRE VOCÊ ═══ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>👤 Sobre Você</Text>

          <Text style={styles.label}>Seu Nome *</Text>
          <TextInput style={styles.input} placeholder="Como devemos te chamar?" placeholderTextColor={COLORS.lightText} value={submitterName} onChangeText={setSubmitterName} maxLength={60} />

          <Text style={styles.label}>Contato (opcional)</Text>
          <Text style={styles.hint}>Não será exibido publicamente. Apenas para a equipe curadora.</Text>
          <TextInput style={styles.input} placeholder="E-mail ou telefone" placeholderTextColor={COLORS.lightText} value={submitterContact} onChangeText={setSubmitterContact} keyboardType="email-address" maxLength={100} />
        </View>

        {/* ═══ SEÇÃO 6: VERIFICAÇÃO ═══ */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>🔒 Verificação de Segurança</Text>
          <View style={styles.captchaBox}>
            <Text style={styles.captchaQuestion}>Quanto é {captcha.num1} + {captcha.num2}? 🧮</Text>
            <View style={styles.captchaRow}>
              <TextInput style={styles.captchaInput} placeholder="?" placeholderTextColor={COLORS.lightText} value={captchaAnswer} onChangeText={setCaptchaAnswer} keyboardType="number-pad" maxLength={3} />
              <TouchableOpacity onPress={refreshCaptcha}>
                <Text style={styles.captchaRefresh}>🔄 Nova pergunta</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Honeypot (invisível) */}
          <View style={styles.honeypot} pointerEvents="none" accessible={false}>
            <TextInput style={styles.honeypotInput} value={honeypot} onChangeText={setHoneypot} tabIndex={-1} autoComplete="off" />
          </View>
        </View>

        {/* Submit */}
        <AppButton title="Enviar Sugestão" icon="send" onPress={handleSubmit} loading={loading} disabled={loading} style={{ marginTop: 8, marginBottom: 16 }} />

        <Text style={styles.disclaimer}>
          Ao enviar, você concorda que as informações poderão ser editadas e publicadas pela equipe curadora do Flavos BioMap.
        </Text>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { padding: SPACING.lg },
  header: { marginBottom: SPACING.lg },
  badge: {
    backgroundColor: '#E8F5E9', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 12,
  },
  badgeText: { color: COLORS.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.lightText, lineHeight: 20 },
  formCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg,
    marginBottom: 16, ...SHADOWS.medium,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: '800', color: COLORS.primary,
    letterSpacing: 0.5, marginBottom: 4,
    borderBottomWidth: 1, borderBottomColor: '#E8F5E9', paddingBottom: 8,
  },
  sectionHint: { fontSize: 12, color: COLORS.lightText, marginBottom: 12, lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 14 },
  hint: { fontSize: 12, color: COLORS.lightText, marginBottom: 6, lineHeight: 16, fontStyle: 'italic' },
  charCount: { fontSize: 11, color: COLORS.lightText, textAlign: 'right', marginTop: 4 },
  input: {
    backgroundColor: COLORS.background, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: COLORS.text,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  textAreaSmall: { minHeight: 76, textAlignVertical: 'top' },
  // ─── Chips (usando TouchableOpacity) ──────
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: '#E8F5E9', borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.text },
  chipTextActive: { color: COLORS.primary, fontWeight: '700' },
  // Gold variant for community tags
  chipActiveGold: { backgroundColor: '#FFF8E1', borderColor: '#D4A017' },
  chipTextActiveGold: { color: '#8B6914', fontWeight: '700' },
  // ─── CAPTCHA ──────
  captchaBox: {
    backgroundColor: '#F0FFF4', borderRadius: 12, padding: 16, marginTop: 8,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  captchaQuestion: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  captchaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  captchaInput: {
    backgroundColor: COLORS.surface, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 20, fontWeight: '800', color: COLORS.primary,
    textAlign: 'center', width: 80, borderWidth: 2, borderColor: COLORS.primary,
  },
  captchaRefresh: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  // ─── Honeypot ──────
  honeypot: { position: 'absolute', left: -9999, top: -9999, width: 1, height: 1, opacity: 0, overflow: 'hidden' },
  honeypotInput: { width: 1, height: 1 },
  disclaimer: { fontSize: 11, color: COLORS.lightText, textAlign: 'center', marginTop: 8, marginBottom: 40, lineHeight: 16 },
  // ─── Success ──────
  successContainer: { padding: SPACING.lg },
  successCard: {
    backgroundColor: COLORS.surface, borderRadius: 20, padding: 32,
    alignItems: 'center', width: '100%', ...SHADOWS.large,
  },
  successEmoji: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginBottom: 12 },
  successMessage: { fontSize: 14, color: COLORS.text, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  trackingBox: {
    backgroundColor: '#F0FFF4', borderRadius: 12, padding: 20,
    alignItems: 'center', width: '100%', borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed',
  },
  trackingLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: COLORS.lightText, marginBottom: 8 },
  trackingCode: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: 3, marginBottom: 8 },
  trackingHint: { fontSize: 12, color: COLORS.lightText, textAlign: 'center', lineHeight: 18 },
});
