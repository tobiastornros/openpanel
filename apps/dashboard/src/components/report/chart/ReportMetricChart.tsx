'use client';

import { useVisibleSeries } from '@/hooks/useVisibleSeries';
import type { IChartData } from '@/trpc/client';
import { cn } from '@/utils/cn';

import { useChartContext } from './ChartProvider';
import { MetricCard } from './MetricCard';

interface ReportMetricChartProps {
  data: IChartData;
}

export function ReportMetricChart({ data }: ReportMetricChartProps) {
  const { editMode, metric, unit } = useChartContext();
  const { series } = useVisibleSeries(data, editMode ? 20 : 4);
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        editMode && 'md:grid-cols-2 lg:grid-cols-3'
      )}
    >
      {series.map((serie) => {
        return (
          <MetricCard
            key={serie.id}
            serie={serie}
            metric={metric}
            unit={unit}
          />
        );
      })}
    </div>
  );
}
