import { supabase } from './supabase';

// ─── Constantes ─────────────────────────────────────────────────
export const ALLOWED_BIOMES = ['Amazônia', 'Cerrado', 'Caatinga', 'Mata Atlântica', 'Pantanal', 'Pampa'];
export const ALLOWED_REGIONS = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

// Intervalo mínimo entre envios (client-side extra layer): 15 segundos
const SUBMIT_COOLDOWN_MS = 15_000;
let lastSubmitTimestamp = 0;

// ─── Tipos ──────────────────────────────────────────────────────
export interface SuggestionPayload {
  name: string;
  description?: string;
  biome: string;
  state: string;
  region: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  community_name?: string;
  community_location?: string;
  community_description?: string;
  community_tags?: string[];
  sustainable_importance?: string;
  traditional_knowledge?: string;
  curiosity_clue?: string;
  submitter_name: string;
  submitter_contact?: string;
}

export interface CaptchaChallenge {
  num1: number;
  num2: number;
}

export interface SuggestionStatus {
  tracking_code: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────

/** Remove tags HTML/script perigosas (sanitização client-side extra) */
function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/** Gera um desafio CAPTCHA matemático */
export function generateCaptcha(): CaptchaChallenge {
  return {
    num1: Math.floor(Math.random() * 15) + 1,
    num2: Math.floor(Math.random() * 15) + 1,
  };
}

// ─── API (usa RPC server-side) ──────────────────────────────────
export const SuggestionsAPI = {

  /**
   * Envia sugestão via RPC server-side.
   * O servidor faz: rate limiting, CAPTCHA check, honeypot, validação, sanitização.
   */
  async submitSuggestion(
    payload: SuggestionPayload,
    captcha: { num1: number; num2: number; answer: number },
    honeypot: string = '',
  ): Promise<{ success: boolean; tracking_code?: string; error?: string }> {

    // Client-side cooldown (camada extra, não é a proteção principal)
    const now = Date.now();
    if (now - lastSubmitTimestamp < SUBMIT_COOLDOWN_MS) {
      const remaining = Math.ceil((SUBMIT_COOLDOWN_MS - (now - lastSubmitTimestamp)) / 1000);
      return { success: false, error: `Aguarde ${remaining} segundos antes de enviar outra sugestão.` };
    }

    // Sanitização client-side (camada extra, servidor re-valida tudo)
    const sanitized = {
      p_name: sanitizeText(payload.name),
      p_description: payload.description ? sanitizeText(payload.description) : null,
      p_biome: payload.biome,
      p_state: sanitizeText(payload.state),
      p_region: payload.region,
      p_latitude: payload.latitude ?? null,
      p_longitude: payload.longitude ?? null,
      p_image_url: payload.image_url ? sanitizeText(payload.image_url) : null,
      p_community_name: payload.community_name ? sanitizeText(payload.community_name) : null,
      p_community_location: payload.community_location ? sanitizeText(payload.community_location) : null,
      p_community_description: payload.community_description ? sanitizeText(payload.community_description) : null,
      p_community_tags: payload.community_tags && payload.community_tags.length > 0 ? payload.community_tags : null,
      p_sustainable_importance: payload.sustainable_importance ? sanitizeText(payload.sustainable_importance) : null,
      p_traditional_knowledge: payload.traditional_knowledge ? sanitizeText(payload.traditional_knowledge) : null,
      p_curiosity_clue: payload.curiosity_clue ? sanitizeText(payload.curiosity_clue) : null,
      p_submitter_name: sanitizeText(payload.submitter_name),
      p_submitter_contact: payload.submitter_contact ? sanitizeText(payload.submitter_contact) : null,
      p_captcha_num1: captcha.num1,
      p_captcha_num2: captcha.num2,
      p_captcha_answer: captcha.answer,
      p_honeypot: honeypot,
    };

    // Chamar a função RPC server-side
    const { data, error } = await supabase.rpc('submit_product_suggestion', sanitized);

    if (error) {
      console.error('[SuggestionsAPI] RPC error:', error.message);
      return { success: false, error: 'Não foi possível enviar a sugestão. Tente novamente.' };
    }

    const result = data as { success: boolean; tracking_code?: string; error?: string };

    if (result.success) {
      lastSubmitTimestamp = Date.now();
    }

    return result;
  },

  /**
   * Consulta status via RPC server-side (retorna apenas dados públicos).
   */
  async checkStatus(trackingCode: string): Promise<{ success: boolean; data?: SuggestionStatus; error?: string }> {
    const code = sanitizeText(trackingCode).toUpperCase().trim();

    if (!/^BM-[A-Z0-9]{6}$/.test(code)) {
      return { success: false, error: 'Código inválido. O formato correto é BM-XXXXXX.' };
    }

    const { data, error } = await supabase.rpc('check_suggestion_status', {
      p_tracking_code: code,
    });

    if (error) {
      console.error('[SuggestionsAPI] RPC error:', error.message);
      return { success: false, error: 'Erro ao consultar. Tente novamente.' };
    }

    const result = data as { success: boolean; data?: SuggestionStatus; error?: string };
    return result;
  },
};
