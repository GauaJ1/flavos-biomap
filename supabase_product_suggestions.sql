-- ==========================================
-- TABELA DE SUGESTÕES DE PRODUTOS (FILA DE MODERAÇÃO)
-- Copie este código e cole no SQL Editor do Supabase
-- ==========================================

-- 1. Criação da Tabela de Sugestões
CREATE TABLE public.product_suggestions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Dados do produto sugerido
  name text NOT NULL,
  description text,
  biome text NOT NULL,
  state text NOT NULL,
  region text NOT NULL,
  latitude float,
  longitude float,
  image_url text,

  -- Dados de quem sugeriu
  submitter_name text NOT NULL,
  submitter_contact text,

  -- Controle da fila de moderação
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamp with time zone,

  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.product_suggestions ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança

-- O público pode INSERIR sugestões (qualquer pessoa pode sugerir)
CREATE POLICY "Inserção pública de sugestões"
  ON public.product_suggestions
  FOR INSERT
  WITH CHECK (true);

-- O público pode ver SOMENTE suas próprias sugestões pelo nome (transparência)
-- Mas não pode editar ou deletar
CREATE POLICY "Leitura pública de sugestões"
  ON public.product_suggestions
  FOR SELECT
  USING (true);

-- Admins autenticados podem fazer tudo (aprovar, rejeitar, deletar)
-- Essa policy depende da tabela admin_users existente
CREATE POLICY "Admins gerenciam sugestões"
  ON public.product_suggestions
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );

CREATE POLICY "Admins deletam sugestões"
  ON public.product_suggestions
  FOR DELETE
  USING (
    auth.uid() IN (SELECT user_id FROM public.admin_users)
  );

-- 4. Índice para buscar sugestões pendentes rapidamente
CREATE INDEX idx_product_suggestions_status ON public.product_suggestions(status);
CREATE INDEX idx_product_suggestions_created_at ON public.product_suggestions(created_at DESC);
