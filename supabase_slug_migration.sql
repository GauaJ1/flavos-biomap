-- ==========================================
-- MIGRAÇÃO DE IDENTIFICADORES AMIGÁVEIS (SLUGS)
-- ==========================================

-- 1. Cria a coluna permitindo nulos inicialmente (para que não falhe se a tabela tiver produtos)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;

-- 2. Preenche os slugs dos nossos produtos mockados (caso eles já estejam no banco do MVP)
UPDATE public.products SET slug = 'oleo-de-andiroba' WHERE name = 'Óleo de Andiroba';
UPDATE public.products SET slug = 'geleia-de-umbu' WHERE name = 'Geleia de Umbu';
UPDATE public.products SET slug = 'mel-de-abelha-nativa' WHERE name = 'Mel de Abelha Nativa';
UPDATE public.products SET slug = 'artesanato-de-capim-dourado' WHERE name = 'Artesanato de Capim Dourado';
UPDATE public.products SET slug = 'castanha-da-amazonia' WHERE name = 'Castanha-da-Amazônia';

-- 3. Caso haja novos produtos genéricos criados sem nome mapeado acima, gera um slug provisório usando parte do id para evitar erro de not null
UPDATE public.products SET slug = 'produto-' || substr(id::text, 1, 8) WHERE slug IS NULL;

-- 4. Agora aplica as restrições sólidas de segurança (Único e Obrigatório)
-- Primeiro remove as regras caso o script seja rodado duas vezes
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS unique_product_slug;

ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;
ALTER TABLE public.products ADD CONSTRAINT unique_product_slug UNIQUE (slug);

-- 5. Criação preventiva de índice (Acelera drasticamente a busca da nova string via QR Code)
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
