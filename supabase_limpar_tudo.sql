-- ==========================================
-- LIMPEZA COMPLETA DO BANCO DE DADOS
-- Execute no SQL Editor do Supabase
-- ==========================================
-- A ordem importa por causa das foreign keys (CASCADE).
-- TRUNCATE é mais eficiente que DELETE e reseta tudo de verdade.

-- 1. Comentários (depende de products)
TRUNCATE TABLE public.comments CASCADE;

-- 2. Curtidas (depende de products)
TRUNCATE TABLE public.likes CASCADE;

-- 3. Sugestões de produtos (tabela independente)
TRUNCATE TABLE public.product_suggestions CASCADE;

-- 4. Produtos (depende de communities)
TRUNCATE TABLE public.products CASCADE;

-- 5. Comunidades (tabela raiz)
TRUNCATE TABLE public.communities CASCADE;

-- ==========================================
-- Pronto! Todas as tabelas estão vazias.
-- ==========================================
