import Link from 'next/link';
import {
  HeroVideo,
  MarqueeBand,
  CollectionsGrid,
  StatsStrip,
  CraftsmanshipSection,
  PromiseSection,
  CTAStrip,
} from '@/components/ui';

const categories = [
  {
    name: 'Rings',
    image: '/images/categories/engagement_rings.png',
    href: '/products?category=rings',
  },
  {
    name: 'Necklaces',
    image: '/images/categories/everyday.png',
    href: '/products?category=necklaces',
  },
  {
    name: 'Earrings',
    image: '/images/categories/Earrings.png',
    href: '/products?category=earrings',
  },
  {
    name: 'Mangalsutra',
    image: '/images/categories/Mangalsutra.png',
    href: '/products?category=mangalsutra',
  },
];

export default function Page() {
  return (
    <>
      <HeroVideo linkComponent={Link} />
      <MarqueeBand />
      <CollectionsGrid categories={categories} linkComponent={Link} />
      <StatsStrip />
      <CraftsmanshipSection linkComponent={Link} />
      <PromiseSection />
      <CTAStrip linkComponent={Link} />
    </>
  );
}
