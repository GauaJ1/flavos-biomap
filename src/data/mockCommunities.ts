import { Community } from '../types/community';

export const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'Cooperativa Extrativista da Amazônia',
    description: 'Comunidade ribeirinha que vive da coleta sustentável de sementes e óleos amazônicos, preservando a floresta em pé através do extrativismo consciente e circular.',
    location_name: 'Reserva Tapajós - Pará',
    image_url: 'https://images.unsplash.com/photo-1518182170546-076616fd42bf?q=80&w=800&auto=format&fit=crop',
    latitude: -3.4653,
    longitude: -55.2159,
    created_at: new Date().toISOString()
  },
  {
    id: 'c2',
    name: 'Mulheres do Sertão Produtivo',
    description: 'Cooperativa formada por mulheres camponesas que processam os frutos nativos da Caatinga, gerando renda e fortalecendo o papel feminino na agricultura familiar.',
    location_name: 'Sertão do São Francisco - Bahia',
    image_url: 'https://images.unsplash.com/photo-1596773539958-38ce518903e1?q=80&w=800&auto=format&fit=crop',
    latitude: -9.8450,
    longitude: -40.1012,
    created_at: new Date().toISOString()
  },
  {
    id: 'c3',
    name: 'Associação de Catação do Cerrado',
    description: 'Famílias geraizeiras que coletam frutos do Cerrado brasileiro, utilizando técnicas passadas de geração em geração, mantendo a biodiversidade da savana brasileira.',
    location_name: 'Norte de Minas Gerais',
    image_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop',
    latitude: -15.8267,
    longitude: -45.8601,
    created_at: new Date().toISOString()
  }
];
