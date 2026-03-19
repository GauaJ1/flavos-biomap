-- =========================================================================
-- SCRIPT: IMPLEMENTAÇÃO DO MODELO DE SEGURANÇA ADMIN "ROLE-BASED"
-- =========================================================================
-- ETAPA 1: ANÁLISE DO PROBLEMA ATUAL
-- As tabelas `products` e `communities` estavam configuradas com `TO authenticated`.
-- Isso significa que QUALQUER pessoa que criar uma conta no seu projeto Supabase 
-- (por exemplo, via uma brecha ou API pública) poderia deletar ou alterar produtos.
-- Para um Painel Admin real, auth (quem a pessoa é) não é suficiente; precisamos
-- de authorization (o que a pessoa pode fazer).

-- =========================================================================
-- ETAPA 2: CRIAR CONTROLE REAL DE ADMINISTRADORES
-- =========================================================================
-- Tabela segura vinculada ao sistema de Auth do Supabase
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS na tabela de admins
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Apenas o próprio admin pode verificar se ele é admin (ajuda no Front-end React)
CREATE POLICY "Admins podem ler seu próprio status" 
ON public.admin_users FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- =========================================================================
-- ETAPA 3: CRIAR FUNÇÃO SEGURA DE VERIFICAÇÃO PARA RLS
-- =========================================================================
-- Função `security definer` que checa o acesso bypassando o RLS da tabela admin_users
-- para que possa ser usada dentro das policies das outras tabelas com eficiência.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- =========================================================================
-- ETAPA 4: REFATORAR POLICIES DE PRODUCTS E COMMUNITIES
-- =========================================================================
-- Primeiro, deletamos as políticas inseguras que criamos na fase anterior
DROP POLICY IF EXISTS "Permitir inserção de comunidades para administradores logados" ON communities;
DROP POLICY IF EXISTS "Permitir edição de comunidades para administradores logados" ON communities;
DROP POLICY IF EXISTS "Permitir exclusão de comunidades para administradores logados" ON communities;

DROP POLICY IF EXISTS "Permitir inserção de produtos para administradores logados" ON products;
DROP POLICY IF EXISTS "Permitir edição de produtos para administradores logados" ON products;
DROP POLICY IF EXISTS "Permitir exclusão de produtos para administradores logados" ON products;

-- Agora, criamos as políticas baseadas EXCLUSIVAMENTE na função is_admin()

-- COMMUNITIES
CREATE POLICY "Admins podem inserir comunidades" 
ON communities FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins podem alterar comunidades" 
ON communities FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins podem deletar comunidades" 
ON communities FOR DELETE TO authenticated USING (public.is_admin());

-- PRODUCTS
CREATE POLICY "Admins podem inserir produtos" 
ON products FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins podem alterar produtos" 
ON products FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins podem deletar produtos" 
ON products FOR DELETE TO authenticated USING (public.is_admin());

-- (Lembrando que o `SELECT` público para produtos e comunidades não foi tocado, então o App Expo continua funcionando 100% normal)

-- =========================================================================
-- ETAPAS 5 e 6: INSERÇÃO MANUAL DO PRIMEIRO ADMIN E SEGURANÇA DO AUTH
-- =========================================================================
-- O fluxo de Auth do Supabase por padrão permite que qualquer pessoa crie conta.
-- Vá em Authentication > Providers e DESATIVE a opção "Enable Signups" (apenas desative se você for o único usuário)
-- OU deixe ligado, mas o Painel e o banco só funcionarão para quem constar na tabela `admin_users`.

-- EXEMPLO DE COMO ADICIONAR SEU USUÁRIO COMO ADMIN:
-- Como você já encontrou o seu UID, basta rodar o comando abaixo no SQL Editor do Supabase:

INSERT INTO public.admin_users (user_id) 
VALUES ('aaa07f3b-4507-433d-a270-f5dc6ca28456');
