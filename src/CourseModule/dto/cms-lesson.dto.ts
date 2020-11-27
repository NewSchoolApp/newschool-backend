export class CMSLessonDTO {
  id: number;
  Titulo: string;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  title: string;
  description: string;
  'seq_num': number;
  curso: Curso;
  ordem: number;
  titulo: string;
  descricao: string;
  partes: Parte[];
}

export class Curso {
  id: string;
  descricao: string;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  titulo: string;
  nomeDoAutor: string;
  descricaoDoAutor: string;
  horas: number;
  capa: Capa;
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
  small: Format;
  medium: Format;
  thumbnail: Format;
}

export class Format {
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

export class Parte {
  id: number;
  titulo: string;
  descricao: string;
  ordem: number;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  aula: number;
  exercicio: string;
  video: string;
}
