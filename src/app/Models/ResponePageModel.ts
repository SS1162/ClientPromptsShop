export class ResponePageModel<T> {
  data!: T[];
  totalItems!: number;
  pageSize!: number;
  currentPage!: number;
  hasPreviousPage!: boolean;
  hasNextPage!: boolean;
}