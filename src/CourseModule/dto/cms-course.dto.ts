export class CMSCourseDTO {
  id: string;
  Titulo: string;
  descricao: string;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  title: string;
  description: string;
  authorName: string;
  authorDescription: string;
  workload: number;
  enabled: boolean;
  titulo: string;
  nomeDoAutor: string;
  descricaoDoAutor: string;
  horas: number;
  habilitado: boolean;
  capa: Capa;
  aulas: Aula[];
}

export class Aula {
  id: number;
  Titulo: string;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  title: string;
  description: string;
  'seq_num': number;
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
