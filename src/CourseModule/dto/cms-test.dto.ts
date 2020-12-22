export class CMSTestDTO {
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
  parte: Part;
}

export class Part {
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
  videoUrl: string;
}
