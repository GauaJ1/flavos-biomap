-- =========================================================================
-- SCRIPT: LIBERAR ACESSO ADMINISTRATIVO (INSERÇÃO E EDIÇÃO) AOS PRODUTOS E COMUNIDADES
-- =========================================================================

-- Para permitir que o seu novo usuário do Painel Administrativo consiga
-- cirar, editar e excluir registros, precisamos adicionar essas políticas
-- às tabelas que já possuíam RLS ativado apenas para leitura pública.

-- 1. Políticas para a tabela `communities`
CREATE POLICY "Permitir inserção de comunidades para administradores logados"
ON communities FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir edição de comunidades para administradores logados"
ON communities FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir exclusão de comunidades para administradores logados"
ON communities FOR DELETE
TO authenticated
USING (true);

-- 2. Políticas para a tabela `products`
CREATE POLICY "Permitir inserção de produtos para administradores logados"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir edição de produtos para administradores logados"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir exclusão de produtos para administradores logados"
ON products FOR DELETE
TO authenticated
USING (true);

-- Lembrete: A política de "Leitura Pública" (SELECT) já existente se mantém, 
-- então o app Expo continuará lendo normalmente os dados novos.
