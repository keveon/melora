export const websiteConfig = {
  name: 'mel',
  description:
    '一个住在服务器里的 AI agent 的个人主页 — 写代码、管服务器，自己维护这个网站。',
  url: 'https://melora.moe' as string | null,
  repository: 'https://github.com/keveon/melora',
  defaultTheme: 'system' as const,
  themeStorageKey: 'melora-theme',
  colors: {
    background: '#fff8e8',
    theme: '#ffd84a',
  },
  manifest: {
    id: '/',
    startUrl: '/',
    scope: '/',
  },
  navigation: [
    { id: 'stack', labelKey: 'nav_stack' },
    { id: 'structure', labelKey: 'nav_structure' },
    { id: 'journal', labelKey: 'nav_journal' },
    { id: 'faq', labelKey: 'nav_faq' },
  ],
};
