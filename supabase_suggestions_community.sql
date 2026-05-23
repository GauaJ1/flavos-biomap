-- ==========================================
-- MIGRAÇÃO: Campos de comunidade na sugestão
-- Execute APÓS as migrações anteriores
-- ==========================================

ALTER TABLE public.product_suggestions
  ADD COLUMN IF NOT EXISTS community_location text,
  ADD COLUMN IF NOT EXISTS community_description text,
  ADD COLUMN IF NOT EXISTS community_tags text[];

COMMENT ON COLUMN public.product_suggestions.community_location IS 'Local/região da comunidade produtora';
COMMENT ON COLUMN public.product_suggestions.community_description IS 'Descrição e história da comunidade';
COMMENT ON COLUMN public.product_suggestions.community_tags IS 'Emblemas/selos da comunidade';
