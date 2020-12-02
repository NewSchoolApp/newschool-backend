export class CMSCourseDTO {
  id: number;
  descricao: string;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  titulo: string;
  slug: string;
  nomeDoAutor: string;
  descricaoDoAutor: string;
  horas: number;
  capa: Capa;
  aulas: Aula[];
}

export class Aula {
  id: number;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  curso: number;
  ordem: number;
  titulo: string;
  descricao: string;
}

export class Capa {
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
  previewUrl: string;
  provider: string;
  'provider_metadata': string;
  'created_at': Date;
  'updated_at': Date;
}

export class Formats {
  small: Medium;
  medium: Medium;
  thumbnail: Medium;
}

export class Medium {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string;
  size: number;
  width: number;
  height: number;
}
