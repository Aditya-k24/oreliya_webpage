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
      password: '$2a$10$41L7Iar.xk8c4n0zzVBrPOcn5y6dncxVbF/l0/2WBrePeos3ofHs6', // bcrypt hash for 'password123'
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

  // Create comprehensive test products with all jewelry categories
  console.log('Creating comprehensive test products...');
  
  // 1. Diamond Engagement Ring (Rings category)
  await prisma.product.upsert({
    where: { slug: 'diamond-engagement-ring' },
    update: {},
    create: {
      name: 'Diamond Engagement Ring',
      slug: 'diamond-engagement-ring',
      description: 'Exquisite diamond engagement ring with customizable metal and stone options',
      shortDescription: 'Perfect for your special moment',
      price: 2999.99,
      compareAtPrice: 3999.99,
      images: ['/images/rings/engagement-ring-1.jpg', '/images/rings/engagement-ring-2.jpg'],
      category: 'rings',
      tags: ['diamond', 'ring', 'engagement', 'jewelry'],
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePercentage: 25,
      variants: {
        create: [
          {
            size: '7',
            material: 'Gold',
            price: 2999.99,
            stockQuantity: 5,
            sku: 'RING-ENG-001-7',
            isActive: true,
          },
          {
            size: '8',
            material: 'Gold',
            price: 2999.99,
            stockQuantity: 3,
            sku: 'RING-ENG-001-8',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            attribute: 'Metal Type',
            type: 'select',
            required: true,
            options: ['Yellow Gold', 'White Gold', 'Rose Gold'],
            priceAdjustment: 0,
            category: 'rings',
            sortOrder: 1,
          },
          {
            attribute: 'Purity',
            type: 'select',
            required: true,
            options: ['22kt', '18kt', '14kt', '9kt'],
            priceAdjustment: 0,
            category: 'rings',
            sortOrder: 2,
          },
          {
            attribute: 'Stone',
            type: 'select',
            required: true,
            options: ['Natural Diamond', 'Lab Diamond', 'Moissanite'],
            priceAdjustment: 0,
            category: 'rings',
            sortOrder: 3,
          },
          {
            attribute: 'Ring Size',
            type: 'number',
            required: true,
            minValue: 5,
            maxValue: 18,
            priceAdjustment: 0,
            category: 'rings',
            sortOrder: 4,
          },
          {
            attribute: 'Carat Size',
            type: 'select',
            required: true,
            options: ['0.25', '0.5', '0.75', '1', '2', '3', '4', '5'],
            priceAdjustment: 0,
            category: 'rings',
            sortOrder: 5,
          },
          {
            attribute: 'Engraving',
            type: 'text',
            required: false,
            maxLength: 20,
            pattern: '^[A-Za-z0-9 ]{0,20}$',
            helpText: 'Up to 20 characters (letters, numbers, spaces)',
            priceAdjustment: 50,
            category: 'rings',
            sortOrder: 6,
          },
        ],
      },
    },
  });

  // 2. Pearl Earrings (Earrings category)
  await prisma.product.upsert({
    where: { slug: 'pearl-drop-earrings' },
    update: {},
    create: {
      name: 'Pearl Drop Earrings',
      slug: 'pearl-drop-earrings',
      description: 'Elegant pearl drop earrings with customizable metal and stone options',
      shortDescription: 'Timeless elegance for any occasion',
      price: 899.99,
      compareAtPrice: 1199.99,
      images: ['/images/earrings/pearl-drop-1.jpg', '/images/earrings/pearl-drop-2.jpg'],
      category: 'earrings',
      tags: ['pearl', 'earrings', 'drop', 'jewelry'],
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePercentage: 25,
      variants: {
        create: [
          {
            size: 'One Size',
            material: 'Gold',
            price: 899.99,
            stockQuantity: 8,
            sku: 'EARR-PEARL-001',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            attribute: 'Metal Type',
            type: 'select',
            required: true,
            options: ['Yellow Gold', 'White Gold', 'Rose Gold'],
            priceAdjustment: 0,
            category: 'earrings',
            sortOrder: 1,
          },
          {
            attribute: 'Purity',
            type: 'select',
            required: true,
            options: ['22kt', '18kt', '14kt', '9kt'],
            priceAdjustment: 0,
            category: 'earrings',
            sortOrder: 2,
          },
          {
            attribute: 'Stone',
            type: 'select',
            required: true,
            options: ['Natural Pearl', 'Cultured Pearl', 'Synthetic Pearl'],
            priceAdjustment: 0,
            category: 'earrings',
            sortOrder: 3,
          },
          {
            attribute: 'Carat Size',
            type: 'select',
            required: true,
            options: ['0.25', '0.5', '0.75', '1', '2', '3', '4', '5'],
            priceAdjustment: 0,
            category: 'earrings',
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // 3. Gold Bracelet (Bracelets category)
  await prisma.product.upsert({
    where: { slug: 'gold-chain-bracelet' },
    update: {},
    create: {
      name: 'Gold Chain Bracelet',
      slug: 'gold-chain-bracelet',
      description: 'Classic gold chain bracelet with customizable metal and optional stone options',
      shortDescription: 'Versatile and elegant',
      price: 1299.99,
      compareAtPrice: 1599.99,
      images: ['/images/bracelets/gold-chain-1.jpg', '/images/bracelets/gold-chain-2.jpg'],
      category: 'bracelets',
      tags: ['gold', 'bracelet', 'chain', 'jewelry'],
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePercentage: 19,
      variants: {
        create: [
          {
            size: '7 inches',
            material: 'Gold',
            price: 1299.99,
            stockQuantity: 6,
            sku: 'BRAC-GOLD-001-7',
            isActive: true,
          },
          {
            size: '8 inches',
            material: 'Gold',
            price: 1299.99,
            stockQuantity: 4,
            sku: 'BRAC-GOLD-001-8',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            attribute: 'Metal Type',
            type: 'select',
            required: true,
            options: ['Yellow Gold', 'White Gold', 'Rose Gold'],
            priceAdjustment: 0,
            category: 'bracelets',
            sortOrder: 1,
          },
          {
            attribute: 'Purity',
            type: 'select',
            required: true,
            options: ['22kt', '18kt', '14kt', '9kt'],
            priceAdjustment: 0,
            category: 'bracelets',
            sortOrder: 2,
          },
          {
            attribute: 'Stone',
            type: 'select',
            required: true,
            options: ['Natural Diamond', 'Lab Diamond', 'Moissanite'],
            priceAdjustment: 0,
            category: 'bracelets',
            sortOrder: 3,
          },
          {
            attribute: 'Carat Size',
            type: 'select',
            required: false,
            options: ['0.25', '0.5', '0.75', '1', '2', '3', '4', '5'],
            priceAdjustment: 0,
            category: 'bracelets',
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // 4. Diamond Necklace (Necklaces category)
  await prisma.product.upsert({
    where: { slug: 'diamond-pendant-necklace' },
    update: {},
    create: {
      name: 'Diamond Pendant Necklace',
      slug: 'diamond-pendant-necklace',
      description: 'Stunning diamond pendant necklace with customizable metal and stone options',
      shortDescription: 'A statement piece for special occasions',
      price: 1999.99,
      compareAtPrice: 2499.99,
      images: ['/images/necklaces/diamond-pendant-1.jpg', '/images/necklaces/diamond-pendant-2.jpg'],
      category: 'necklaces',
      tags: ['diamond', 'necklace', 'pendant', 'jewelry'],
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePercentage: 20,
      variants: {
        create: [
          {
            size: '18 inches',
            material: 'Gold',
            price: 1999.99,
            stockQuantity: 7,
            sku: 'NECK-DIAMOND-001-18',
            isActive: true,
          },
          {
            size: '20 inches',
            material: 'Gold',
            price: 1999.99,
            stockQuantity: 5,
            sku: 'NECK-DIAMOND-001-20',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            attribute: 'Metal Type',
            type: 'select',
            required: true,
            options: ['Yellow Gold', 'White Gold', 'Rose Gold'],
            priceAdjustment: 0,
            category: 'necklaces',
            sortOrder: 1,
          },
          {
            attribute: 'Purity',
            type: 'select',
            required: true,
            options: ['22kt', '18kt', '14kt', '9kt'],
            priceAdjustment: 0,
            category: 'necklaces',
            sortOrder: 2,
          },
          {
            attribute: 'Stone',
            type: 'select',
            required: true,
            options: ['Natural Diamond', 'Lab Diamond', 'Moissanite'],
            priceAdjustment: 0,
            category: 'necklaces',
            sortOrder: 3,
          },
          {
            attribute: 'Carat Size',
            type: 'select',
            required: false,
            options: ['0.25', '0.5', '0.75', '1', '2', '3', '4', '5'],
            priceAdjustment: 0,
            category: 'necklaces',
            sortOrder: 4,
          },
        ],
      },
    },
  });

  // 5. Luxury Watch (Watches category)
  await prisma.product.upsert({
    where: { slug: 'luxury-watch' },
    update: {},
    create: {
      name: 'Luxury Watch',
      slug: 'luxury-watch',
      description: 'Premium luxury watch with customizable case material and features',
      shortDescription: 'Elegant timepiece for the discerning',
      price: 2499.99,
      compareAtPrice: 2999.99,
      images: ['/images/watches/luxury-watch-1.jpg', '/images/watches/luxury-watch-2.jpg'],
      category: 'watches',
      tags: ['watch', 'luxury', 'timepiece'],
      isActive: true,
      isFeatured: true,
      isOnSale: true,
      salePercentage: 17,
      variants: {
        create: [
          {
            size: '42mm',
            material: 'Stainless Steel',
            price: 2499.99,
            stockQuantity: 3,
            sku: 'WATCH-LUX-001-42',
            isActive: true,
          },
          {
            size: '44mm',
            material: 'Stainless Steel',
            price: 2499.99,
            stockQuantity: 2,
            sku: 'WATCH-LUX-001-44',
            isActive: true,
          },
        ],
      },
      customizations: {
        create: [
          {
            attribute: 'Case Material',
            type: 'select',
            required: true,
            options: ['Stainless Steel', 'Gold', 'Platinum'],
            priceAdjustment: 0,
            category: 'watches',
            sortOrder: 1,
          },
          {
            attribute: 'Strap Material',
            type: 'select',
            required: true,
            options: ['Leather', 'Metal', 'Rubber'],
            priceAdjustment: 0,
            category: 'watches',
            sortOrder: 2,
          },
          {
            attribute: 'Dial Color',
            type: 'select',
            required: true,
            options: ['Black', 'White', 'Blue', 'Silver'],
            priceAdjustment: 0,
            category: 'watches',
            sortOrder: 3,
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
  console.log('- 5 comprehensive test products created:');
  console.log('  • Diamond Engagement Ring (rings) - 6 customizations');
  console.log('  • Pearl Drop Earrings (earrings) - 4 customizations');
  console.log('  • Gold Chain Bracelet (bracelets) - 4 customizations');
  console.log('  • Diamond Pendant Necklace (necklaces) - 4 customizations');
  console.log('  • Luxury Watch (watches) - 3 customizations');
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
