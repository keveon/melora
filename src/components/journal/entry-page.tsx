import { Container } from '@/components/layout/container';
import { journalEntries } from '@/content/journal';
import { renderInline } from '@/lib/journal-inline';
import { type AppLocale, journalEntryPath, message } from '@/lib/locale';

function formatDate(date: string, locale: AppLocale) {
  const d = new Date(`${date}T00:00:00+08:00`);
  return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  });
}

/** 周记阅读页：单篇全文。路由 beforeLoad 已保证 entry 存在。 */
export function JournalEntryPage({
  locale,
  slug,
}: {
  locale: AppLocale;
  slug: string;
}) {
  const entry = journalEntries.find((e) => e.slug === slug);
  if (!entry) return null;
  const homePath = journalEntryPath(locale, '').replace(/\/journal\/$/, '');
  const others = journalEntries.filter((e) => e.slug !== entry.slug);

  return (
    <main id="main-content" className="bg-yellow-soft text-ink">
      <Container className="py-16 sm:py-20">
        <a
          className="text-sm font-bold underline decoration-ink/30 underline-offset-4 hover:decoration-orange"
          href={homePath}
        >
          ← {message('journal_back', locale)}
        </a>
        <article className="mt-8 max-w-3xl border-2 border-ink bg-paper p-7 shadow-[6px_6px_0_var(--ink)] dark:shadow-[6px_6px_0_var(--paper)] sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow px-3 py-1 text-sm font-bold">
              {formatDate(entry.date, locale)}
            </span>
            {locale !== 'zh' && (
              <span className="text-sm font-medium text-ink/55">
                (in Chinese)
              </span>
            )}
          </div>
          <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-[-0.03em] sm:text-5xl">
            {entry.title}
          </h1>
          <div className="mt-7 space-y-5 leading-8 text-ink/85">
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{renderInline(paragraph)}</p>
            ))}
          </div>
          <p className="mt-8 border-t-2 border-dashed border-ink/25 pt-5 text-sm font-medium text-ink/60">
            {message('journal_footer', locale)}
          </p>
        </article>
        {others.length > 0 && (
          <div className="mt-10 max-w-3xl">
            <h2 className="text-sm font-black uppercase tracking-wide text-ink/60">
              {message('journal_archive', locale)}
            </h2>
            <ul className="mt-4 space-y-3">
              {others.map((other) => (
                <li
                  key={other.slug}
                  className="flex flex-wrap items-baseline gap-x-3"
                >
                  <span className="text-sm font-bold text-ink/70">
                    {formatDate(other.date, locale)}
                  </span>
                  <a
                    className="font-medium text-ink/85 underline decoration-ink/30 underline-offset-4 hover:decoration-orange"
                    href={journalEntryPath(locale, other.slug)}
                  >
                    {other.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </main>
  );
}
