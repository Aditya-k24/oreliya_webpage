// Simple dev-only in-memory product store
export type DevProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  images?: string[];
  customizations?: any[];
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
};

declare global {
   
  var __DEV_PRODUCTS__: DevProduct[] | undefined;
}

const devProducts: DevProduct[] = globalThis.__DEV_PRODUCTS__ ?? (globalThis.__DEV_PRODUCTS__ = []);

export function list(): DevProduct[] {
  return devProducts;
}

export function add(product: DevProduct): void {
  // Avoid duplicates by checking if product with same ID or slug exists
  const existingIndex = devProducts.findIndex(p => p.id === product.id || (product.slug && p.slug === product.slug));
  if (existingIndex >= 0) {
    devProducts[existingIndex] = product; // Update existing
  } else {
    devProducts.push(product);
  }
}

export function removeById(id: string): boolean {
  const index = devProducts.findIndex(p => p.id === id);
  if (index >= 0) {
    devProducts.splice(index, 1);
    return true;
  }
  return false;
}

export function removeBySlug(slug: string): boolean {
  const index = devProducts.findIndex(p => p.slug === slug);
  if (index >= 0) {
    devProducts.splice(index, 1);
    return true;
  }
  return false;
}


