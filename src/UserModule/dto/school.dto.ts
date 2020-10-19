export interface School {
  anoCenso: number;
  cod: number;
  nome: string;
  codCidade: number;
  cidade: string;
  estado: string;
  regiao: string;
  situacaoFuncionamento: number;
  dependenciaAdministrativa: number;
  idebAI: number;
  idebAF: number;
  enemMediaGeral: number;
  situacaoFuncionamentoTxt: string;
  dependenciaAdministrativaTxt: string;
}
export type Schools = [number, School[]];
