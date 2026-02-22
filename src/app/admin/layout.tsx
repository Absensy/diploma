import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Admin Layout
 * 
 * This layout component is minimal as the actual admin layout structure
 * is handled by the AdminLayout client component (src/components/AdminLayout/AdminLayout.tsx).
 * 
 * The Emotion cache is configured in src/app/providers.tsx with:
 * - key: 'mui'
 * - speedy: false (for SSR compatibility)
 * - Created with useMemo for consistent rendering
 * 
 * All admin pages use:
 * - sx prop for styling (no styled components)
 * - Loading states to prevent content jumping during hydration
 * - DataGrid with loading prop for consistent initial render
 */
export const metadata: Metadata = {
  title: "Админ-панель - Гранит памяти",
  description: "Панель управления сайтом",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}