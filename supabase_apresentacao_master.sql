-- =========================================================================
-- BANCO DE DADOS OFICIAL PARA APRESENTAÇÃO - FLAVOS BIOMAP
-- =========================================================================
-- Copie todo este conteúdo e execute no SQL Editor do seu Supabase.
-- Ele garante que a estrutura esteja perfeita, insere 6 comunidades,
-- 8 produtos ricos de vários biomas, curtidas, comentários no mural
-- e 2 sugestões pendentes para a tela de moderação do Admin!
-- =========================================================================

-- 1. GARANTIR COLUNAS ESSENCIAIS
ALTER TABLE public.communities ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS curiosity_clue text;

-- 2. INSERÇÃO DE COMUNIDADES DA SOCIOBIODIVERSIDADE
INSERT INTO public.communities (id, name, description, location_name, latitude, longitude, image_url, tags, created_at)
VALUES 
(
  'c1000000-0000-0000-0000-000000000001',
  'Cooperativa Extrativista do Tapajós',
  'Comunidade ribeirinha e indígena que vive da coleta sustentável de sementes, resinas e óleos florestais nas margens do Rio Tapajós, mantendo a floresta em pé através do manejo consciente.',
  'Reserva Tapajós, Belterra - PA',
  -2.6371,
  -54.9392,
  'https://images.unsplash.com/photo-1518182170546-076616fd42bf?auto=format&fit=crop&w=800&q=80',
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
  'https://images.unsplash.com/photo-1596773539958-38ce518903e1?auto=format&fit=crop&w=800&q=80',
  ARRAY['Agricultura Familiar', 'Mulheres', 'Caatinga'],
  NOW()
),
(
  'c3000000-0000-0000-0000-000000000003',
  'Associação de Geraizeiros do Cerrado',
  'Famílias tradicionais geraizeiras que realizam a catação e beneficiamento de frutos e sementes do Cerrado, preservando as veredas e recarregando os aquíferos da região.',
  'Norte de Minas Gerais, Januária - MG',
  -15.4833,
  -44.3667,
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80',
  ARRAY['Geraizeiros', 'Cerrado', 'Guardiões das Águas'],
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000004',
  'Associação Quilombola do Vale do Ribeira',
  'Comunidade quilombola que preserva o cultivo agroecológico da cana-de-açúcar e o preparo do açúcar mascavo em tachos de cobre tradicionais, protegendo o maior remanescente contínuo de Mata Atlântica.',
  'Iporanga, Vale do Ribeira - SP',
  -24.5855,
  -48.5935,
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  ARRAY['Quilombola', 'Agroecologia', 'Mata Atlântica'],
  NOW()
),
(
  'c5000000-0000-0000-0000-000000000005',
  'Coletivo de Mulheres Caipiras da Serra',
  'Grupo de agricultoras familiares da Serra da Mantiqueira que mantém viva a tradição da colheita manual, torra artesanal no fogão a lenha e moagem no pilão rústico de madeira.',
  'Serra da Mantiqueira, São Lourenço - MG',
  -22.1158,
  -45.0544,
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
  ARRAY['Cultura Caipira', 'Artesanal', 'Mantiqueira'],
  NOW()
),
(
  'c6000000-0000-0000-0000-000000000006',
  'Movimento Interestadual das Quebradeiras de Coco Babaçu',
  'Milhares de mulheres trabalhadoras rurais que defendem as florestas de babaçuais livres, extraindo óleos, farinhas e artesanato com respeito aos ciclos da natureza.',
  'Bico do Papagaio / Cocais - MA',
  -4.8833,
  -43.3500,
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
  ARRAY['Quebradeiras', 'Babaçu Livre', 'Empoderamento Feminino'],
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  location_name = EXCLUDED.location_name,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  image_url = EXCLUDED.image_url,
  tags = EXCLUDED.tags;

-- 3. INSERÇÃO DOS PRODUTOS DA SOCIOBIODIVERSIDADE
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
  'https://images.unsplash.com/photo-1582293041079-7814c2f122bf?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '33000000-0000-0000-0000-000000000003',
  'acucar-mascavo',
  'Açúcar Mascavo Quilombola',
  'Açúcar bruto e não refinado obtido da fervura e batimento manual da garapa de cana cultivada em clareiras agroflorestais do Vale do Ribeira.',
  'A produção em pequena escala dispensa queimadas da palha e adubos químicos, mantendo os mananciais hídricos da Mata Atlântica intocados.',
  'A garapa é apurada em tachos de cobre aquecidos a lenha de poda até dar o ponto de melado, sendo vigorosamente batida em gamelas de madeira até cristalizar.',
  'PISTA DO PRODUTOR: Um doce escuro e nutritivo, nascido do caldo fervido lentamente no tacho de cobre, preservando a cor, o aroma e os minerais da terra...',
  'c4000000-0000-0000-0000-000000000004',
  'SP',
  'Sudeste',
  'Mata Atlântica',
  -24.5855,
  -48.5935,
  'https://images.unsplash.com/photo-1581009137042-c552e4856c7d?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '44000000-0000-0000-0000-000000000004',
  'cafe-pilao',
  'Café Socado no Pilão',
  'Café agroecológico cultivado nas montanhas da Mantiqueira, colhido a dedo, seco em terreiro suspenso e triturado no clássico pilão de madeira caipira.',
  'Plantado à meia-sombra sob a copa de árvores nativas, funcionando como um refúgio e corredor ecológico para pássaros e insetos polinizadores.',
  'A torra em tacho no fogão a lenha seguida da socagem no pilão ainda morno libera óleos aromáticos com notas florais e toque amanteigado.',
  'PISTA DO PRODUTOR: Grãos colhidos nas montanhas, torrados no fogão de lenha e castigados na madeira para despertar um perfume que acorda a serra inteira...',
  'c5000000-0000-0000-0000-000000000005',
  'MG',
  'Sudeste',
  'Mata Atlântica',
  -22.1158,
  -45.0544,
  'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '55000000-0000-0000-0000-000000000005',
  'castanha-de-baru-torrada',
  'Castanha de Baru Torrada',
  'Amêndoa nativa do Cerrado, rica em proteínas, ferro e zinco, com sabor marcante que remete ao amendoim e ao cacau.',
  'O extrativismo sustentável do baru protege as árvores contra o avanço da pecuária extensiva, conservando o solo profundo do Cerrado.',
  'A quebra manual da casca ultrarresistente do fruto exige grande perícia em quebra-nozes de alavanca artesanais para não danificar a amêndoa.',
  'PISTA DO PRODUTOR: Uma semente dourada com casca rígida como pedra, guardiã de um sabor crocante e das águas profundas do Cerrado...',
  'c3000000-0000-0000-0000-000000000003',
  'MG',
  'Sudeste',
  'Cerrado',
  -15.4833,
  -44.3667,
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '66000000-0000-0000-0000-000000000006',
  'mel-de-abelha-urucu',
  'Mel de Abelha Uruçu Nativa',
  'Mel claro, fluido e com acidez elegante, produzido por abelhas sem ferrão nativas do Brasil (Melipona scutellaris).',
  'As abelhas nativas são responsáveis pela polinização de até 90% das árvores da Caatinga e Mata Atlântica, sendo vitais para a regeneração florestal.',
  'O mel é colhido através de sucção suave nas caixas racionais de meliponicultura, respeitando a reserva de alimento da colônia.',
  'PISTA DO PRODUTOR: Um néctar suave e medicinal produzido por guardiãs silenciosas sem ferrão cujo nome indígena significa abelha grande...',
  'c2000000-0000-0000-0000-000000000002',
  'BA',
  'Nordeste',
  'Caatinga',
  -9.4162,
  -40.5033,
  'https://images.unsplash.com/photo-1587049352847-ecdb6f7cb93b?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '77000000-0000-0000-0000-000000000007',
  'mesocarpo-de-babacu',
  'Farinha de Mesocarpo de Babaçu',
  'Farinha altamente nutritiva e sem glúten obtida da camada intermediária do coco babaçu, ideal para mingaus, pães e bolos funcionais.',
  'A quebra do babaçu garante o sustento autônomo de mais de 300 mil mulheres e preserva os babaçuais como patrimônio ecológico livre.',
  'Após a coleta, o coco é quebrado no machado com auxílio de uma maceta de madeira, separando a casca, o mesocarpo e as amêndoas.',
  'PISTA DO PRODUTOR: Um pó fino e nutritivo extraído do coração de uma palmeira sagrada pelas mãos de mulheres que protegem a floresta livre...',
  'c6000000-0000-0000-0000-000000000006',
  'MA',
  'Nordeste',
  'Cerrado',
  -4.8833,
  -43.3500,
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  NOW()
),
(
  '88000000-0000-0000-0000-000000000008',
  'cacau-selvagem-de-varzea',
  'Nibs de Cacau Selvagem da Várzea',
  'Cacau nativo de árvores que crescem espontaneamente nas margens alagadas dos rios amazônicos, com notas florais e frutadas intensas.',
  'O cacau de várzea dispensa qualquer desmatamento, prosperando nas cheias sazonais dos rios e mantendo o equilíbrio das margens fluviais.',
  'Os frutos são colhidos de canoa, fermentados em caixas de madeira nativa e secos lentamente no calor do sol amazônico.',
  'PISTA DO PRODUTOR: Amêndoas de chocolate puro nascidas em árvores que sobrevivem às grandes cheias dos rios, colhidas por quem navega a floresta...',
  'c1000000-0000-0000-0000-000000000001',
  'PA',
  'Norte',
  'Amazônia',
  -2.6371,
  -54.9392,
  'https://images.unsplash.com/photo-1548811579-017cf2a4268b?auto=format&fit=crop&w=800&q=80',
  NOW()
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

-- 4. CURTIDAS INICIAIS NO MURAL DE SABERES
INSERT INTO public.likes (product_id, count, created_at) VALUES 
('11000000-0000-0000-0000-000000000001', 48, NOW()),
('22000000-0000-0000-0000-000000000002', 36, NOW()),
('33000000-0000-0000-0000-000000000003', 42, NOW()),
('44000000-0000-0000-0000-000000000004', 55, NOW()),
('55000000-0000-0000-0000-000000000005', 29, NOW()),
('66000000-0000-0000-0000-000000000006', 64, NOW()),
('77000000-0000-0000-0000-000000000007', 22, NOW()),
('88000000-0000-0000-0000-000000000008', 39, NOW())
ON CONFLICT (product_id) DO UPDATE SET
  count = EXCLUDED.count;

-- 5. COMENTÁRIOS NO MURAL DE SABERES (RECARREGAMENTO LIMPO)
DELETE FROM public.comments WHERE product_id IN (
  '11000000-0000-0000-0000-000000000001',
  '22000000-0000-0000-0000-000000000002',
  '33000000-0000-0000-0000-000000000003',
  '44000000-0000-0000-0000-000000000004',
  '55000000-0000-0000-0000-000000000005',
  '66000000-0000-0000-0000-000000000006',
  '77000000-0000-0000-0000-000000000007',
  '88000000-0000-0000-0000-000000000008'
);

INSERT INTO public.comments (product_id, author_name, content, created_at) VALUES 
('11000000-0000-0000-0000-000000000001', 'Maria Clara Santos', 'Esse óleo é milagroso para picadas de inseto e dores musculares. Incrível saber que vem do Tapajós!', NOW()),
('11000000-0000-0000-0000-000000000001', 'Prof. Thiago Rezende', 'Trabalho lindo de valorização do manejo ribeirinho. A floresta agradece.', NOW()),
('22000000-0000-0000-0000-000000000002', 'Ana Beatriz Souza', 'A geleia de umbu tem um azedinho perfeito com queijo canastra. Parabéns às mulheres da Caatinga!', NOW()),
('33000000-0000-0000-0000-000000000003', 'Carlos Eduardo Lima', 'O sabor lembra muito o açúcar que minha avó trazia do interior. Doce na medida certa e com história.', NOW()),
('44000000-0000-0000-0000-000000000004', 'Mariana Alvarenga', 'Esse café feito no pilão tem notas florais e defumadas únicas. Uma verdadeira joia caipira!', NOW()),
('44000000-0000-0000-0000-000000000004', 'Seu Zé do Café', 'A batida do pilão é o coração da nossa serra. Muito orgulho de ver nosso café no app!', NOW()),
('55000000-0000-0000-0000-000000000005', 'Lucas Ferreira', 'O baru torrado é viciante e dá muita energia pro treino. Excelente fonte de proteína nativa.', NOW()),
('66000000-0000-0000-0000-000000000006', 'Dra. Gabriela Nunes', 'O mel de abelha sem ferrão tem um valor medicinal e gastronômico inestimável. Iniciativa nota 10!', NOW()),
('77000000-0000-0000-0000-000000000007', 'Francisca das Chagas', 'O babaçu é a vida de milhares de quebradeiras de coco. Viva a floresta livre!', NOW()),
('88000000-0000-0000-0000-000000000008', 'Chef Rodrigo Oliveira', 'Cacau de várzea puro tem uma complexidade aromática que poucos chocolates industriais alcançam.', NOW());

-- 6. SUGESTÕES DE PRODUTOS PENDENTES (PARA DEMONSTRAR A MODERAÇÃO NO ADMIN)
DELETE FROM public.product_suggestions WHERE submitter_name IN ('Dona Francisca Silva', 'Tiago Ribeiro Mendes');

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
