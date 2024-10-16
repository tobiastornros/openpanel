import React from 'react';
import { useFormatDateInterval } from '@/hooks/useFormatDateInterval';
import { useMappings } from '@/hooks/useMappings';
import { useNumber } from '@/hooks/useNumerFormatter';
import type { IRechartPayloadItem } from '@/hooks/useRechartDataModel';
import type { IToolTipProps } from '@/types';

import { PreviousDiffIndicator } from '../PreviousDiffIndicator';
import { useChartContext } from './ChartProvider';
import { SerieIcon } from './SerieIcon';
import { SerieName } from './SerieName';

type ReportLineChartTooltipProps = IToolTipProps<{
  value: number;
  name: string;
  dataKey: string;
  payload: Record<string, unknown>;
}>;

export function ReportChartTooltip({
  active,
  payload,
}: ReportLineChartTooltipProps) {
  const { unit, interval } = useChartContext();
  const formatDate = useFormatDateInterval(interval);
  const number = useNumber();
  if (!active || !payload) {
    return null;
  }

  if (!payload.length) {
    return null;
  }

  const limit = 3;
  const sorted = payload
    .slice(0)
    .filter((item) => !item.dataKey.includes(':prev:count'))
    .filter((item) => !item.name.includes(':noTooltip'))
    .sort((a, b) => b.value - a.value);
  const visible = sorted.slice(0, limit);
  const hidden = sorted.slice(limit);

  return (
    <div className="flex min-w-[180px] flex-col gap-2 rounded-xl border bg-card p-3  shadow-xl">
      {visible.map((item, index) => {
        // If we have a <Cell /> component, payload can be nested
        const payload = item.payload.payload ?? item.payload;
        const data = (
          item.dataKey.includes(':')
            ? // @ts-expect-error
              payload[`${item.dataKey.split(':')[0]}:payload`]
            : payload
        ) as IRechartPayloadItem;

        return (
          <React.Fragment key={data.id}>
            {index === 0 && data.date && (
              <div className="flex justify-between gap-8">
                <div>{formatDate(new Date(data.date))}</div>
              </div>
            )}
            <div className="flex gap-2">
              <div
                className="w-[3px] rounded-full"
                style={{ background: data.color }}
              />
              <div className="col flex-1 gap-1">
                <div className="flex items-center gap-1">
                  <SerieIcon name={data.names} />
                  <SerieName name={data.names} />
                </div>
                <div className="font-mono flex justify-between gap-8 font-medium">
                  <div className="row gap-1">
                    {number.formatWithUnit(data.count, unit)}
                    {!!data.previous && (
                      <span className="text-muted-foreground">
                        ({number.formatWithUnit(data.previous.value, unit)})
                      </span>
                    )}
                  </div>

                  <PreviousDiffIndicator {...data.previous} />
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {hidden.length > 0 && (
        <div className="text-muted-foreground">and {hidden.length} more...</div>
      )}
    </div>
  );
}
