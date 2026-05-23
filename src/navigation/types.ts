import { Community } from '../types/community';

export type RootStackParamList = {
  Home: undefined;
  QRScanner: undefined;
  Products: undefined;
  ProductDetails: { productSlug: string };
  Community: { communityId: string, communityData?: Community };
  About: undefined;
  BiomeMap: undefined;
  SuggestProduct: undefined;
  TrackSuggestion: undefined;
};
