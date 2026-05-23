-- ==========================================
-- MIGRAÇÃO: Adicionar tracking_code à tabela product_suggestions
-- Execute APÓS ter criado a tabela com supabase_product_suggestions.sql
-- ==========================================

-- 1. Adicionar coluna tracking_code
ALTER TABLE public.product_suggestions
  ADD COLUMN IF NOT EXISTS tracking_code text UNIQUE;

-- 2. Índice para busca rápida por tracking_code
CREATE INDEX IF NOT EXISTS idx_product_suggestions_tracking_code
  ON public.product_suggestions(tracking_code);
