export interface catalogueInterface {
  id?: number | string;
  name: string;
  description: string;
}
export interface catalogueQuery {
  nameCont?: string;
}

export interface catalogueModal {
  typeCatalogue: string;
  title: string;
  catalogue?: catalogueInterface;
}
export interface pagDto<T> {
  items: T[];
  total: number;
  index: number;
  totalPages: number;
}

export interface pagOptions<t> {
  pageSize?: number;
  pageNumber?: number;
  query?: t;
  all?: boolean;
}

export interface localStorExp {
  key: string;
  exp: Date | null;
}
