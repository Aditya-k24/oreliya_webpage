import { createNextRouteHandler } from '@/api-lib/adapters/nextjs';
import { WishlistController } from '@/api-lib/controllers/wishlistController';
import { WishlistService } from '@/api-lib/services/wishlistService';
import { WishlistRepository } from '@/api-lib/repositories/wishlistRepository';
import { prisma } from '@/api-lib/prisma';

const wishlistRepository = new WishlistRepository(prisma);
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

export const GET = createNextRouteHandler(wishlistController.getWishlist);
export const POST = createNextRouteHandler(wishlistController.addToWishlist);
export const DELETE = createNextRouteHandler(wishlistController.clearWishlist);


