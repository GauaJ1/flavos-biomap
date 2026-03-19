import { supabase } from './supabase';
import { Community } from '../types/community';

export const CommunitiesAPI = {
  async getCommunities(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*');

    if (error) {
      console.error('Erro ao buscar comunidades:', error.message);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      location_name: item.location_name,
      latitude: item.latitude,
      longitude: item.longitude,
      image_url: item.image_url,
      created_at: item.created_at,
    }));
  },

  async getCommunityById(id: string): Promise<Community | null> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar comunidade:', error.message);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      location_name: data.location_name,
      latitude: data.latitude,
      longitude: data.longitude,
      image_url: data.image_url,
      created_at: data.created_at,
    };
  }
};
