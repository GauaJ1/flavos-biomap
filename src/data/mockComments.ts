import { Comment } from '../types/comment';

export const mockComments: Comment[] = [
  {
    id: 'cmt-1',
    productId: '1',
    authorName: 'Maria Silva',
    content: 'O cheiro desse óleo me lembra muito a casa da minha avó. Essencial!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
  },
  {
    id: 'cmt-2',
    productId: '1',
    authorName: 'João Mendes',
    content: 'Excelente produto para massagens pós-treino.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
  },
  {
    id: 'cmt-3',
    productId: '2',
    authorName: 'Ana Souza',
    content: 'O melhor doce que já provei! O equilíbrio perfeito entre o ácido e o doce.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
  }
];
