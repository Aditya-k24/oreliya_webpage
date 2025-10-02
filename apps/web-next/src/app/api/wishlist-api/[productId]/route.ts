export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { WishlistController } from '@/api-lib/controllers/wishlistController';
import { WishlistService } from '@/api-lib/services/wishlistService';
import { WishlistRepository } from '@/api-lib/repositories/wishlistRepository';
import prisma from '@/api-lib/config/database';

const wishlistRepository = new WishlistRepository(prisma);
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

export const DELETE = createNextRouteHandler(wishlistController.removeFromWishlist);


