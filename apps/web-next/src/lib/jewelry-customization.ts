// Jewelry customization constants and configurations

export const JEWELRY_CATEGORIES = {
  RINGS: 'rings',
  EARRINGS: 'earrings', 
  BRACELETS: 'bracelets',
  NECKLACES: 'necklaces',
  MANGALSUTRA: 'mangalsutra'
} as const;

export const COMMON_OPTIONS = {
  METAL_TYPES: ['Yellow Gold', 'White Gold', 'Rose Gold'],
  PURITY: ['22kt', '18kt', '14kt', '9kt'],
  STONE_TYPES: ['Natural Diamond', 'Lab Diamond', 'Moissanite'],
  CARAT_SIZES: [0.25, 0.5, 0.75, 1, 2, 3, 4, 5]
} as const;

export const RING_SIZES = Array.from({ length: 14 }, (_, i) => i + 5); // 5-18

export const CUSTOMIZATION_TEMPLATES = {
  [JEWELRY_CATEGORIES.RINGS]: [
    {
      name: 'Metal Type',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.METAL_TYPES,
      category: JEWELRY_CATEGORIES.RINGS,
      sortOrder: 1
    },
    {
      name: 'Purity',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.PURITY,
      category: JEWELRY_CATEGORIES.RINGS,
      sortOrder: 2
    },
    {
      name: 'Stone',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.STONE_TYPES,
      category: JEWELRY_CATEGORIES.RINGS,
      sortOrder: 3
    },
    {
      name: 'Ring Size',
      type: 'number' as const,
      required: true,
      minValue: 5,
      maxValue: 18,
      category: JEWELRY_CATEGORIES.RINGS,
      sortOrder: 4
    },
    {
      name: 'Carat Size',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.CARAT_SIZES.map(size => `${size}ct`),
      category: JEWELRY_CATEGORIES.RINGS,
      sortOrder: 5
    },
    {
      name: 'Free Engraving',
      type: 'text' as const,
      required: false,
      maxLength: 20,
      pattern: '^[A-Za-z0-9 ]{0,20}$',
      helpText: 'Up to 20 characters, letters and numbers only',
      category: JEWELRY_CATEGORIES.RINGS,
      sortOrder: 6
    }
  ],
  [JEWELRY_CATEGORIES.EARRINGS]: [
    {
      name: 'Metal Type',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.METAL_TYPES,
      category: JEWELRY_CATEGORIES.EARRINGS,
      sortOrder: 1
    },
    {
      name: 'Purity',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.PURITY,
      category: JEWELRY_CATEGORIES.EARRINGS,
      sortOrder: 2
    },
    {
      name: 'Stone',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.STONE_TYPES,
      category: JEWELRY_CATEGORIES.EARRINGS,
      sortOrder: 3
    },
    {
      name: 'Carat Size',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.CARAT_SIZES.map(size => `${size}ct`),
      category: JEWELRY_CATEGORIES.EARRINGS,
      sortOrder: 4
    }
  ],
  [JEWELRY_CATEGORIES.BRACELETS]: [
    {
      name: 'Metal Type',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.METAL_TYPES,
      category: JEWELRY_CATEGORIES.BRACELETS,
      sortOrder: 1
    },
    {
      name: 'Purity',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.PURITY,
      category: JEWELRY_CATEGORIES.BRACELETS,
      sortOrder: 2
    },
    {
      name: 'Stone',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.STONE_TYPES,
      category: JEWELRY_CATEGORIES.BRACELETS,
      sortOrder: 3
    },
    {
      name: 'Carat Size',
      type: 'select' as const,
      required: false,
      options: COMMON_OPTIONS.CARAT_SIZES.map(size => `${size}ct`),
      category: JEWELRY_CATEGORIES.BRACELETS,
      sortOrder: 4
    }
  ],
  [JEWELRY_CATEGORIES.NECKLACES]: [
    {
      name: 'Metal Type',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.METAL_TYPES,
      category: JEWELRY_CATEGORIES.NECKLACES,
      sortOrder: 1
    },
    {
      name: 'Purity',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.PURITY,
      category: JEWELRY_CATEGORIES.NECKLACES,
      sortOrder: 2
    },
    {
      name: 'Stone',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.STONE_TYPES,
      category: JEWELRY_CATEGORIES.NECKLACES,
      sortOrder: 3
    },
    {
      name: 'Carat Size',
      type: 'select' as const,
      required: false,
      options: COMMON_OPTIONS.CARAT_SIZES.map(size => `${size}ct`),
      category: JEWELRY_CATEGORIES.NECKLACES,
      sortOrder: 4
    }
  ],
  [JEWELRY_CATEGORIES.MANGALSUTRA]: [
    {
      name: 'Metal Type',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.METAL_TYPES,
      category: JEWELRY_CATEGORIES.MANGALSUTRA,
      sortOrder: 1
    },
    {
      name: 'Purity',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.PURITY,
      category: JEWELRY_CATEGORIES.MANGALSUTRA,
      sortOrder: 2
    },
    {
      name: 'Stone',
      type: 'select' as const,
      required: true,
      options: COMMON_OPTIONS.STONE_TYPES,
      category: JEWELRY_CATEGORIES.MANGALSUTRA,
      sortOrder: 3
    },
    {
      name: 'Carat Size',
      type: 'select' as const,
      required: false,
      options: COMMON_OPTIONS.CARAT_SIZES.map(size => `${size}ct`),
      category: JEWELRY_CATEGORIES.MANGALSUTRA,
      sortOrder: 4
    }
  ]
} as const;

export type JewelryCategory = typeof JEWELRY_CATEGORIES[keyof typeof JEWELRY_CATEGORIES];

export interface CustomizationTemplate {
  name: string;
  type: 'text' | 'image' | 'color' | 'select' | 'number';
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  maxLength?: number;
  pattern?: string;
  helpText?: string;
  category: JewelryCategory;
  sortOrder: number;
}
