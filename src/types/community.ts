export interface Community {
  id: string;
  name: string;
  description: string;
  location_name: string;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  tags?: string[];
  created_at: string;
}
