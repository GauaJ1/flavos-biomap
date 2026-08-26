-- =========================================================================
-- BANCO DE DADOS OFICIAL - FLAVOS BIOMAP (3 PRODUTOS PRINCIPAIS)
-- =========================================================================
-- Copie todo este conteúdo e execute no SQL Editor do seu Supabase.
-- Ele limpa a base e insere os 3 produtos e comunidades icônicas da mostra,
-- com imagens 100% verificadas (HTTP 200), mural de saberes e moderação.
-- =========================================================================

-- 1. GARANTIR COLUNAS E TABELAS ESSENCIAIS
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS curiosity_clue text;

CREATE TABLE IF NOT EXISTS public.product_suggestions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  biome text NOT NULL,
  state text NOT NULL,
  region text NOT NULL,
  latitude float,
  longitude float,
  image_url text,
  submitter_name text NOT NULL,
  submitter_contact text,
  community_name text,
  sustainable_importance text,
  traditional_knowledge text,
  curiosity_clue text,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. LIMPEZA TOTAL DA BASE ANTERIOR
TRUNCATE TABLE public.comments CASCADE;
TRUNCATE TABLE public.likes CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.communities CASCADE;
TRUNCATE TABLE public.product_suggestions CASCADE;

-- 3. AS 3 COMUNIDADES TRADICIONAIS (AMAZÔNIA, CAATINGA, MATA ATLÂNTICA)
INSERT INTO public.communities (id, name, description, location_name, latitude, longitude, image_url, tags, created_at)
VALUES 
(
  'c1000000-0000-0000-0000-000000000001',
  'Cooperativa Extrativista do Tapajós',
  'Comunidade ribeirinha e indígena que vive da coleta sustentável de sementes, resinas e óleos florestais nas margens do Rio Tapajós, mantendo a floresta em pé através do manejo consciente.',
  'Reserva Tapajós, Belterra - PA',
  -2.6371,
  -54.9392,
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
  ARRAY['Ribeirinha', 'Manejo Florestal', 'Amazônia'],
  NOW()
),
(
  'c2000000-0000-0000-0000-000000000002',
  'Coletivo Mulheres do Sertão Produtivo',
  'Cooperativa formada por mulheres camponesas focada no beneficiamento de frutos nativos da Caatinga e na convivência harmônica com o semiárido nordestino.',
  'Sertão do São Francisco, Juazeiro - BA',
  -9.4162,
  -40.5033,
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  ARRAY['Agricultura Familiar', 'Mulheres', 'Caatinga'],
  NOW()
),
(
  'c3000000-0000-0000-0000-000000000003',
  'Coletivo de Mulheres Caipiras da Serra',
  'Grupo de agricultoras familiares da Serra da Mantiqueira que mantém viva a tradição da colheita manual, torra artesanal no fogão a lenha e moagem no pilão rústico de madeira.',
  'Serra da Mantiqueira, São Lourenço - MG',
  -22.1158,
  -45.0544,
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
  ARRAY['Cultura Caipira', 'Artesanal', 'Mantiqueira'],
  NOW()
);

-- 4. OS 3 PRODUTOS PRINCIPAIS DA MOSTRA CULTURAL
INSERT INTO public.products (id, slug, name, description, sustainable_importance, traditional_knowledge, curiosity_clue, community_id, state, region, biome, latitude, longitude, image_url, created_at)
VALUES
(
  '11000000-0000-0000-0000-000000000001',
  'oleo-de-andiroba',
  'Óleo de Andiroba Puro',
  'Óleo vegetal precioso com propriedades cicatrizantes, anti-inflamatórias e repelentes, extraído a frio de sementes colhidas após caírem naturalmente na água e no chão da mata.',
  'A colheita extrativista só aproveita as sementes caídas, garantindo que as árvores centenárias de andiroba continuem em pé protegendo o solo e a fauna amazônica.',
  'As sementes são recolhidas pelas famílias ribeirinhas, descansam em esteiras e são prensadas manualmente sem uso de solventes químicos.',
  'PISTA DO PRODUTOR: Um óleo medicinal dourado cujas sementes viajam pelos rios da Amazônia antes de serem colhidas à mão pelos ribeirinhos...',
  'c1000000-0000-0000-0000-000000000001',
  'PA',
  'Norte',
  'Amazônia',
  -2.6371,
  -54.9392,
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '22000000-0000-0000-0000-000000000002',
  'geleia-de-umbu',
  'Geleia de Umbu da Caatinga',
  'Doce artesanal feito com a polpa ácida e aromática do umbu, fruta sagrada do semiárido colhida em época de safra por cooperativas de mulheres sertanejas.',
  'O umbuzeiro é conhecido como a árvore que dá de beber porque suas raízes estocam água. O manejo sustentável gera renda sem necessidade de irrigação pesada.',
  'A fruta é cozida lentamente em panelas de ferro com adição mínima de açúcar mascavo, preservando o equilíbrio perfeito entre o ácido e o doce.',
  'PISTA DO PRODUTOR: Um doce artesanal feito a partir do fruto de uma árvore nativa cujas raízes armazenam até mil litros de água para resistir à seca...',
  'c2000000-0000-0000-0000-000000000002',
  'BA',
  'Nordeste',
  'Caatinga',
  -9.4162,
  -40.5033,
  'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '33000000-0000-0000-0000-000000000003',
  'cafe-pilao',
  'Café Socado no Pilão',
  'Café agroecológico cultivado nas montanhas da Mantiqueira, colhido a dedo, seco em terreiro suspenso e triturado no clássico pilão de madeira caipira.',
  'Plantado à meia-sombra sob a copa de árvores nativas, funcionando como um refúgio e corredor ecológico para pássaros e insetos polinizadores.',
  'A torra em tacho no fogão a lenha seguida da socagem no pilão ainda morno libera óleos aromáticos com notas florais e toque amanteigado.',
  'PISTA DO PRODUTOR: Grãos colhidos nas montanhas, torrados no fogão de lenha e castigados na madeira para despertar um perfume que acorda a serra inteira...',
  'c3000000-0000-0000-0000-000000000003',
  'MG',
  'Sudeste',
  'Mata Atlântica',
  -22.1158,
  -45.0544,
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
  NOW()
);

-- 5. CURTIDAS INICIAIS NO MURAL DE SABERES
INSERT INTO public.likes (product_id, count, created_at) VALUES 
('11000000-0000-0000-0000-000000000001', 48, NOW()),
('22000000-0000-0000-0000-000000000002', 36, NOW()),
('33000000-0000-0000-0000-000000000003', 55, NOW());

-- 6. COMENTÁRIOS HUMANIZADOS NO MURAL DE SABERES
INSERT INTO public.comments (product_id, author_name, content, created_at) VALUES 
('11000000-0000-0000-0000-000000000001', 'Maria Clara Santos', 'Esse óleo é milagroso para picadas de inseto e dores musculares. Incrível saber que vem do Tapajós!', NOW()),
('11000000-0000-0000-0000-000000000001', 'Prof. Thiago Rezende', 'Trabalho lindo de valorização do manejo ribeirinho. A floresta agradece.', NOW()),
('22000000-0000-0000-0000-000000000002', 'Ana Beatriz Souza', 'A geleia de umbu tem um azedinho perfeito com queijo canastra. Parabéns às mulheres da Caatinga!', NOW()),
('33000000-0000-0000-0000-000000000003', 'Mariana Alvarenga', 'Esse café feito no pilão tem notas florais e defumadas únicas. Uma verdadeira joia caipira!', NOW()),
('33000000-0000-0000-0000-000000000003', 'Seu Zé do Café', 'A batida do pilão é o coração da nossa serra. Muito orgulho de ver nosso café no app!', NOW());

-- 7. SUGESTÕES DE PRODUTOS PENDENTES (PARA DEMONSTRAR A MODERAÇÃO NO ADMIN)
INSERT INTO public.product_suggestions (
  id, name, description, biome, state, region, latitude, longitude, image_url,
  submitter_name, submitter_contact, community_name, sustainable_importance, traditional_knowledge, curiosity_clue,
  status, created_at
)
VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'Castanha-do-Brasil Desidratada no Forno Solar',
  'Castanhas nobres coletadas em reservas extrativistas centenárias e desidratadas ecologicamente com energia solar.',
  'Amazônia',
  'AC',
  'Norte',
  -9.9747,
  -67.8243,
  'https://images.unsplash.com/photo-1543208541-0961a29a8c3d?auto=format&fit=crop&w=800&q=80',
  'Dona Francisca Silva',
  'francisca.acre@coop.org',
  'Cooperativa Agroextrativista de Xapuri - AC',
  'A castanheira é um dos maiores monumentos vivos da Amazônia. O extrativismo secular impede a derrubada das matas nativas.',
  'As castanhas são retiradas de ouriços colhidos no chão da floresta após caírem de árvores que chegam a 50 metros de altura.',
  'PISTA: Uma castanha sagrada que cai em ouriços pesados do topo da floresta mais densa do planeta...',
  'pending',
  NOW()
),
(
  'a2000000-0000-0000-0000-000000000002',
  'Licor Artesanal de Jenipapo do Velho Chico',
  'Licor preparado com a infusão do fruto do jenipapo maduro em cachaça de alambique de cana caiana.',
  'Caatinga',
  'SE',
  'Nordeste',
  -9.8000,
  -37.5000,
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
  'Tiago Ribeiro Mendes',
  'tiago.jenipapo@velhochico.br',
  'Associação Ribeirinha do Baixo São Francisco',
  'Preservação dos pomares naturais de jenipapeiros nas margens do Rio São Francisco.',
  'O fruto passa por maceração lenta em garrafões de vidro guardados na penumbra durante 6 meses.',
  'PISTA: Um licor escuro e perfumado feito de um fruto sagrado que também é usado tradicionalmente para pintura corporal...',
  'pending',
  NOW()
);
