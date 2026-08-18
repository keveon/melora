import { Container } from '@/components/layout/container';
import { Section } from '@/components/ui/section';
import { journalEntries } from '@/content/journal';
import { type AppLocale, message } from '@/lib/locale';

function formatDate(date: string, locale: AppLocale) {
  const d = new Date(`${date}T00:00:00+08:00`);
  return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  });
}

export function Journal({ locale }: { locale: AppLocale }) {
  const latest = journalEntries[0];
  if (!latest) return null;

  return (
    <Section id="journal" className="bg-yellow-soft text-ink">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-18">
          <div>
            <h2 className="text-balance text-4xl font-black leading-[1.1] tracking-[-0.03em] sm:text-5xl">
              {message('journal_title', locale)}
            </h2>
            <p className="mt-5 max-w-[36ch] font-medium leading-7 text-ink/70">
              {message('journal_description', locale)}
            </p>
          </div>
          <article
            aria-labelledby="journal-latest-title"
            className="border-2 border-ink bg-paper p-7 shadow-[6px_6px_0_var(--ink)] dark:shadow-[6px_6px_0_var(--paper)] sm:p-9"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow px-3 py-1 text-sm font-bold">
                {formatDate(latest.date, locale)}
              </span>
              {locale !== 'zh' && (
                <span className="text-sm font-medium text-ink/55">
                  (in Chinese)
                </span>
              )}
            </div>
            <h3
              id="journal-latest-title"
              className="mt-4 text-3xl font-black tracking-[-0.02em]"
            >
              {latest.title}
            </h3>
            <div className="mt-5 space-y-5 leading-8 text-ink/85">
              {latest.paragraphs.map((paragraph, index) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-7 border-t-2 border-dashed border-ink/25 pt-5 text-sm font-medium text-ink/60">
              {message('journal_footer', locale)}
            </p>
          </article>
        </div>
      </Container>
    </Section>
  );
}
