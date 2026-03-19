import { supabase } from './supabase';
import { Product } from '../types/product';

export const ProductsAPI = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Erro ao buscar produtos:', error.message);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description,
      image_url: item.image_url,
      sustainable_importance: item.sustainable_importance,
      traditional_knowledge: item.traditional_knowledge,
      community_id: item.community_id,
      state: item.state,
      region: item.region,
      biome: item.biome,
      latitude: item.latitude,
      longitude: item.longitude,
      created_at: item.created_at,
    }));
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar produto:', error.message);
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      sustainable_importance: data.sustainable_importance,
      traditional_knowledge: data.traditional_knowledge,
      community_id: data.community_id,
      state: data.state,
      region: data.region,
      biome: data.biome,
      latitude: data.latitude,
      longitude: data.longitude,
      created_at: data.created_at,
    };
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Erro ao buscar produto por slug:', error.message);
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      sustainable_importance: data.sustainable_importance,
      traditional_knowledge: data.traditional_knowledge,
      community_id: data.community_id,
      state: data.state,
      region: data.region,
      biome: data.biome,
      latitude: data.latitude,
      longitude: data.longitude,
      created_at: data.created_at,
    };
  }
};
