import { RankingQueryDTO } from '../dto/ranking-query.dto';

export class PageableRankingSwagger {
  content: RankingQueryDTO[];
  size: number;
  totalElements: number;
  totalPages: number;
  limit: number;
  page: number;
  offset: number;
}
