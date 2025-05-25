import { CandlestickData } from 'lightweight-charts';

export type TimeFrame = '1m' | '1h' | '1d' | '1wk' | '1mo';

export interface CandlestickDataWithVolume extends CandlestickData {
  volume?: number;
}

export interface CandlestickChartProps {
  symbol: string;
  initialData?: CandlestickDataWithVolume[];
}

export interface ApiCounterState {
  counts: Record<TimeFrame, number>;
  lastResetTimes: Record<TimeFrame, Date>;
}

export type ApiCounterAction = 
  | { type: 'INCREMENT'; timeframe: TimeFrame }
  | { type: 'RESET_COUNTER'; timeframe: TimeFrame; timestamp: Date };

export interface TimeframeButtonProps {
  tf: TimeFrame;
  currentTf: TimeFrame;
  label: string;
  updateTime: string;
  cycleInfo: string;
  onClick: (tf: TimeFrame) => void;
}