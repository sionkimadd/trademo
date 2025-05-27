import { useRef, useEffect } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { TimeFrame, CandlestickDataWithVolume } from '../types/chart';
import { formatChartNumber, formatChartDate, prepareVolumeData } from '../utils/formatters';

export interface ChartHookResult {
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
}

const CHART_COLORS = {
  background: '#232939',
  text: '#d1d5db',
  grid: '#374151',
  border: '#4b5563',
  crosshair: '#758CA3',
  up: '#4db6ac',
  down: '#e75f77',
  volume: '#374151',
  tooltip: {
    bg: '#1f2937',
    border: '#374151',
    label: '#9ca3af',
    value: '#d1d5db'
  }
};

const CHART_OPTIONS = {
  layout: {
    background: { color: CHART_COLORS.background },
    textColor: CHART_COLORS.text,
  },
  grid: {
    vertLines: { color: CHART_COLORS.grid },
    horzLines: { color: CHART_COLORS.grid },
  },
  crosshair: {
    mode: 1,
  },
  rightPriceScale: {
    borderColor: CHART_COLORS.border,
  },
  timeScale: {
    borderColor: CHART_COLORS.border,
  },
};

const TOOLTIP_STYLES = {
  width: '200px',
  height: 'auto',
  position: 'absolute',
  display: 'none',
  padding: '8px',
  boxSizing: 'border-box',
  fontSize: '12px',
  color: CHART_COLORS.text,
  backgroundColor: CHART_COLORS.tooltip.bg,
  border: `1px solid ${CHART_COLORS.tooltip.border}`,
  borderRadius: '4px',
  pointerEvents: 'none',
  fontFamily: 'monospace',
  zIndex: '1000'
} as const;

function createTooltipElement(container: HTMLDivElement): HTMLDivElement {
  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, TOOLTIP_STYLES);
  container.appendChild(tooltip);
  return tooltip;
}

function createTooltipContent(data: CandlestickDataWithVolume, dateStr: string, volume?: number): string {
  return `
    <div style="margin-bottom: 4px; font-weight: bold;">${dateStr}</div>
    <div style="color: ${CHART_COLORS.tooltip.label};">O: <span style="color: ${CHART_COLORS.tooltip.value};">$${formatChartNumber(data.open)}</span></div>
    <div style="color: ${CHART_COLORS.tooltip.label};">H: <span style="color: ${CHART_COLORS.tooltip.value};">$${formatChartNumber(data.high)}</span></div>
    <div style="color: ${CHART_COLORS.tooltip.label};">L: <span style="color: ${CHART_COLORS.tooltip.value};">$${formatChartNumber(data.low)}</span></div>
    <div style="color: ${CHART_COLORS.tooltip.label};">C: <span style="color: ${CHART_COLORS.tooltip.value};">$${formatChartNumber(data.close)}</span></div>
    ${volume ? `<div style="color: ${CHART_COLORS.tooltip.label};">V: <span style="color: ${CHART_COLORS.tooltip.value};">${formatChartNumber(volume)}</span></div>` : ''}
  `;
}

function calculateTooltipPosition(
  mouseX: number,
  mouseY: number,
  tooltipWidth: number,
  tooltipHeight: number,
  containerWidth: number,
  containerHeight: number
): { left: number; top: number } {
  let left = mouseX + 10;
  let top = mouseY - 10;

  if (left + tooltipWidth > containerWidth) {
    left = mouseX - tooltipWidth - 10;
  }
  if (top + tooltipHeight > containerHeight) {
    top = mouseY - tooltipHeight - 10;
  }
  if (left < 0) left = 10;
  if (top < 0) top = 10;

  return { left, top };
}

export function useChart(data: CandlestickDataWithVolume[], timeFrame: TimeFrame): ChartHookResult {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const cleanup = () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        volumeSeriesRef.current = null;
      }
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };

    cleanup();

    tooltipRef.current = createTooltipElement(chartContainerRef.current);

    const chart = createChart(chartContainerRef.current, {
      ...CHART_OPTIONS,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: { time: true, price: true },
        axisDoubleClickReset: { time: true, price: true },
        mouseWheel: true,
        pinch: true,
      },
      timeScale: {
        ...CHART_OPTIONS.timeScale,
        timeVisible: true,
        secondsVisible: timeFrame === '1m',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: CHART_COLORS.crosshair,
          style: 2,
        },
        horzLine: {
          width: 1,
          color: CHART_COLORS.crosshair,
          style: 2,
        },
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: CHART_COLORS.up,
      downColor: CHART_COLORS.down,
      borderVisible: false,
      wickUpColor: CHART_COLORS.up,
      wickDownColor: CHART_COLORS.down,
      priceScaleId: 'right',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: CHART_COLORS.volume,
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.7, bottom: 0 },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    if (data.length > 0) {
      candlestickSeries.setData(data);
      const volumeData = prepareVolumeData(data);
      if (volumeData.length > 0) {
        volumeSeries.setData(volumeData);
      }
    }

    chart.subscribeCrosshairMove(param => {
      if (!param.point || !param.time || !tooltipRef.current) {
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
        return;
      }

      const candlePrice = param.seriesData.get(candlestickSeries);
      if (!candlePrice || !chartContainerRef.current) {
        tooltipRef.current.style.display = 'none';
        return;
      }

      const candleData = candlePrice as CandlestickDataWithVolume;
      const dateStr = formatChartDate(param.time as number);
      const originalData = data.find(item => item.time === param.time);
      
      tooltipRef.current.style.display = 'block';
      tooltipRef.current.innerHTML = createTooltipContent(candleData, dateStr, originalData?.volume);

      const { left, top } = calculateTooltipPosition(
        param.point.x,
        param.point.y,
        tooltipRef.current.offsetWidth,
        tooltipRef.current.offsetHeight,
        chartContainerRef.current.clientWidth,
        chartContainerRef.current.clientHeight
      );

      tooltipRef.current.style.left = `${left}px`;
      tooltipRef.current.style.top = `${top}px`;
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [timeFrame]);

  useEffect(() => {
    if (candlestickSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data);
      
      if (volumeSeriesRef.current) {
        const volumeData = prepareVolumeData(data);
        if (volumeData.length > 0) {
          volumeSeriesRef.current.setData(volumeData);
        }
      }
    }
  }, [data]);

  return { chartContainerRef };
}