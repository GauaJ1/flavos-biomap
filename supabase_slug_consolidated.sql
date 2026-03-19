-- ==========================================
-- ETAPA 2: CONSOLIDAÇÃO FINAL DE SLUGS (SEGURO)
-- ==========================================

-- 1. Criar função auxiliar para gerar slugs (Slugify)
-- Esta função limpa acentos, converte para minúsculas e remove caracteres especiais.
CREATE OR REPLACE FUNCTION slugify(text) RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        replace(
          translate($1, 'áàâãäåāăąÁÀÂÃÄÅĀĂĄéèêëēĕėęěÉÈÊËĒĔĖĘĚíìîïĩīĭįİÍÌÎÏĨĪĬĮóòôõöøōŏőÓÒÔÕÖØŌŎŐúùûüũūŭůűųÚÙÛÜŨŪŬŮŰŲçćĉċčÇĆĈĊČñÑýÿÝ', 
                      'aaaaaaaaaAAAAAAAAAeeeeeeeeeEEEEEEEEEiiiiiiiiIIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuuuUUUUUUUUUUcccccCCCCCnNyyY'),
          ' ', '-'
        ),
        '[^a-zA-Z0-9-]', '', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Preencher slugs vazios automaticamente a partir do nome
-- Se o slug já existir, ele não faz nada.
UPDATE public.products 
SET slug = slugify(name) 
WHERE slug IS NULL;

-- 3. Resolver duplicidade (Caso existam dois produtos com o mesmo nome gerando o mesmo slug)
-- Adiciona os 4 primeiros caracteres do UUID ao final do slug para garantir unicidade sem quebrar o padrão.
WITH duplicates AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as r_num
    FROM public.products
)
UPDATE public.products p
SET slug = p.slug || '-' || substr(p.id::text, 1, 4)
FROM duplicates d
WHERE p.id = d.id AND d.r_num > 1;

-- 4. Aplicar restrições finais de integridade
ALTER TABLE public.products ALTER COLUMN slug SET NOT NULL;

-- Tenta remover a constraint antiga se existir para não dar erro de "already exists"
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS unique_product_slug;
ALTER TABLE public.products ADD CONSTRAINT unique_product_slug UNIQUE (slug);

-- 5. Criar índice de busca para performance
CREATE INDEX IF NOT EXISTS idx_products_slug_search ON public.products(slug);
