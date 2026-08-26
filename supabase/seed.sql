-- =========================================================================
-- BANCO DE DADOS OFICIAL - SEED (3 PRODUTOS PRINCIPAIS)
-- =========================================================================

TRUNCATE TABLE public.comments CASCADE;
TRUNCATE TABLE public.likes CASCADE;
TRUNCATE TABLE public.products CASCADE;
TRUNCATE TABLE public.communities CASCADE;
TRUNCATE TABLE public.product_suggestions CASCADE;

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

INSERT INTO public.likes (product_id, count, created_at) VALUES 
('11000000-0000-0000-0000-000000000001', 48, NOW()),
('22000000-0000-0000-0000-000000000002', 36, NOW()),
('33000000-0000-0000-0000-000000000003', 55, NOW());

INSERT INTO public.comments (product_id, author_name, content, created_at) VALUES 
('11000000-0000-0000-0000-000000000001', 'Maria Clara Santos', 'Esse óleo é milagroso para picadas de inseto e dores musculares. Incrível saber que vem do Tapajós!', NOW()),
('11000000-0000-0000-0000-000000000001', 'Prof. Thiago Rezende', 'Trabalho lindo de valorização do manejo ribeirinho. A floresta agradece.', NOW()),
('22000000-0000-0000-0000-000000000002', 'Ana Beatriz Souza', 'A geleia de umbu tem um azedinho perfeito com queijo canastra. Parabéns às mulheres da Caatinga!', NOW()),
('33000000-0000-0000-0000-000000000003', 'Mariana Alvarenga', 'Esse café feito no pilão tem notas florais e defumadas únicas. Uma verdadeira joia caipira!', NOW()),
('33000000-0000-0000-0000-000000000003', 'Seu Zé do Café', 'A batida do pilão é o coração da nossa serra. Muito orgulho de ver nosso café no app!', NOW());
