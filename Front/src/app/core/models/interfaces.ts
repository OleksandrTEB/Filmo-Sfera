export interface registerRequest {
  username: string;
  email: string;
  password: string;
  country: string;
  checkboxStatus: boolean;
}

export interface loginRequest {
  email: string | undefined;
  password: string  | undefined;
}

export interface BaseResponse {
  success: boolean;
  message: string;
  admin: boolean;
  verified: boolean;
}

export interface UserNameResponse {
  username: string;
}

export interface ErrorResponse {
  success: boolean;
  message?: string;
  admin?: boolean
  verified: boolean;

  isErrorEmail?: boolean;
  isErrorPassword?: boolean;
  isErrorUsername?: boolean;
  isErrorAlready?: boolean;

  messageEmail?: string
  messagePassword?: string
  messageUsername?: string
  messageAlready?: string
}

export interface FilmInfo {
  id: number;
  nazwa: string;
  rok: string;
  opis: string;
  gatunek: string;
  obraz_filmu: string;
  ocena: number;
  poster?: string;
}

export interface FilmsResponse {
  success: boolean;
  films: FilmInfo[];
}

export interface filmInfo {
  id: number;
  nazwa: string;
  rok: string;
  opis: string;
  gatunek: string;
  obraz_filmu: string;
  trailer: string;
  video: string;
  ocena: number;
}

export interface Comment {
  id: number
  username: string;
  avatar: string;
  text: string;
  created_at: string;
}

export interface ResponseComments {
  success: boolean;
  comments: Comment[];
}

//----------------review----------------------

export interface listReview {
  id: number;
  username: string;
  avatar: string;
  text: string;
  rating: number;
  created_at: string;
}

export interface ResponseReview {
  success: boolean;
  reviews: listReview[];
}

export interface CountReview {
  success: boolean;
  count_reviews: number;
}



export interface UserComment {
  text: string;
  date: string;
}

export interface UserReview {
  text: string;
  date: string;
  rating: number;
}

export interface Films {
  film_id: number;
  film_title: string;
  film_image: string;
  comments: UserComment[];
  reviews: UserReview[];
}

export interface UserFilms {
  success: boolean;
  films: Films[]
}

//------verifided---------

export interface ResponseCode {
  success: boolean;
  message: string;
}

export interface WsComment {
  type: string;
}
