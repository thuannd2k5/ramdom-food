export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Food {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  categoryId?: string | Category;
  category?: Category;
  mealTypes: string[];
  priceMin: number;
  priceMax: number;
  tags: string[];
  isPopular?: boolean;
}

export interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewsCount: number;
  priceLevel: string;
  distanceMeters: number;
  distanceText: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  authProvider: string;
}

export interface FilterState {
  mealType: string;
  maxPrice?: number;
  tag?: string;
}
