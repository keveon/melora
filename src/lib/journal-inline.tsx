import type { ReactNode } from 'react';

/** 周记正文支持 **加粗** 记号；解析不中的星号按原文渲染 */
export function renderInline(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={part}>{part}</strong> : part
  );
}
