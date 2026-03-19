-- Adicionando a coluna de tags dinâmicas para as comunidades!
-- Rode isso no SQL Editor do Supabase.

ALTER TABLE public.communities 
ADD COLUMN tags text[] DEFAULT '{}';

-- Como estamos lidando com um array de textos (text[]),
-- o Supabase retornará para a gente um array JS comum: ['Guardiões do Território', 'Sustentável']
