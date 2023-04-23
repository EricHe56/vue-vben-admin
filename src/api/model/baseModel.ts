export interface BasicPageParams {
  page: number;
  pageSize: number;
  field?: string;
  order?: string;
}

export interface BasicFetchResult<T> {
  list: T[];
  total: number;
}
