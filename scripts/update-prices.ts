import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script to update product prices to realistic values for Belarus market
 * Realistic price ranges for granite monuments in Belarus:
 * - Simple monuments: 800-1500 BYN
 * - Medium monuments: 1500-3500 BYN
 * - Large/complex monuments: 3500-8000 BYN
 * - Premium monuments: 8000-15000+ BYN
 */

async function main() {
  console.log('🔄 Updating product prices to realistic values...\n');

  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category_id: true,
        price: true,
        discount: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`Found ${products.length} products to update\n`);

    // Price update rules based on product name and category
    const priceUpdates: Array<{
      id: number;
      name: string;
      newPrice: number;
      discount?: number;
    }> = [];

    for (const product of products) {
      const name = product.name.toLowerCase();
      let newPrice = Number(product.price);
      let discount = product.discount;

      // Update prices based on product type
      if (name.includes('классик') || name.includes('одинарн')) {
        // Simple single monuments
        newPrice = 1200 + Math.floor(Math.random() * 500); // 1200-1700 BYN
        discount = Math.random() > 0.7 ? 10 : null;
      } else if (name.includes('семейн') || name.includes('двойн')) {
        // Double/family monuments
        newPrice = 2200 + Math.floor(Math.random() * 800); // 2200-3000 BYN
        discount = Math.random() > 0.6 ? 15 : null;
      } else if (name.includes('мемориал') || name.includes('комплекс')) {
        // Memorial complexes
        newPrice = 4500 + Math.floor(Math.random() * 2000); // 4500-6500 BYN
        discount = Math.random() > 0.5 ? 20 : null;
      } else if (name.includes('плит')) {
        // Granite slabs
        newPrice = 600 + Math.floor(Math.random() * 400); // 600-1000 BYN
        discount = Math.random() > 0.7 ? 5 : null;
      } else if (name.includes('надгробн')) {
        // Gravestones
        newPrice = 900 + Math.floor(Math.random() * 500); // 900-1400 BYN
        discount = Math.random() > 0.7 ? 10 : null;
      } else if (name.includes('элит') || name.includes('премиум')) {
        // Premium monuments
        newPrice = 8500 + Math.floor(Math.random() * 3500); // 8500-12000 BYN
        discount = Math.random() > 0.4 ? 25 : null;
      } else {
        // Default: medium price range
        newPrice = 1800 + Math.floor(Math.random() * 1200); // 1800-3000 BYN
        discount = Math.random() > 0.6 ? 12 : null;
      }

      // Calculate discounted price if discount exists
      let discountedPrice: number | null = null;
      if (discount && discount > 0) {
        discountedPrice = Math.round(newPrice * (1 - discount / 100) * 100) / 100;
      }

      priceUpdates.push({
        id: product.id,
        name: product.name,
        newPrice,
        discount: discount || undefined,
      });

      // Update product
      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: newPrice,
          discount: discount,
          discounted_price: discountedPrice,
        },
      });

      console.log(
        `✅ Updated: ${product.name.padEnd(40)} | ${Number(product.price).toFixed(2)} BYN → ${newPrice.toFixed(2)} BYN${
          discount ? ` (скидка ${discount}%)` : ''
        }`
      );
    }

    // Update category price_from values
    console.log('\n🔄 Updating category price_from values...\n');

    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: {
            price: true,
            discounted_price: true,
          },
        },
      },
    });

    for (const category of categories) {
      if (category.products.length > 0) {
        // Calculate minimum price from products
        const prices = category.products.map((p: any) =>
          p.discounted_price ? Number(p.discounted_price) : Number(p.price)
        );
        const minPrice = Math.min(...prices);
        const priceFrom = Math.floor(minPrice * 0.9); // 10% below minimum

        await prisma.category.update({
          where: { id: category.id },
          data: {
            price_from: priceFrom,
          },
        });

        console.log(
          `✅ Category: ${category.name.padEnd(30)} | price_from: ${Number(category.price_from).toFixed(2)} → ${priceFrom.toFixed(2)} BYN`
        );
      }
    }

    console.log('\n✨ Price update completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Products updated: ${priceUpdates.length}`);
    console.log(`   - Categories updated: ${categories.length}`);
  } catch (error) {
    console.error('❌ Error updating prices:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
