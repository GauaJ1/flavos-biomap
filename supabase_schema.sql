-- ==========================================
-- ESTRUTURA DO BANCO DE DADOS FLAVOS BIOMAP
-- Copie este código e cole no SQL Editor do Supabase
-- ==========================================

-- 1. Criação da Tabela de Comunidades
CREATE TABLE public.communities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  location_name text NOT NULL,
  latitude float,
  longitude float,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criação da Tabela de Produtos (Relacionada a Communities)
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE,
  name text NOT NULL,
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

-- 3. Criação da Tabela de Curtidas (Mural de Saberes)
CREATE TABLE public.likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Criação da Tabela de Comentários (Mural de Saberes)
CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- INSERÇÃO DA CARGA INICIAL DE DADOS (MOCKS)
-- ==========================================

-- Inserindo Comunidades
INSERT INTO public.communities (id, name, description, location_name, latitude, longitude, image_url) VALUES 
('c1000000-0000-0000-0000-000000000001', 'Cooperativa Extrativista da Amazônia', 'Comunidade ribeirinha que vive da coleta sustentável...', 'Reserva Tapajós - Pará', -3.4653, -55.2159, 'https://images.unsplash.com/photo-1518182170546-076616fd42bf?q=80&w=800'),
('c2000000-0000-0000-0000-000000000002', 'Mulheres do Sertão Produtivo', 'Cooperativa formada por mulheres camponesas...', 'Sertão do São Francisco - Bahia', -9.8450, -40.1012, 'https://images.unsplash.com/photo-1596773539958-38ce518903e1?q=80&w=800'),
('c3000000-0000-0000-0000-000000000003', 'Associação de Catação do Cerrado', 'Famílias geraizeiras que coletam frutos do Cerrado...', 'Norte de Minas Gerais', -15.8267, -45.8601, 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800');

-- Inserindo Produtos
INSERT INTO public.products (id, community_id, name, description, sustainable_importance, traditional_knowledge, state, region, biome, latitude, longitude, image_url) VALUES 
('11000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Óleo de Andiroba', 'Um óleo com propriedades cicatrizantes...', 'Colheita feita sustentavelmente do chão...', 'Usado secularmente pelos ribeirinhos...', 'Pará', 'Norte', 'Amazônia', -3.4653, -55.2159, 'https://images.unsplash.com/photo-1611078482436-e0f317415494?q=80&w=800'),
('22000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000002', 'Geleia de Umbu', 'Doce artesanal feito da fruta ácida...', 'Garante renda para mulheres do sertão...', 'As raízes do umbuzeiro armazenam...', 'Bahia', 'Nordeste', 'Caatinga', -9.8450, -40.1012, 'https://images.unsplash.com/photo-1582293041079-7814c2f122bf?q=80&w=800');

-- Inserindo Curtidas Iniciais
INSERT INTO public.likes (product_id, count) VALUES 
('11000000-0000-0000-0000-000000000001', 24),
('22000000-0000-0000-0000-000000000002', 12);

-- Inserindo Comentários Iniciais
INSERT INTO public.comments (product_id, author_name, content) VALUES 
('11000000-0000-0000-0000-000000000001', 'Maria Silva', 'O cheiro desse óleo me lembra muito a casa da minha avó. Essencial!'),
('11000000-0000-0000-0000-000000000001', 'João Mendes', 'Excelente produto para massagens pós-treino.'),
('22000000-0000-0000-0000-000000000002', 'Ana Souza', 'O melhor doce que já provei! O equilíbrio perfeito entre o ácido e o doce.');

-- ==========================================
-- CONFIGURANDO POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================
-- Por enquanto, como é um app de visitantes, vamos permitir leitura e escrita pública nas interações

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura livre para Comunidades" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Leitura livre para Produtos" ON public.products FOR SELECT USING (true);

-- Mural de saberes (Leitura e Inserção pública)
CREATE POLICY "Leitura livre para Curtidas" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Atualização livre para Curtidas" ON public.likes FOR UPDATE USING (true);

CREATE POLICY "Leitura livre para Comentários" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Inserção livre para Comentários" ON public.comments FOR INSERT WITH CHECK (true);
