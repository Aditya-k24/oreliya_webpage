import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create roles
  console.log('Creating roles...');
  await prisma.role.createMany({
    data: [
      { name: 'admin', description: 'Administrator' },
      { name: 'user', description: 'Regular user' },
    ],
    skipDuplicates: true,
  });

  // Create admin user
  console.log('Creating admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@oreliya.com' },
    update: {},
    create: {
      email: 'admin@oreliya.com',
      password: '$2a$10$rQZ8NwYz8NwYz8NwYz8NwO', // hashed 'password123'
      firstName: 'Admin',
      lastName: 'User',
      roleId: (await prisma.role.findUnique({ where: { name: 'admin' } }))!.id,
    },
  });

  // Create test user
  console.log('Creating test user...');
  await prisma.user.upsert({
    where: { email: 'user@oreliya.com' },
    update: {},
    create: {
      email: 'user@oreliya.com',
      password: '$2a$10$rQZ8NwYz8NwYz8NwYz8NwO', // hashed 'password123'
      firstName: 'Test',
      lastName: 'User',
      roleId: (await prisma.role.findUnique({ where: { name: 'user' } }))!.id,
    },
  });

  // Create categories
  console.log('Creating categories...');
  await prisma.category.createMany({
    data: [
      {
        name: 'Jewelry',
        description: 'Beautiful jewelry pieces',
        slug: 'jewelry',
      },
      {
        name: 'Watches',
        description: 'Elegant timepieces',
        slug: 'watches',
      },
    ],
    skipDuplicates: true,
  });

  // Create products
  console.log('Creating products...');
  await prisma.product.upsert({
    where: { slug: 'diamond-ring' },
    update: {},
    create: {
      name: 'Diamond Ring',
      slug: 'diamond-ring',
      description: 'Beautiful diamond ring',
      shortDescription: 'Elegant diamond ring',
      price: 999.99,
      compareAtPrice: 1299.99,
      images: ['ring1.jpg', 'ring2.jpg'],
      category: 'Jewelry',
      tags: ['diamond', 'ring', 'jewelry'],
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePercentage: 23,
      variants: {
        create: [
          {
            size: '7',
            material: 'Gold',
            price: 999.99,
            stockQuantity: 5,
            sku: 'RING-001-7',
            isActive: true,
          },
          {
            size: '8',
            material: 'Gold',
            price: 999.99,
            stockQuantity: 3,
            sku: 'RING-001-8',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            name: 'Engraving',
            type: 'text',
            required: false,
            options: [],
            priceAdjustment: 50.0,
          },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: 'luxury-watch' },
    update: {},
    create: {
      name: 'Luxury Watch',
      slug: 'luxury-watch',
      description: 'Premium luxury watch',
      shortDescription: 'Elegant timepiece',
      price: 2499.99,
      compareAtPrice: 2999.99,
      images: ['watch1.jpg', 'watch2.jpg'],
      category: 'Watches',
      tags: ['watch', 'luxury', 'timepiece'],
      isActive: true,
      isFeatured: true,
      isOnSale: false,
      variants: {
        create: [
          {
            size: '42mm',
            material: 'Stainless Steel',
            price: 2499.99,
            stockQuantity: 2,
            sku: 'WATCH-001-42',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            name: 'Case Material',
            type: 'select',
            required: true,
            options: ['Stainless Steel', 'Gold', 'Platinum'],
            priceAdjustment: 0,
          },
        ],
      },
    },
  });

  // Create deals
  console.log('Creating deals...');
  await prisma.deal.create({
    data: {
      name: 'Summer Sale',
      description: 'Get 20% off on all jewelry',
      type: 'percentage',
      value: 20.0,
      minAmount: 100.0,
      maxDiscount: 500.0,
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      isActive: true,
      usageLimit: 1000,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Summary:');
  console.log('- 2 roles created');
  console.log('- 2 users created');
  console.log('- 2 categories created');
  console.log('- 2 products created');
  console.log('- 1 deal created');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
