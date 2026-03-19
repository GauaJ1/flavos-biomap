-- =========================================================================
-- SCRIPT DE LIMPEZA OFICIAL: MÁQUINA ZERO PARA A AMOSTRA CULTURAL
-- =========================================================================
-- AVISO: A execução deste script APAGARÁ DEFINITIVAMENTE todos os dados 
-- de testes criados durante o desenvolvimento (Comunidades, Produtos, 
-- Comentários (Saberes) e Curtidas).
--
-- Isso deixará o banco de dados completamente vazio e pronto para você
-- cadastrar os dados REAIS usando o seu novo Painel Administrativo.

-- 1. Apaga as interações (elas dependem dos produtos)
TRUNCATE TABLE public.likes CASCADE;
TRUNCATE TABLE public.comments CASCADE;

-- 2. Apaga os Produtos (eles dependem das comunidades)
TRUNCATE TABLE public.products CASCADE;

-- 3. Apaga as Comunidades (a base da pirâmide)
TRUNCATE TABLE public.communities CASCADE;

-- NOTA: O comando TRUNCATE é mais rápido e limpo que o DELETE FROM, 
-- pois ele zera as tabelas sem varrer linha por linha. O CASCADE garante 
-- que se houver alguma relação presa, ela seja diluída sem dar erro no banco.

-- ATENÇÃO: A tabela `admin_users` NÃO FOI INCLUÍDA AQUI, portanto seu usuário 
-- continua sendo o administrador inatingível do painel!
