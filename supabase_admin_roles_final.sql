-- =========================================================================
-- SQL COMPLEMENTAR: AJUSTES FINAIS DE SEGURANÇA E PERFORMANCE
-- =========================================================================

-- 1. Revisão da Função is_admin() para STABLE
-- Transforma a função em STABLE para que o PostgreSQL possa fazer cache
-- de seu resultado durante uma única transação, melhorando a performance das policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- 2. Garantia de Inserção de Admin sem Erros de Duplicidade (ON CONFLICT)
-- (Rode este bloco substituindo seu UID real)
INSERT INTO public.admin_users (user_id) 
VALUES ('aaa07f3b-4507-433d-a270-f5dc6ca28456')
ON CONFLICT (user_id) DO NOTHING;

-- 3. Refazendo as Policies de UPDATE para incluir o WITH CHECK explicitamente
-- (Adicionar WITH CHECK no UPDATE garante que o usuário não consiga alterar a linha
-- de uma forma que ele perca o acesso a ela, ou burlar a trava de gravação).

-- COMMUNITIES
DROP POLICY IF EXISTS "Admins podem alterar comunidades" ON communities;
CREATE POLICY "Admins podem alterar comunidades" 
ON communities FOR UPDATE TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- PRODUCTS
DROP POLICY IF EXISTS "Admins podem alterar produtos" ON products;
CREATE POLICY "Admins podem alterar produtos" 
ON products FOR UPDATE TO authenticated 
USING (public.is_admin()) 
WITH CHECK (public.is_admin());

-- =========================================================================
-- FIM DA REVISÃO DE SEGURANÇA. O BANCO MANTÉM SUA IMPENETRABILIDADE.
-- =========================================================================
