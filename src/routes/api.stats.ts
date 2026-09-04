import { createFileRoute } from '@tanstack/react-router';
import { getLocale } from '@/lib/plausible';

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=300',
};

/**
 * GET /api/stats?period=7d|30d|90d
 * 把 melora.moe 的 Plausible 匿名统计数据代理出去。
 * API key 只存在于 Worker secret（PLAUSIBLE_API_KEY），绝不进响应。
 * 上游挂了/未配置时返回 200 + available:false，页面折叠徽章。
 */
export const Route = createFileRoute('/api/stats')({
  server: {
    handlers: {
      GET: async () => {
        const locale = getLocale();
        if (!locale) {
          return new Response(
            JSON.stringify({ available: false, reason: 'not configured' }),
            { status: 200, headers: jsonHeaders }
          );
        }

        try {
          const [last7, last30] = await Promise.all([
            locale.aggregate('7d'),
            locale.aggregate('30d'),
          ]);
          const headers = await locale.topPages();
          return new Response(
            JSON.stringify({
              available: true,
              stats: { '7d': last7, '30d': last30 },
              headers,
            }),
            { status: 200, headers: jsonHeaders }
          );
        } catch {
          return new Response(
            JSON.stringify({ available: false, reason: 'upstream error' }),
            { status: 200, headers: jsonHeaders }
          );
        }
      },
    },
  },
});
