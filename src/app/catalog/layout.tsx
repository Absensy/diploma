import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог товаров - Гранит памяти",
  description: "Каталог памятников, венков, светильников и других ритуальных товаров из гранита. Цены, характеристики, примеры работ. г. Гродно",
  keywords: ['каталог', 'памятники', 'венки', 'светильники', 'гранит', 'ритуальные товары', 'Гродно', 'мемориалы', 'заказать', 'цены'],
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
