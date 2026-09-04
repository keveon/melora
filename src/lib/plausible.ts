/**
 * Plausible v1 stats API client —— 仅服务端使用。
 * API key 从 Worker secret 读取（PLAUSIBLE_API_KEY），绝不打进客户端包。
 * 该自托管实例未启用 v2 API（实测 404），统一走 v1 端点。
 */

const HOST = 'https://analytics.keveon.com';
const SITE = 'melora.moe';

export type Stats = {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
};

type AggregateResponse = {
  results: Record<string, { value: number }>;
};

type BreakdownResponse = {
  results: Array<{ page: string; visitors: number; pageviews: number }>;
};

async function api<T>(path: string, params: URLSearchParams): Promise<T> {
  const key = process.env.PLAUSIBLE_API_KEY;
  if (!key) {
    throw new Error('PLAUSIBLE_API_KEY is not configured');
  }
  params.set('site_id', SITE);
  const response = await fetch(`${HOST}/api/v1/stats/${path}?${params}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`plausible ${path} responded ${response.status}`);
  }
  return (await response.json()) as T;
}

function toStats(json: AggregateResponse): Stats {
  return {
    visitors: json.results.visitors?.value ?? 0,
    pageviews: json.results.pageviews?.value ?? 0,
    bounce_rate: json.results.bounce_rate?.value ?? 0,
    visit_duration: json.results.visit_duration?.value ?? 0,
  };
}

export async function aggregate(period: '7d' | '30d'): Promise<Stats> {
  const params = new URLSearchParams({
    period,
    metrics: 'visitors,pageviews,bounce_rate,visit_duration',
  });
  return toStats(await api<AggregateResponse>('aggregate', params));
}

export async function topPages(): Promise<
  Array<{ page: string; visitors: number }>
> {
  const json = await api<BreakdownResponse>(
    'breakdown',
    new URLSearchParams({
      period: '30d',
      property: 'event:page',
      metrics: 'visitors',
    })
  );
  return json.results
    .map(({ page, visitors }) => ({ page, visitors }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 3);
}

export function getLocale() {
  return {
    aggregate,
    topPages,
  };
}
