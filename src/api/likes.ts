import { supabase } from './supabase';
import { Like } from '../types/like';

export const LikesAPI = {
  // Busca a contagem de curtidas do produto. Se não existir o registro, retorna 0.
  async getLikesByProductId(productId: string): Promise<number> {
    const { data, error } = await supabase
      .from('likes')
      .select('count')
      .eq('product_id', productId)
      .single();

    if (error) {
      // Se deu erro porque não existe (PGRST116), significa que possui 0 curtidas.
      if (error.code === 'PGRST116') {
         return 0;
      }
      console.error('Erro ao buscar curtidas:', error.message);
      return 0;
    }

    return data?.count || 0;
  },

  // Atualiza as curtidas usando a Função SQL Segura (RPC) no servidor
  async toggleLike(productId: string, increment: boolean): Promise<boolean> {
    const { error } = await supabase.rpc('toggle_like', {
      p_product_id: productId,
      p_increment: increment ? 1 : -1
    });

    if (error) {
      console.error('Erro ao atualizar curtidas via RPC:', error.message);
      return false;
    }
    
    return true;
  }
};
