import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Local image paths
const productImages = [
  '/images/singleMonument.jpg',
  '/images/doubleMonument.jpg',
  '/images/memorialMonument.jpg',
  '/images/graniteSlab.jpg',
  '/images/gravestone.jpg',
  '/images/GrneyMonument.jpg',
];

const exampleImages = [
  '/images/memorialMonument.jpg',
  '/images/singleMonument.jpg',
  '/images/doubleMonument.jpg',
  '/images/graniteSlab.jpg',
  '/images/gravestone.jpg',
  '/images/GrneyMonument.jpg',
];

function getRandomLocalImage(images: string[]): string {
  return images[Math.floor(Math.random() * images.length)];
}

async function updateExternalImages() {
  console.log('🔄 Updating external image URLs to local paths...\n');

  try {
    // Update products with external URLs
    const productsWithExternalImages = await prisma.product.findMany({
      where: {
        OR: [
          { image: { startsWith: 'https://' } },
          { image: { contains: 'picsum' } },
          { image: { contains: 'unsplash' } },
        ],
      },
    });

    console.log(`📦 Found ${productsWithExternalImages.length} products with external images`);

    for (const product of productsWithExternalImages) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          image: getRandomLocalImage(productImages),
        },
      });
      console.log(`  ✅ Updated product #${product.id}: ${product.name}`);
    }

    // Update product images with external URLs
    const productImagesWithExternal = await prisma.productImage.findMany({
      where: {
        OR: [
          { url: { startsWith: 'https://' } },
          { url: { contains: 'picsum' } },
          { url: { contains: 'unsplash' } },
        ],
      },
    });

    console.log(`\n🖼️  Found ${productImagesWithExternal.length} product images with external URLs`);

    for (const img of productImagesWithExternal) {
      await prisma.productImage.update({
        where: { id: img.id },
        data: {
          url: getRandomLocalImage(productImages),
        },
      });
      console.log(`  ✅ Updated product image #${img.id}`);
    }

    // Update examples of work with external URLs
    const examplesWithExternal = await prisma.examplesOurWork.findMany({
      where: {
        OR: [
          { image: { startsWith: 'https://' } },
          { image: { contains: 'picsum' } },
          { image: { contains: 'unsplash' } },
        ],
      },
    });

    console.log(`\n📸 Found ${examplesWithExternal.length} examples with external images`);

    for (const example of examplesWithExternal) {
      await prisma.examplesOurWork.update({
        where: { id: example.id },
        data: {
          image: getRandomLocalImage(exampleImages),
        },
      });
      console.log(`  ✅ Updated example #${example.id}: ${example.title}`);
    }

    console.log('\n✅ All external image URLs have been updated to local paths!');
  } catch (error) {
    console.error('❌ Error updating images:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateExternalImages()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
