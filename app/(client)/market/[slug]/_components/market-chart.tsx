"use client";

import { Button } from "@heroui/button";
import { useEffect, useState } from "react";

import { ChartMultiLine } from "@/components/chart/chart-multi-line";
import { useLatestPrice } from "@/hooks/queries/use-price";

type TimeFrame = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

interface TimeframeSelectorProps {
  selectedTimeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
  loading?: boolean;
}

function TimeframeSelector({
  selectedTimeframe,
  onTimeframeChange,
  loading,
}: TimeframeSelectorProps) {
  const timeframes: { value: TimeFrame; label: string; description: string }[] =
    [
      { value: "1m", label: "1m", description: "1 minute intervals" },
      { value: "5m", label: "5m", description: "5 minute intervals" },
      { value: "15m", label: "15m", description: "15 minute intervals" },
      { value: "1h", label: "1h", description: "1 hour intervals" },
      { value: "4h", label: "4h", description: "4 hour intervals" },
      { value: "1d", label: "1d", description: "1 day intervals" },
    ];

  return (
    <div className="flex gap-1 p-1 bg-neutral-900/50 rounded-lg border border-neutral-800">
      {timeframes.map((tf) => (
        <Button
          key={tf.value}
          className={`
            text-xs font-medium transition-all duration-200 min-w-11
            ${
              selectedTimeframe === tf.value
                ? "bg-neutral-800 text-white shadow-sm"
                : "bg-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          disabled={loading}
          size="sm"
          variant="flat"
          onClick={() => onTimeframeChange(tf.value)}
        >
          {tf.label}
        </Button>
      ))}
    </div>
  );
}

interface MarketChartProps {
  marketId: string;
  className?: string;
  height?: number;
  defaultTimeframe?: TimeFrame;
}

export function MarketChart({
  marketId,
  className,
  height = 300,
  defaultTimeframe = "1m",
}: MarketChartProps) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<TimeFrame>(defaultTimeframe);
  const [visibleSeries, setVisibleSeries] = useState<string[]>([
    "volume-total",
  ]);
  const { data: priceData } = useLatestPrice({ symbol: "FLOW" });

  const fetchChartData = async (timeframe: TimeFrame) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/charts/market/${marketId}?series=volume&interval=${timeframe}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiResponse = await response.json();

      setChartData(apiResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (marketId) {
      fetchChartData(selectedTimeframe);
    }
  }, [marketId, selectedTimeframe]);

  const handleTimeframeChange = (timeframe: TimeFrame) => {
    setSelectedTimeframe(timeframe);
  };

  const handleSeriesToggle = (seriesId: string, visible: boolean) => {
    setVisibleSeries((prev) => {
      if (visible && !prev.includes(seriesId)) {
        return [...prev, seriesId];
      } else if (!visible && prev.includes(seriesId)) {
        return prev.filter((id) => id !== seriesId);
      }

      return prev;
    });
  };

  if (error) {
    return (
      <div className={className}>
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 text-center">
          <div className="text-red-400 font-medium mb-2">
            Error Loading Chart
          </div>
          <div className="text-neutral-500 text-sm mb-4">{error}</div>
          <Button
            className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            size="sm"
            variant="flat"
            onClick={() => fetchChartData(selectedTimeframe)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 relative z-0 ${className || ""}`}>
      <div className="py-4">
        {chartData ? (
          <ChartMultiLine
            data={chartData}
            enablePan={true}
            enableZoom={true}
            flowPriceUsd={priceData?.priceUsd}
            height={height}
            showCrosshair={true}
            showLegend={true}
            visibleSeries={visibleSeries}
            onSeriesVisibilityChange={handleSeriesToggle}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ height }}
          >
            <div className="text-neutral-500 text-sm">
              No chart data available
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <TimeframeSelector
          loading={loading}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeChange}
        />
      </div>
    </div>
  );
}

export default MarketChart;
