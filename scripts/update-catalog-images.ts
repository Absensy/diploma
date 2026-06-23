import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryImages: Record<string, string> = {
  'Светильники': '/images/lamp.png',
  'Ограды': '/images/fence.png',
  'Столы': '/images/table.png',
  'Скамейки': '/images/bench.png',
};

async function main() {
  for (const [name, image] of Object.entries(categoryImages)) {
    const category = await prisma.category.findFirst({ where: { name } });
    if (!category) {
      console.log(`⏭️  Категория "${name}" не найдена — пропуск`);
      continue;
    }

    await prisma.category.update({
      where: { id: category.id },
      data: { photo: image },
    });

    const products = await prisma.product.findMany({
      where: { category_id: category.id },
      select: { id: true },
    });
    const productIds = products.map((p) => p.id);

    const updatedProducts = await prisma.product.updateMany({
      where: { category_id: category.id },
      data: { image },
    });

    let updatedGallery = { count: 0 };
    if (productIds.length > 0) {
      updatedGallery = await prisma.productImage.updateMany({
        where: { product_id: { in: productIds } },
        data: { url: image },
      });
    }

    console.log(
      `✅ ${name}: обложка + ${updatedProducts.count} товаров + ${updatedGallery.count} фото галереи → ${image}`,
    );
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка обновления:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
