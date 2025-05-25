import { CandlestickDataWithVolume, TimeFrame } from './chart';

export interface ChartDataResponse {
  symbol: string;
  timeframe: TimeFrame;
  period: string;
  data: CandlestickDataWithVolume[];
}

export interface ApiErrorResponse {
  detail: string;
}

export const SUPPORTED_TIMEFRAMES: TimeFrame[] = ['1m', '1h', '1d', '1wk', '1mo'];

export const API_PATHS = {
  CHART: '/chart',
  STOCK: '/stock',
  PORTFOLIO: '/portfolio',
  ORDER: '/order'
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';