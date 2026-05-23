-- ==========================================
-- MIGRAÇÃO: Campos detalhados para sugestões de produtos
-- Execute APÓS as migrações anteriores
-- ==========================================

-- Novos campos para alinhar com a estrutura do catálogo oficial
ALTER TABLE public.product_suggestions
  ADD COLUMN IF NOT EXISTS community_name text,
  ADD COLUMN IF NOT EXISTS sustainable_importance text,
  ADD COLUMN IF NOT EXISTS traditional_knowledge text,
  ADD COLUMN IF NOT EXISTS curiosity_clue text;

-- Comentários para documentação
COMMENT ON COLUMN public.product_suggestions.community_name IS 'Nome da comunidade produtora (texto livre do público)';
COMMENT ON COLUMN public.product_suggestions.sustainable_importance IS 'Importância sustentável do produto para a floresta/bioma';
COMMENT ON COLUMN public.product_suggestions.traditional_knowledge IS 'Saber tradicional de como o produto é feito';
COMMENT ON COLUMN public.product_suggestions.curiosity_clue IS 'Curiosidade ou pista sobre o produto';
