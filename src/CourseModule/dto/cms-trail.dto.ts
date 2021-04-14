export interface CMSTrailDTO {
  id: number;
  nome: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  ordenacao_da_trilhas: OrdenacaoDaTrilha[];
}

export interface OrdenacaoDaTrilha {
  id: number;
  curso: number;
  ordem: number;
  trilha: number;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}
