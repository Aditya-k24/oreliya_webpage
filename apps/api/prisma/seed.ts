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

  // Remove demo seed products if present
  console.log('Removing existing demo products...');
  await prisma.product.deleteMany({
    where: {
      slug: {
        in: [
          'diamond-engagement-ring',
          'pearl-drop-earrings',
          'gold-chain-bracelet',
          'diamond-pendant-necklace',
          'luxury-watch',
        ],
      },
    },
  });

  console.log('Creating minimal dummy products...');
  const dummyProducts = [
    {
      name: 'Dummy Ring',
      slug: 'dummy-ring',
      description: 'Minimal ring for testing.',
      shortDescription: 'Test ring',
      price: 1000.0,
      images: ['/placeholder-product.svg'],
      category: 'rings',
      tags: ['dummy', 'rings'],
      isActive: true,
    },
    {
      name: 'Dummy Earrings',
      slug: 'dummy-earrings',
      description: 'Minimal earrings for testing.',
      shortDescription: 'Test earrings',
      price: 800.0,
      images: ['/placeholder-product.svg'],
      category: 'earrings',
      tags: ['dummy', 'earrings'],
      isActive: true,
    },
    {
      name: 'Dummy Bracelet',
      slug: 'dummy-bracelet',
      description: 'Minimal bracelet for testing.',
      shortDescription: 'Test bracelet',
      price: 1200.0,
      images: ['/placeholder-product.svg'],
      category: 'bracelets',
      tags: ['dummy', 'bracelets'],
      isActive: true,
    },
    {
      name: 'Dummy Necklace',
      slug: 'dummy-necklace',
      description: 'Minimal necklace for testing.',
      shortDescription: 'Test necklace',
      price: 1500.0,
      images: ['/placeholder-product.svg'],
      category: 'necklaces',
      tags: ['dummy', 'necklaces'],
      isActive: true,
    },
    {
      name: 'Dummy Mangalsutra',
      slug: 'dummy-mangalsutra',
      description: 'Minimal mangalsutra for testing.',
      shortDescription: 'Test mangalsutra',
      price: 1800.0,
      images: ['/placeholder-product.svg'],
      category: 'mangalsutra',
      tags: ['dummy', 'mangalsutra'],
      isActive: true,
    },
    {
      name: 'Dummy Other',
      slug: 'dummy-other',
      description: 'Minimal product for testing.',
      shortDescription: 'Test other',
      price: 500.0,
      images: ['/placeholder-product.svg'],
      category: 'other',
      tags: ['dummy', 'other'],
      isActive: true,
    },
  ];

  for (const p of dummyProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { 
        ...p,
        customizations: {
          create: buildCustomizationsForCategory(p.category)
        }
      },
    });
  }

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
  console.log('- 6 minimal dummy products created: rings, earrings, bracelets, necklaces, mangalsutra, other');
  console.log('- 1 deal created');
}

function buildCustomizationsForCategory(category: string) {
  const common = [
    {
      attribute: 'Metal Type',
      type: 'select',
      required: true,
      options: ['Yellow Gold', 'White Gold', 'Rose Gold'],
      category,
      sortOrder: 1,
    },
    {
      attribute: 'Purity',
      type: 'select',
      required: true,
      options: ['22kt', '18kt', '14kt', '9kt'],
      category,
      sortOrder: 2,
    },
    {
      attribute: 'Stone',
      type: 'select',
      required: true,
      options: ['Natural Diamond', 'Lab Diamond', 'Moissanite'],
      category,
      sortOrder: 3,
    },
  ];

  const lower = category.toLowerCase();

  if (lower === 'rings') {
    return [
      ...common,
      { attribute: 'Ring Size', type: 'number', required: true, minValue: 5, maxValue: 18, category, sortOrder: 4 },
      { attribute: 'Carat Size', type: 'select', required: true, options: ['0.25','0.5','0.75','1','2','3','4','5'], category, sortOrder: 5 },
      { attribute: 'Engraving', type: 'text', required: false, maxLength: 20, pattern: '^[A-Za-z0-9 ]{0,20}$', helpText: 'Up to 20 characters', category, sortOrder: 6 },
    ];
  }

  if (lower === 'earrings') {
    return [
      ...common,
      { attribute: 'Carat Size', type: 'select', required: true, options: ['0.25','0.5','0.75','1','2','3','4','5'], category, sortOrder: 4 },
    ];
  }

  if (lower === 'bracelets' || lower === 'necklaces' || lower === 'mangalsutra') {
    return [
      ...common,
      { attribute: 'Carat Size', type: 'select', required: false, options: ['0.25','0.5','0.75','1','2','3','4','5'], category, sortOrder: 4 },
    ];
  }

  return common;
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
