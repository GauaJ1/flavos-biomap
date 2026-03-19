import { supabase } from './supabase';
import { Comment } from '../types/comment';

export const CommentsAPI = {
  // Busca comentários de um produto específico
  async getCommentsByProductId(productId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar comentários:', error.message);
      return [];
    }

    // Mapeamento para nossa interface local (camelCase)
    return data.map(item => ({
      id: item.id,
      productId: item.product_id,
      authorName: item.author_name,
      content: item.content,
      createdAt: item.created_at,
    }));
  },

  // Insere um novo comentário anônimo
  async addComment(productId: string, content: string, authorName = 'Visitante (Você)'): Promise<Comment | null> {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          product_id: productId, 
          author_name: authorName, 
          content 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir comentário:', error.message);
      return null;
    }

    return {
      id: data.id,
      productId: data.product_id,
      authorName: data.author_name,
      content: data.content,
      createdAt: data.created_at,
    };
  }
};
