export interface NewsItem {
  title: string;
  date: string;
  description?: string;
  media: string;
  link: string;
}

export interface NewsResponse {
  keyword: string;
  results: NewsItem[];
  count: number;
}

export interface NewsSearchParams {
  keyword: string;
} 