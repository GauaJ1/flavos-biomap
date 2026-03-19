-- ==========================================
-- ETAPA 1: VERIFICAÇÃO DE CONSISTÊNCIA (SLUGS)
-- ==========================================
-- Rode estes comandos para entender o estado atual do banco antes de aplicar mudanças.

-- 1. Verificar quantos produtos não possuem slug
SELECT count(*) as sem_slug FROM public.products WHERE slug IS NULL;

-- 2. Verificar se existem slugs duplicados
SELECT slug, count(*) 
FROM public.products 
WHERE slug IS NOT NULL 
GROUP BY slug 
HAVING count(*) > 1;

-- 3. Visualizar os produtos e seus slugs atuais
SELECT name, slug, id FROM public.products ORDER BY created_at DESC;
