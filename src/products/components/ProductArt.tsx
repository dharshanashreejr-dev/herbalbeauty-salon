import type { ArtType } from '../types';

/**
 * Real product photography replaces the previous SVG/vector product illustrations.
 * These are photographic packshots/lifestyle product images hosted by the original
 * image publishers. The UI and card layout remain unchanged.
 */
const PHOTO_BY_ART: Partial<Record<ArtType, string>> = {
  dropper: 'https://fleurandbee.com/cdn/shop/files/ultra-hydrating-serum-Fby-Fleur-and-Bee_600x.jpg?v=1715804025',
  bottle: 'https://naraforall.com/cdn/shop/products/image_1200x1200.jpg?v=1664554590',
  pump: 'https://www.rowecasaorganics.com/cdn/shop/files/ScentBundle-Spearmint_Eucalyptus.png?v=1762200127',
  jar: 'https://www.woodberg.de/cdn/shop/files/Evolve-Daily-Renew-Facial-Cream-60ml-02.jpg?v=1752747001&width=1000',
  tube: 'https://www.pureanada.ca/cdn/shop/files/hand-body-lotion-citrus-got-real-tiber-river-1.jpg?v=1753203179&width=1946',
  stick: 'https://i.pinimg.com/originals/0e/ab/1c/0eab1c416bfef22d50895fe9c7f9d125.jpg',
  lipstick: 'https://i.pinimg.com/originals/0e/ab/1c/0eab1c416bfef22d50895fe9c7f9d125.jpg',
  gloss: 'https://akcdn.detik.net.id/visual/2024/07/17/perkembangan-lipstik-pada-1915-hingga-1920-an-foto-freepikcom-1.jpeg?q=90&w=700',
  compact: 'https://bellamianta.com/cdn/shop/files/lifestyleswatch-min.png?v=1707740323&width=1080',
  palette: 'https://bellamianta.com/cdn/shop/files/lifestyleswatch-min.png?v=1707740323&width=1080',
  spray: 'https://www.rowecasaorganics.com/cdn/shop/files/ScentBundle-Spearmint_Eucalyptus.png?v=1762200127',
  candle: 'https://giftedbyfreefrom.org/cdn/shop/files/Collective_Care_Gift_Box.jpg?v=1730751770',
  box: 'https://dulawellness.com/cdn/shop/products/jojoba-calming-aceites-minis-cuadrada-web_241aa598-b9af-470e-ada9-010b0e823d72_1080x.jpg?v=1708365369',
};

const FALLBACK = 'https://naraforall.com/cdn/shop/products/image_1200x1200.jpg?v=1664554590';

interface Props { art: ArtType; colour: string; className?: string }

export default function ProductArt({ art, className }: Props) {
  const src = PHOTO_BY_ART[art] ?? FALLBACK;
  return (
    <img
      src={src}
      alt="Real beauty and wellness product photography"
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`${className ?? ''} h-full w-full object-contain object-center mix-blend-multiply`}
      onError={(e) => {
        const el = e.currentTarget;
        if (el.src !== FALLBACK) el.src = FALLBACK;
      }}
    />
  );
}
