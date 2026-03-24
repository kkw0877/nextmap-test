export interface StoreType {
  id: number;
  phone?: string | null;
  address?: string | null;
  lat?: string | null;
  lng?: string | null;
  name?: string | null;
  category?: string | null;
  storeType?: string | null;
  foodCertifyName?: string | null;
  likes?: LikeInterface[];
}

interface UserType {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface LikeInterface {
  id: number;
  storeId: number;
  userId: number;
  store?: StoreType;
}

export interface CommentInterface {
  id: number;
  storeId: number;
  userId: number;
  store?: StoreType;
  body: string
  user?: UserType;
  createdAt: Date;
}

export interface LikeApiResponse {
  data: LikeInterface[];
  totalPage?: number;
  page?: number;
}

export interface CommentApiResponse {
  data: CommentInterface[];
  totalPage?: number;
  page?: number;
}

export interface StoreApiResponse {
  data: StoreType[]
  page?: number
  totalPage?: number
  totalCount?: number
}

export interface LocationType {
  lat?: string | null;
  lng?: string | null;
  zoom?: number;
}

export interface SearchType {
  q?: string;
  district?: string; 
}

// page: parseInt(page),
// data: stores,
// totalCount: count,
// totalPage: Math.ceil(count/10)