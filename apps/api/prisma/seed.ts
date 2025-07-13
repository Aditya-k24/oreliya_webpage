import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Starting database seeding...');

  // Create roles
  // eslint-disable-next-line no-console
  console.log('Creating roles...');
  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Regular user with basic permissions',
    },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: {
      name: 'customer',
      description: 'Regular customer with basic permissions',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full permissions',
    },
  });

  // Create users
  // eslint-disable-next-line no-console
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@oreliya.com' },
    update: {},
    create: {
      email: 'admin@oreliya.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      roleId: adminRole.id,
      isActive: true,
      emailVerified: true,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@oreliya.com' },
    update: {},
    create: {
      email: 'customer@oreliya.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1987654321',
      roleId: customerRole.id,
      isActive: true,
      emailVerified: true,
    },
  });

  // Create addresses
  // eslint-disable-next-line no-console
  console.log('Creating addresses...');
  const billingAddress = await prisma.address.create({
    data: {
      userId: customerUser.id,
      type: 'billing',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Corp',
      addressLine1: '123 Main Street',
      addressLine2: 'Suite 100',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1987654321',
      isDefault: true,
    },
  });

  const shippingAddress = await prisma.address.create({
    data: {
      userId: customerUser.id,
      type: 'shipping',
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90210',
      country: 'USA',
      phone: '+1987654321',
      isDefault: true,
    },
  });

  // Create categories
  // eslint-disable-next-line no-console
  console.log('Creating categories...');
  const jewelryCategory = await prisma.category.create({
    data: {
      name: 'Jewelry',
      description: 'Beautiful jewelry pieces',
      slug: 'jewelry',
    },
  });

  const watchesCategory = await prisma.category.create({
    data: {
      name: 'Watches',
      description: 'Luxury timepieces',
      slug: 'watches',
    },
  });

  const ringsSubcategory = await prisma.category.create({
    data: {
      name: 'Rings',
      description: 'Elegant rings for all occasions',
      slug: 'rings',
      parentId: jewelryCategory.id,
    },
  });

  // Create products
  // eslint-disable-next-line no-console
  console.log('Creating products...');
  const engagementRing = await prisma.product.create({
    data: {
      name: 'Diamond Engagement Ring',
      description:
        'A stunning 1-carat diamond engagement ring in 14k white gold.',
      slug: 'diamond-engagement-ring',
      sku: 'RING-001',
      price: 2999.99,
      comparePrice: 3499.99,
      costPrice: 1800.0,
      weight: 3.5,
      dimensions: { length: 2.5, width: 2.5, height: 0.3 },
      isActive: true,
      isFeatured: true,
      stockQuantity: 10,
      lowStockThreshold: 3,
      categoryId: ringsSubcategory.id,
    },
  });

  const luxuryWatch = await prisma.product.create({
    data: {
      name: 'Luxury Chronograph Watch',
      description:
        'Premium chronograph watch with leather strap and date display.',
      slug: 'luxury-chronograph-watch',
      sku: 'WATCH-001',
      price: 899.99,
      comparePrice: 1099.99,
      costPrice: 450.0,
      weight: 85.0,
      dimensions: { length: 4.2, width: 4.2, height: 1.2 },
      isActive: true,
      isFeatured: true,
      stockQuantity: 25,
      lowStockThreshold: 5,
      categoryId: watchesCategory.id,
    },
  });

  // Create product images
  // eslint-disable-next-line no-console
  console.log('Creating product images...');
  await prisma.productImage.createMany({
    data: [
      {
        productId: engagementRing.id,
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        alt: 'Diamond Engagement Ring - Front View',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        productId: engagementRing.id,
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        alt: 'Diamond Engagement Ring - Side View',
        isPrimary: false,
        sortOrder: 2,
      },
      {
        productId: luxuryWatch.id,
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
        alt: 'Luxury Chronograph Watch - Front View',
        isPrimary: true,
        sortOrder: 1,
      },
      {
        productId: luxuryWatch.id,
        url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
        alt: 'Luxury Chronograph Watch - Back View',
        isPrimary: false,
        sortOrder: 2,
      },
    ],
  });

  // Create product variants
  // eslint-disable-next-line no-console
  console.log('Creating product variants...');
  await prisma.productVariant.createMany({
    data: [
      {
        productId: engagementRing.id,
        name: 'Size',
        value: '6',
        sku: 'RING-001-6',
        price: 2999.99,
        stockQuantity: 5,
      },
      {
        productId: engagementRing.id,
        name: 'Size',
        value: '7',
        sku: 'RING-001-7',
        price: 2999.99,
        stockQuantity: 3,
      },
      {
        productId: engagementRing.id,
        name: 'Size',
        value: '8',
        sku: 'RING-001-8',
        price: 2999.99,
        stockQuantity: 2,
      },
      {
        productId: luxuryWatch.id,
        name: 'Color',
        value: 'Black',
        sku: 'WATCH-001-BLACK',
        price: 899.99,
        stockQuantity: 15,
      },
      {
        productId: luxuryWatch.id,
        name: 'Color',
        value: 'Brown',
        sku: 'WATCH-001-BROWN',
        price: 899.99,
        stockQuantity: 10,
      },
    ],
  });

  // Create customizations
  // eslint-disable-next-line no-console
  console.log('Creating customizations...');
  await prisma.customization.createMany({
    data: [
      {
        productId: engagementRing.id,
        name: 'Engraving Text',
        type: 'text',
        description: 'Add a personal message inside the ring',
        isRequired: false,
        price: 50.0,
        maxLength: 20,
      },
      {
        productId: luxuryWatch.id,
        name: 'Case Material',
        type: 'select',
        description: 'Choose the watch case material',
        isRequired: true,
        price: 0.0,
        options: ['Stainless Steel', 'Gold Plated', 'Rose Gold'],
      },
    ],
  });

  // Create deals
  // eslint-disable-next-line no-console
  console.log('Creating deals...');
  await prisma.deal.create({
    data: {
      name: 'Summer Sale',
      description: 'Get 20% off on all jewelry items',
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

  // Create cart
  // eslint-disable-next-line no-console
  console.log('Creating cart...');
  const cart = await prisma.cart.create({
    data: {
      userId: customerUser.id,
    },
  });

  // Create cart items
  // eslint-disable-next-line no-console
  console.log('Creating cart items...');
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: luxuryWatch.id,
      quantity: 1,
      price: 899.99,
      customizations: {
        'Case Material': 'Stainless Steel',
      },
    },
  });

  // Create wishlist
  // eslint-disable-next-line no-console
  console.log('Creating wishlist...');
  await prisma.wishlist.create({
    data: {
      userId: customerUser.id,
      productId: engagementRing.id,
    },
  });

  // Create reviews
  // eslint-disable-next-line no-console
  console.log('Creating reviews...');
  await prisma.review.create({
    data: {
      userId: customerUser.id,
      productId: luxuryWatch.id,
      rating: 5,
      title: 'Excellent Quality',
      comment:
        'This watch exceeded my expectations. The quality is outstanding and it looks even better in person.',
      isVerified: true,
    },
  });

  // Create orders
  // eslint-disable-next-line no-console
  console.log('Creating orders...');
  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      userId: customerUser.id,
      status: 'delivered',
      subtotal: 899.99,
      taxAmount: 89.99,
      shippingAmount: 15.0,
      discountAmount: 50.0,
      totalAmount: 954.98,
      billingAddressId: billingAddress.id,
      shippingAddressId: shippingAddress.id,
      trackingNumber: 'TRK123456789',
      shippedAt: new Date('2024-01-15'),
      deliveredAt: new Date('2024-01-18'),
    },
  });

  // Create order items
  // eslint-disable-next-line no-console
  console.log('Creating order items...');
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      productId: luxuryWatch.id,
      quantity: 1,
      price: 899.99,
      customizations: {
        'Case Material': 'Stainless Steel',
      },
    },
  });

  // Create refresh token
  // eslint-disable-next-line no-console
  console.log('Creating refresh token...');
  await prisma.refreshToken.create({
    data: {
      userId: customerUser.id,
      token: 'demo-refresh-token-123',
      expiresAt: new Date('2025-12-31'),
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Database seeding completed successfully!');
  // eslint-disable-next-line no-console
  console.log('\n📊 Seeded Data Summary:');
  // eslint-disable-next-line no-console
  console.log(`- Roles: 2`);
  // eslint-disable-next-line no-console
  console.log(`- Users: 2`);
  // eslint-disable-next-line no-console
  console.log(`- Addresses: 2`);
  // eslint-disable-next-line no-console
  console.log(`- Categories: 3`);
  // eslint-disable-next-line no-console
  console.log(`- Products: 2`);
  // eslint-disable-next-line no-console
  console.log(`- Product Images: 4`);
  // eslint-disable-next-line no-console
  console.log(`- Product Variants: 5`);
  // eslint-disable-next-line no-console
  console.log(`- Customizations: 2`);
  // eslint-disable-next-line no-console
  console.log(`- Deals: 1`);
  // eslint-disable-next-line no-console
  console.log(`- Cart Items: 1`);
  // eslint-disable-next-line no-console
  console.log(`- Wishlist Items: 1`);
  // eslint-disable-next-line no-console
  console.log(`- Reviews: 1`);
  // eslint-disable-next-line no-console
  console.log(`- Orders: 1`);
  // eslint-disable-next-line no-console
  console.log(`- Order Items: 1`);
  // eslint-disable-next-line no-console
  console.log(`- Refresh Tokens: 1`);
  // eslint-disable-next-line no-console
  console.log('\n🔑 Demo Credentials:');
  // eslint-disable-next-line no-console
  console.log('Admin: admin@oreliya.com / password123');
  // eslint-disable-next-line no-console
  console.log('Customer: customer@oreliya.com / password123');
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
