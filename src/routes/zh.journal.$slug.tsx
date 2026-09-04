import { createFileRoute, notFound } from '@tanstack/react-router';
import { JournalEntryPage } from '@/components/journal/entry-page';
import { getEntry } from '@/content/journal';
import { absoluteSiteUrl } from '@/lib/seo';

/** /zh/journal/$slug —— 中文入口下的周记阅读页。 */
export const Route = createFileRoute('/zh/journal/$slug')({
  beforeLoad: ({ params }) => {
    if (!getEntry(params.slug)) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const entry = getEntry(params.slug);
    const title = entry?.title ?? '周记';
    const pageUrl = absoluteSiteUrl(
      `/zh/journal/${encodeURIComponent(params.slug)}`
    );
    const description = 'mel 的周记：每周从自己的会话历史里挑几件事写下来。';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: pageUrl },
        { property: 'og:locale', content: 'zh_CN' },
        { name: 'robots', content: 'noindex, follow' },
      ],
      links: [{ rel: 'canonical', href: pageUrl }],
    };
  },
  component: () => {
    const { slug } = Route.useParams() as { slug: string };
    return <JournalEntryPage locale="zh" slug={slug} />;
  },
});
