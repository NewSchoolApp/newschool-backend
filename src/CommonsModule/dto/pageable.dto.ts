export class PageableDTO<T> {
  content: T[];
  size: number;
  totalElements: number;
  totalPages: number;
  limit: number;
  page: number;
  offset: number;

  constructor({
    content,
    totalElements,
    limit,
    page,
  }: {
    content: T[];
    totalElements: number;
    limit: number;
    page: number;
  }) {
    this.content = content;
    this.totalElements = totalElements;
    this.limit = limit;
    this.page = page;
    this.size = content.length;
    this.totalPages = Math.floor(totalElements / page);
    this.offset = limit * (page - 1);
  }
}

export type Pageable<T> = PageableDTO<T>;
