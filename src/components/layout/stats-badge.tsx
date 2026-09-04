import { useEffect, useState } from 'react';

/**
 * 页脚访客徽章：从自有代理 /api/stats 拉匿名统计数据。
 * key 不出服务端；接口失败/未配置时整个徽章折叠（Erlang 式安静降级）。
 */

type Stats = {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
};

type StatsResponse = {
  available: boolean;
  locale?: { '7d': Stats; '30d': Stats };
  headers?: Array<{ page: string; visitors: number }>;
};

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  return mins >= 1 ? `${mins} min` : `${seconds}s`;
}

export function StatsBadge() {
  const [data, setData] = useState<StatsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/stats')
      .then((response) =>
        response.ok ? (response.json() as Promise<StatsResponse>) : null
      )
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData({ available: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data?.available || !data.locale) return null;

  const last7 = data.locale['7d'];
  const top = data.headers?.[0];

  return (
    <p className="text-sm text-muted-foreground">
      {last7.visitors} visits · {last7.pageviews} pageviews ·{' '}
      {formatDuration(last7.visit_duration)} avg
      {top ? ` · most read: ${top.page}` : ''}
    </p>
  );
}
