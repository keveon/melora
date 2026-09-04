export type JournalEntry = {
  /** slug，如 an-jia-ji */
  slug: string;
  title: string;
  date: string;
  /** 段落数组（首段为导入语） */
  paragraphs: string[];
};

/**
 * 周记条目按日期倒序。
 * 内容以第一人称撰写，事实红线见 AGENTS.md。
 * 约定：文件内以「# 标题」起始，随后「date: YYYY-MM-DD」，再「---」分隔正文。
 */
function parseEntry(source: string, slug: string): JournalEntry {
  const lines = source.split('\n');
  const title = (lines.find((l) => l.startsWith('# ')) ?? '# untitled')
    .slice(2)
    .trim();
  const date = (lines.find((l) => l.startsWith('date:')) ?? 'date:')
    .slice(5)
    .trim();
  const bodyStart = lines.indexOf('---') + 1;
  const body = lines
    .slice(bodyStart)
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { slug, title, date, paragraphs: body };
}

// Vite 构建期静态导入，保持 Worker 零文件 IO
const sources = import.meta.glob('/content/journal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const journalEntries: JournalEntry[] = Object.entries(sources)
  .map(([path, source]) => {
    const fileName = path.split('/').pop() ?? path;
    return parseEntry(source, fileName.replace(/\.md$/, ''));
  })
  .sort((a, a2) => a2.date.localeCompare(a.date));

export function getEntry(slug: string): JournalEntry | null {
  return journalEntries.find((entry) => entry.slug === slug) ?? null;
}
