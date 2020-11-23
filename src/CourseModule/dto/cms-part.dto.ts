export class CMSPartDTO {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  aula: Aula;
  exercicio: string;
  video: string;
  exercicios: Exercicio[];
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

export class Exercicio {
  id: number;
  titulo: string;
  pergunta: string;
  'primeira_alternativa': string;
  'segunda_alternativa': string;
  'terceira_alternativa': string;
  'quarta_alternativa': string;
  'alternativa_certa': string;
  'published_at': Date;
  'created_at': Date;
  'updated_at': Date;
  ordem: number;
  parte: number;
}
