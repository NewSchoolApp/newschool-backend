export interface CMSCourseDTO {
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
  pilars: Pilar[];
  capa: Capa;
  aulas: Aula[];
  ordenacao_da_trilhas: Aula[];
}

export interface Pilar {
  id: number;
  nome: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Aula {
  id: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  curso: number;
  ordem: number;
  titulo?: string;
  descricao?: string;
  trilha?: number;
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
  small: Small;
  thumbnail: Small;
}

export interface Small {
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
