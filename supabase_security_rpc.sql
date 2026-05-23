-- ==========================================
-- SEGURANÇA SERVER-SIDE: RPC Functions + RLS Restritivo
-- Execute APÓS as migrações anteriores
-- ==========================================
-- Estas funções rodam no servidor PostgreSQL (SECURITY DEFINER)
-- e fazem: rate limiting, validação CAPTCHA, honeypot check,
-- sanitização de inputs e restrição de SELECT por tracking_code.
-- ==========================================

-- ═══════════════════════════════════════════
-- 0. LIMPAR VERSÕES ANTIGAS (resolve "function name is not unique")
-- ═══════════════════════════════════════════
-- A assinatura mudou (novos parâmetros), então precisamos dropar TODAS as versões.
DROP FUNCTION IF EXISTS submit_product_suggestion(text, text, text, text, text, float, float, text, text, text, int, int, int, text);
DROP FUNCTION IF EXISTS submit_product_suggestion(text, text, text, text, text, float, float, text, text, text, text, text, text, text, int, int, int, text);
DROP FUNCTION IF EXISTS check_suggestion_status(text);

-- ═══════════════════════════════════════════
-- 1. FUNÇÃO: Submeter sugestão (server-side seguro)
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION submit_product_suggestion(
  p_name text,
  p_description text DEFAULT NULL,
  p_biome text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_latitude float DEFAULT NULL,
  p_longitude float DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_community_name text DEFAULT NULL,
  p_community_location text DEFAULT NULL,
  p_community_description text DEFAULT NULL,
  p_community_tags text[] DEFAULT NULL,
  p_sustainable_importance text DEFAULT NULL,
  p_traditional_knowledge text DEFAULT NULL,
  p_curiosity_clue text DEFAULT NULL,
  p_submitter_name text DEFAULT NULL,
  p_submitter_contact text DEFAULT NULL,
  p_captcha_num1 int DEFAULT NULL,
  p_captcha_num2 int DEFAULT NULL,
  p_captcha_answer int DEFAULT NULL,
  p_honeypot text DEFAULT ''
) RETURNS jsonb AS $$
DECLARE
  v_tracking_code text;
  v_recent_count int;
  v_chars text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_code text := 'BM-';
  v_allowed_biomes text[] := ARRAY['Amazônia', 'Cerrado', 'Caatinga', 'Mata Atlântica', 'Pantanal', 'Pampa'];
  v_allowed_regions text[] := ARRAY['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
BEGIN
  -- ── 1. HONEYPOT CHECK ──
  -- Campo invisível que bots preenchem — humanos nunca tocam
  IF p_honeypot IS NOT NULL AND p_honeypot != '' THEN
    -- Retorna sucesso falso com código fake para não alertar o bot
    RETURN jsonb_build_object('success', true, 'tracking_code', 'BM-000000');
  END IF;

  -- ── 2. CAPTCHA VERIFICATION ──
  IF p_captcha_num1 IS NULL OR p_captcha_num2 IS NULL OR p_captcha_answer IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Complete a verificação de segurança.');
  END IF;

  -- Verifica se os números estão no range válido (1-20)
  IF p_captcha_num1 < 1 OR p_captcha_num1 > 20 OR p_captcha_num2 < 1 OR p_captcha_num2 > 20 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Verificação de segurança inválida.');
  END IF;

  IF p_captcha_answer != (p_captcha_num1 + p_captcha_num2) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Resposta da verificação incorreta. Tente novamente.');
  END IF;

  -- ── 3. VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS ──
  IF p_name IS NULL OR trim(p_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Nome do produto é obrigatório.');
  END IF;
  IF p_submitter_name IS NULL OR trim(p_submitter_name) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Seu nome é obrigatório.');
  END IF;
  IF p_state IS NULL OR trim(p_state) = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Estado é obrigatório.');
  END IF;

  -- ── 4. VALIDAÇÃO DE ENUMS ──
  IF p_biome IS NULL OR NOT (p_biome = ANY(v_allowed_biomes)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Bioma inválido.');
  END IF;
  IF p_region IS NULL OR NOT (p_region = ANY(v_allowed_regions)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Região inválida.');
  END IF;

  -- ── 5. RATE LIMITING SERVER-SIDE ──
  -- Máximo 3 envios por hora do mesmo nome de submissor
  SELECT COUNT(*) INTO v_recent_count
  FROM public.product_suggestions
  WHERE lower(trim(submitter_name)) = lower(trim(p_submitter_name))
    AND created_at > NOW() - INTERVAL '1 hour';

  IF v_recent_count >= 3 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Limite de envios atingido (3 por hora). Tente novamente mais tarde.');
  END IF;

  -- ── 6. GERAR TRACKING CODE ÚNICO ──
  LOOP
    v_code := 'BM-';
    FOR i IN 1..6 LOOP
      v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;
    -- Verificar unicidade
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.product_suggestions WHERE tracking_code = v_code);
  END LOOP;
  v_tracking_code := v_code;

  -- ── 7. INSERIR SUGESTÃO (com sanitização server-side) ──
  INSERT INTO public.product_suggestions (
    name, description, biome, state, region,
    latitude, longitude, image_url,
    community_name, community_location, community_description, community_tags,
    sustainable_importance, traditional_knowledge, curiosity_clue,
    submitter_name, submitter_contact, tracking_code
  ) VALUES (
    left(trim(p_name), 100),
    CASE WHEN p_description IS NOT NULL AND trim(p_description) != ''
      THEN left(trim(p_description), 1000) ELSE NULL END,
    p_biome,
    left(trim(p_state), 50),
    p_region,
    CASE WHEN p_latitude IS NOT NULL AND p_latitude BETWEEN -34 AND 6 THEN p_latitude ELSE NULL END,
    CASE WHEN p_longitude IS NOT NULL AND p_longitude BETWEEN -74 AND -34 THEN p_longitude ELSE NULL END,
    CASE WHEN p_image_url IS NOT NULL AND trim(p_image_url) != ''
      THEN left(trim(p_image_url), 500) ELSE NULL END,
    CASE WHEN p_community_name IS NOT NULL AND trim(p_community_name) != ''
      THEN left(trim(p_community_name), 100) ELSE NULL END,
    CASE WHEN p_community_location IS NOT NULL AND trim(p_community_location) != ''
      THEN left(trim(p_community_location), 200) ELSE NULL END,
    CASE WHEN p_community_description IS NOT NULL AND trim(p_community_description) != ''
      THEN left(trim(p_community_description), 500) ELSE NULL END,
    p_community_tags,
    CASE WHEN p_sustainable_importance IS NOT NULL AND trim(p_sustainable_importance) != ''
      THEN left(trim(p_sustainable_importance), 500) ELSE NULL END,
    CASE WHEN p_traditional_knowledge IS NOT NULL AND trim(p_traditional_knowledge) != ''
      THEN left(trim(p_traditional_knowledge), 500) ELSE NULL END,
    CASE WHEN p_curiosity_clue IS NOT NULL AND trim(p_curiosity_clue) != ''
      THEN left(trim(p_curiosity_clue), 300) ELSE NULL END,
    left(trim(p_submitter_name), 60),
    CASE WHEN p_submitter_contact IS NOT NULL AND trim(p_submitter_contact) != ''
      THEN left(trim(p_submitter_contact), 100) ELSE NULL END,
    v_tracking_code
  );

  RETURN jsonb_build_object('success', true, 'tracking_code', v_tracking_code);

EXCEPTION WHEN OTHERS THEN
  -- Nunca expor detalhes internos do banco
  RETURN jsonb_build_object('success', false, 'error', 'Erro interno. Tente novamente mais tarde.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════
-- 2. FUNÇÃO: Consultar status por tracking code
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION check_suggestion_status(p_tracking_code text)
RETURNS jsonb AS $$
DECLARE
  v_result record;
  v_code text;
BEGIN
  -- Sanitizar input
  v_code := upper(trim(COALESCE(p_tracking_code, '')));

  -- Validar formato BM-XXXXXX
  IF v_code !~ '^BM-[A-Z0-9]{6}$' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Código inválido. O formato correto é BM-XXXXXX.');
  END IF;

  -- Buscar sugestão (retorna APENAS dados públicos, nunca contato)
  SELECT name, status, rejection_reason, created_at, reviewed_at
  INTO v_result
  FROM public.product_suggestions
  WHERE tracking_code = v_code;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sugestão não encontrada. Verifique o código e tente novamente.');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'data', jsonb_build_object(
      'tracking_code', v_code,
      'name', v_result.name,
      'status', v_result.status,
      'rejection_reason', v_result.rejection_reason,
      'created_at', v_result.created_at,
      'reviewed_at', v_result.reviewed_at
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════
-- 3. ATUALIZAR RLS: Restringir acesso direto à tabela
-- ═══════════════════════════════════════════
-- Remover políticas públicas antigas (se existirem)
DROP POLICY IF EXISTS "Inserção pública de sugestões" ON public.product_suggestions;
DROP POLICY IF EXISTS "Leitura pública de sugestões" ON public.product_suggestions;

-- Agora o público NÃO pode acessar a tabela diretamente.
-- Toda interação passa pelas funções RPC (SECURITY DEFINER).

-- Admins autenticados mantêm acesso total para a moderação:
-- (As policies de admin já existem, mas recriamos por segurança)
DROP POLICY IF EXISTS "Admins gerenciam sugestões" ON public.product_suggestions;
DROP POLICY IF EXISTS "Admins deletam sugestões" ON public.product_suggestions;
DROP POLICY IF EXISTS "Admins leem sugestões" ON public.product_suggestions;

CREATE POLICY "Admins leem sugestões"
  ON public.product_suggestions FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admins gerenciam sugestões"
  ON public.product_suggestions FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

CREATE POLICY "Admins deletam sugestões"
  ON public.product_suggestions FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM public.admin_users));

-- ═══════════════════════════════════════════
-- 4. PERMISSÕES: Público pode chamar APENAS as funções RPC
-- ═══════════════════════════════════════════
GRANT EXECUTE ON FUNCTION submit_product_suggestion TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_suggestion_status TO anon, authenticated;
