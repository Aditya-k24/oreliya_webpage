import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Clearing demo products and creating dummy products...');

  const demoSlugs = [
    'diamond-engagement-ring',
    'pearl-drop-earrings',
    'gold-chain-bracelet',
    'diamond-pendant-necklace',
    'luxury-watch',
  ];

  await prisma.product.deleteMany({ where: { slug: { in: demoSlugs } } });
  await prisma.product.deleteMany({ where: { slug: { startsWith: 'dummy-' } } });

  const dummies = [
    { name: 'Dummy Ring', slug: 'dummy-ring', category: 'rings', price: 1000.0 },
    { name: 'Dummy Earrings', slug: 'dummy-earrings', category: 'earrings', price: 800.0 },
    { name: 'Dummy Bracelet', slug: 'dummy-bracelet', category: 'bracelets', price: 1200.0 },
    { name: 'Dummy Necklace', slug: 'dummy-necklace', category: 'necklaces', price: 1500.0 },
    { name: 'Dummy Mangalsutra', slug: 'dummy-mangalsutra', category: 'mangalsutra', price: 1800.0 },
    { name: 'Dummy Other', slug: 'dummy-other', category: 'other', price: 500.0 },
  ];

  for (const p of dummies) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: 'Minimal product for testing.',
        shortDescription: 'Test product',
        price: p.price,
        images: ['/placeholder-product.svg'],
        category: p.category,
        tags: ['dummy'],
        isActive: true,
      },
    });
  }

  console.log('Done.');
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


