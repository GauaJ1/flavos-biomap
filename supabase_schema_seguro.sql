-- ==========================================
-- Reforço de Segurança Estrutural e RLS (MVP Seguro)
-- ==========================================

-- 1. Criação da Tabela de Comunidades
CREATE TABLE IF NOT EXISTS public.communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) > 2),
  description text NOT NULL,
  location_name text NOT NULL,
  latitude float,
  longitude float,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL CHECK (char_length(name) > 2),
  description text NOT NULL,
  sustainable_importance text NOT NULL,
  traditional_knowledge text NOT NULL,
  state text NOT NULL,
  region text NOT NULL,
  biome text NOT NULL,
  latitude float,
  longitude float,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Criação da Tabela de Curtidas
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  count integer DEFAULT 0 CHECK (count >= 0),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garante que o product_id é único em tabelas já existentes (Necessário para o ON CONFLICT)
ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS unique_product_id;
ALTER TABLE public.likes ADD CONSTRAINT unique_product_id UNIQUE (product_id);

-- 4. Criação da Tabela de Comentários
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 2 AND 50),
  content text NOT NULL CHECK (char_length(content) BETWEEN 3 AND 500),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ÍNDICES DE PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_products_community_id ON public.products(community_id);
CREATE INDEX IF NOT EXISTS idx_comments_product_id ON public.comments(product_id);
CREATE INDEX IF NOT EXISTS idx_likes_product_id ON public.likes(product_id);

-- ==========================================
-- FUNÇÃO SEGURA PARA CURTIDAS (RPC)
-- ==========================================
-- Esta função permite incrementar a curtida atomicamente e com limite numérico (+1 ou -1)
-- Evita a interceptação de requisições no cliente para enviar 1.000 curtidas de uma só vez.

CREATE OR REPLACE FUNCTION public.toggle_like(p_product_id uuid, p_increment integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com os privilégios do criador da função, sobrepondo o RLS bloqueado para UPDATE
AS $$
BEGIN
  -- Impede que o cliente tente hackear enviando saltos enormes
  IF p_increment NOT IN (1, -1) THEN
     RAISE EXCEPTION 'Apenas incrementos de 1 ou -1 são permitidos';
  END IF;

  INSERT INTO public.likes (product_id, count)
  VALUES (p_product_id, GREATEST(0, p_increment))
  ON CONFLICT (product_id) 
  DO UPDATE SET count = GREATEST(0, public.likes.count + p_increment);
END;
$$;

-- ==========================================
-- CONFIGURANDO POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Limpando políticas antigas caso já existam
DROP POLICY IF EXISTS "Leitura livre para Comunidades" ON public.communities;
DROP POLICY IF EXISTS "Leitura livre para Produtos" ON public.products;
DROP POLICY IF EXISTS "Leitura livre para Curtidas" ON public.likes;
DROP POLICY IF EXISTS "Atualização livre para Curtidas" ON public.likes;
DROP POLICY IF EXISTS "Leitura livre para Comentários" ON public.comments;
DROP POLICY IF EXISTS "Inserção livre para Comentários" ON public.comments;

-- 1. Produtos e Comunidades (Apenas visualização para todo mundo)
CREATE POLICY "Leitura livre para Comunidades" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Leitura livre para Produtos" ON public.products FOR SELECT USING (true);

-- 2. Comentários (Visualização e Inserção)
CREATE POLICY "Leitura livre para Comentários" ON public.comments FOR SELECT USING (true);
-- O INSERT é permitido, mas as "CHECK Constraints" na tabela evitam abusos (tamanho das strings)
CREATE POLICY "Inserção livre para Comentários" ON public.comments FOR INSERT WITH CHECK (true);

-- 3. Curtidas (Apenas Leitura. O Update é bloqueado e só funciona via função RPC)
CREATE POLICY "Leitura livre para Curtidas" ON public.likes FOR SELECT USING (true);
-- Repare que NÂO há política de UPDATE aqui. É 100% trancado pela tabela.
