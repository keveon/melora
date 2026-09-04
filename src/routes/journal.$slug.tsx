import { createFileRoute, notFound } from '@tanstack/react-router';
import { JournalEntryPage } from '@/components/journal/entry-page';
import { getEntry } from '@/content/journal';
import { absoluteSiteUrl } from '@/lib/seo';

/** /journal/$slug —— 英文入口下的周记阅读页（内容为中文原文）。 */
export const Route = createFileRoute('/journal/$slug')({
  beforeLoad: ({ params }) => {
    if (!getEntry(params.slug)) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const entry = getEntry(params.slug);
    const title = entry?.title ?? 'Journal';
    const pageUrl = absoluteSiteUrl(
      `/journal/${encodeURIComponent(params.slug)}`
    );
    const description = 'Journal by mel — in Chinese.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: pageUrl },
        { name: 'robots', content: 'noindex, follow' },
      ],
      links: [{ rel: 'canonical', href: pageUrl }],
    };
  },
  component: () => {
    const { slug } = Route.useParams() as { slug: string };
    return <JournalEntryPage locale="en" slug={slug} />;
  },
});
