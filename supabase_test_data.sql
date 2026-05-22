-- =========================================================================
-- SCRIPT DE POPULAÇÃO DE DADOS DE TESTE (MOCKS COMPLETOS E ATUALIZADOS)
-- Copie este código e execute no SQL Editor do Supabase.
-- =========================================================================

-- 1. Limpar dados anteriores de teste (opcional, remova o comentário abaixo se desejar zerar antes de inserir)
-- TRUNCATE TABLE public.likes CASCADE;
-- TRUNCATE TABLE public.comments CASCADE;
-- TRUNCATE TABLE public.products CASCADE;
-- TRUNCATE TABLE public.communities CASCADE;

-- 2. Inserir Comunidades de Teste com Tags
INSERT INTO public.communities (id, name, description, location_name, latitude, longitude, image_url, tags) VALUES 
(
  'c1000000-0000-0000-0000-000000000001', 
  'Cooperativa Extrativista da Amazônia', 
  'Comunidade ribeirinha que vive da coleta sustentável de sementes e frutos nativos nas margens do Rio Tapajós.', 
  'Reserva Tapajós - Pará', 
  -3.4653, 
  -55.2159, 
  'https://images.unsplash.com/photo-1518182170546-076616fd42bf?q=80&w=800',
  ARRAY['Sustentável', 'Ribeirinha', 'Amazônia']
),
(
  'c2000000-0000-0000-0000-000000000002', 
  'Mulheres do Sertão Produtivo', 
  'Cooperativa formada por mulheres camponesas focada no processamento de frutos nativos da Caatinga e convivência com o semiárido.', 
  'Sertão do São Francisco - Bahia', 
  -9.8450, 
  -40.1012, 
  'https://images.unsplash.com/photo-1596773539958-38ce518903e1?q=80&w=800',
  ARRAY['Mulheres', 'Caatinga', 'Artesanal']
),
(
  'c3000000-0000-0000-0000-000000000003', 
  'Associação de Catação do Cerrado', 
  'Famílias geraizeiras que coletam frutos do Cerrado, promovendo a conservação ambiental e geração de renda justa.', 
  'Norte de Minas Gerais', 
  -15.8267, 
  -45.8601, 
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800',
  ARRAY['Cerrado', 'Geraizeiros', 'Extrativismo']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  location_name = EXCLUDED.location_name,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags;

-- 3. Garantir a existência da coluna curiosity_clue se não foi criada ainda
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS curiosity_clue text;

-- 4. Inserir Produtos de Teste com Slugs Únicos, Coordenadas e Pistas de Curiosidade
INSERT INTO public.products (id, slug, name, description, sustainable_importance, traditional_knowledge, curiosity_clue, community_id, state, region, biome, latitude, longitude, image_url) VALUES 
(
  '11000000-0000-0000-0000-000000000001', 
  'oleo-de-andiroba', 
  'Óleo de Andiroba', 
  'Um óleo com propriedades cicatrizantes, anti-inflamatórias e repelentes, extraído a frio das sementes nativas nas profundezas da Amazônia.', 
  'Colheita feita sustentavelmente do chão da floresta para preservar as árvores centenárias em pé.', 
  'Usado secularmente pelos ribeirinhos como repelente natural contra insetos e no alívio de contusões.', 
  'Este óleo medicinal é extraído a frio a partir de sementes colhidas no chão da Floresta Amazônica.',
  'c1000000-0000-0000-0000-000000000001', 
  'Pará', 
  'Norte', 
  'Amazônia', 
  -3.4653, 
  -55.2159, 
  'https://images.unsplash.com/photo-1611078482436-e0f317415494?q=80&w=800'
),
(
  '22000000-0000-0000-0000-000000000002', 
  'geleia-de-umbu', 
  'Geleia de Umbu', 
  'Doce artesanal feito da fruta ácida e suculenta do umbuzeiro, a "árvore que dá de beber" no Brasil profundo.', 
  'Garante renda para mulheres do sertão durante toda a entressafra e ajuda na valorização e preservação do bioma Caatinga.', 
  'As raízes do umbuzeiro armazenam até mil litros de água, permitindo que a planta sobreviva a longas secas.', 
  'Este doce é feito com o fruto de uma árvore cujas raízes conseguem armazenar até mil litros de água para enfrentar a seca.',
  'c2000000-0000-0000-0000-000000000002', 
  'Bahia', 
  'Nordeste', 
  'Caatinga', 
  -9.8450, 
  -40.1012, 
  'https://images.unsplash.com/photo-1582293041079-7814c2f122bf?q=80&w=800'
),
(
  '33000000-0000-0000-0000-000000000003', 
  'farinha-de-coco-indigena', 
  'Farinha de Coco Indígena', 
  'Farinha nutritiva produzida através do aproveitamento integral do coco, seguindo técnicas ancestrais de secagem ao sol.', 
  'Processo zero desperdício. Cascas e fibras viram adubo e artesanato.', 
  'O coco é ralado em ferramentas feitas de conchas ou madeira nativa raspada.', 
  'O preparo tradicional desta farinha indígena envolve ralar o coco usando conchas ou pedaços de madeira nativa raspada.',
  'c1000000-0000-0000-0000-000000000001', 
  'Amazonas', 
  'Norte', 
  'Amazônia', 
  -2.4653, 
  -54.2159, 
  'https://images.unsplash.com/photo-1550505183-4ee91d3cc277?q=80&w=800'
),
(
  '44000000-0000-0000-0000-000000000004', 
  'castanha-de-baru-torrada', 
  'Castanha de Baru Torrada', 
  'Amêndoa nativa do Cerrado, incrivelmente nutritiva e com sabor que lembra o amendoim, torrada de forma artesanal no tacho.', 
  'Coleta extrativista fortalece a economia local, evitando o desmatamento do Cerrado para a pecuária.', 
  'A quebra do coco duro do Baru requer ferramentas manuais pesadas e muita técnica para não amassar a amêndoa.', 
  'Esta semente extremamente nutritiva do Cerrado possui uma casca tão rígida que exige ferramentas de metal pesadas e grande habilidade manual para abrir.',
  'c3000000-0000-0000-0000-000000000003', 
  'Minas Gerais', 
  'Sudeste', 
  'Cerrado', 
  -15.8267, 
  -45.8601, 
  'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800'
),
(
  '55000000-0000-0000-0000-000000000005', 
  'mel-de-abelha-urucu', 
  'Mel de Abelha Uruçu', 
  'Mel claro, fluido e de sabor levemente cítrico, produzido por abelhas nativas sem ferrão em áreas preservadas.', 
  'A meliponicultura exige o plantio de maras nativas, promovendo o reflorestamento ativo do bioma.', 
  'As abelhas Uruçu ("abelha grande" em Tupi) eram manejadas por indígenas muito antes da colonização.', 
  'Este mel fluido e de sabor cítrico é produzido por abelhas nativas sem ferrão cujo nome significa abelha grande na língua tupi antiga.',
  'c2000000-0000-0000-0000-000000000002', 
  'Pernambuco', 
  'Nordeste', 
  'Caatinga', 
  -11.8450, 
  -38.1012, 
  'https://images.unsplash.com/photo-1587049352847-ecdb6f7cb93b?q=80&w=800'
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sustainable_importance = EXCLUDED.sustainable_importance,
  traditional_knowledge = EXCLUDED.traditional_knowledge,
  curiosity_clue = EXCLUDED.curiosity_clue,
  community_id = EXCLUDED.community_id,
  state = EXCLUDED.state,
  region = EXCLUDED.region,
  biome = EXCLUDED.biome,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  image_url = EXCLUDED.image_url;

-- 4. Inserir Curtidas Iniciais
INSERT INTO public.likes (product_id, count) VALUES 
('11000000-0000-0000-0000-000000000001', 42),
('22000000-0000-0000-0000-000000000002', 28),
('33000000-0000-0000-0000-000000000003', 15),
('44000000-0000-0000-0000-000000000004', 37),
('55000000-0000-0000-0000-000000000005', 19)
ON CONFLICT (product_id) DO UPDATE SET
  count = EXCLUDED.count;

-- 5. Inserir Comentários Iniciais (Mural de Saberes)
-- Como o ID é autogerado e não queremos duplicar os mesmos comentários toda vez que rodar,
-- deletamos comentários existentes destes produtos antes de reinseri-los.
DELETE FROM public.comments WHERE product_id IN (
  '11000000-0000-0000-0000-000000000001',
  '22000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000003',
  '44000000-0000-0000-0000-000000000004',
  '55000000-0000-0000-0000-000000000005'
);

INSERT INTO public.comments (product_id, author_name, content) VALUES 
('11000000-0000-0000-0000-000000000001', 'Maria Silva', 'O cheiro desse óleo me lembra muito a casa da minha avó. Essencial!'),
('11000000-0000-0000-0000-000000000001', 'João Mendes', 'Excelente produto para massagens pós-treino.'),
('22000000-0000-0000-0000-000000000002', 'Ana Souza', 'O melhor doce que já provei! O equilíbrio perfeito entre o ácido e o doce.'),
('33000000-0000-0000-0000-000000000003', 'Carlos Lima', 'Essa farinha é muito crocante e nutritiva. Recomendo com iogurte!'),
('44000000-0000-0000-0000-000000000004', 'Luana Costa', 'Baru é sensacional, além de ser super saudável ajuda na preservação do cerrado.'),
('55000000-0000-0000-0000-000000000005', 'Pedro Santos', 'Mel incrível, sabor único. O fato de ser de abelha sem ferrão nativa faz toda a diferença.');
