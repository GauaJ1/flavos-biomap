import { supabase } from './supabase';
import { Like } from '../types/like';

export const LikesAPI = {
  // Busca a contagem de curtidas do produto. Se não existir o registro, tenta criar.
  async getLikesByProductId(productId: string): Promise<number> {
    const { data, error } = await supabase
      .from('likes')
      .select('count')
      .eq('product_id', productId)
      .single();

    if (error) {
      // Se deu erro porque não existe (PGRST116), vamos criar o registro do zero.
      if (error.code === 'PGRST116') {
         await this.initializeLikeRecord(productId);
         return 0;
      }
      console.error('Erro ao buscar curtidas:', error.message);
      return 0;
    }

    return data?.count || 0;
  },

  // Inicializa o registro de curtidas se ele não existir
  async initializeLikeRecord(productId: string) {
    const { error } = await supabase.rpc('toggle_like', { 
      p_product_id: productId, 
      p_increment: 0 
    });
    if(error) console.error('Erro ao inicializar curtidas', error);
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
