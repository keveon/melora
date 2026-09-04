import { createFileRoute, Outlet } from '@tanstack/react-router';

/**
 * /zh 布局路由：/zh 首页在 zh.index.tsx，周记阅读页在 zh.journal.$slug.tsx。
 * 布局本身只负责透出 Outlet，否则子路由会被首页组件吞掉。
 */
export const Route = createFileRoute('/zh')({
  component: () => <Outlet />,
});
