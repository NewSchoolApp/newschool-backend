export interface CMSPilarDTO {
  id: number;
  nome: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  cursos: Curso[];
}

export interface Curso {
  id: number;
  descricao: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  titulo: string;
  nomeDoAutor: string;
  descricaoDoAutor: string;
  horas: number;
  slug: string;
  pilar: number;
  capa: Capa;
}

export interface Capa {
  id: number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  created_at: Date;
  updated_at: Date;
}

export interface Formats {
  small: Large;
  medium?: Large;
  thumbnail: Large;
  large?: Large;
}

export interface Large {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
}
