export interface Community {
  id: string;
  name: string;
  description: string;
  location_name: string;
  image_url: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}
