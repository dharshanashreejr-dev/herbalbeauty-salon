import { useCallback, useEffect, useState } from 'react';
import Categories from './components/Categories';
import ProductsSection from './components/ProductsSection';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import Confirmation from './components/Confirmation';
import SiteHeader from '../shared/SiteHeader';
import type { Address, CartItem, CategoryKey, Colour, Order, Product } from './types';

const getRoute = () => (location.hash.startsWith('#/') ? location.hash.slice(2) : '');
const go = (r: string) => { location.hash = `#/${r}`; };
const PERKS = ['Complimentary shipping above ₹4,999', 'Dermatologist tested', 'Cruelty free', 'Signature gift packaging', 'Secure payments'];

export default function App() {
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [open, setOpen] = useState<{ product: Product; colour: Colour } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const h = () => { setRoute(getRoute()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const select = (c: CategoryKey) => {
    const first = category === null;
    setCategory(c);
    setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), first ? 80 : 0);
  };
  const close = useCallback(() => setOpen(null), []);

  const add = (product: Product, colour: Colour, size: string, qty: number) => {
    const key = `${product.id}|${colour.name}|${size}`;
    setCart(c => c.some(i => i.key === key)
      ? c.map(i => (i.key === key ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i))
      : [...c, { key, product, colour, size, qty }]);
    setOpen(null);
    setDrawer(true);
  };
  const changeQty = (k: string, d: number) => setCart(c => c.map(i => (i.key === k ? { ...i, qty: Math.max(1, Math.min(i.product.stock, i.qty + d)) } : i)));
  const remove = (k: string) => setCart(c => c.filter(i => i.key !== k));
  const count = cart.reduce((t, i) => t + i.qty, 0);

  const page = route === 'checkout' && cart.length ? 'checkout' : route === 'payment' && cart.length && address ? 'payment' : route === 'confirmed' && order ? 'confirmed' : 'shop';

  return (
    <div className="min-h-screen">
      <SiteHeader current="Products" solid cartCount={count} onCart={page === 'shop' ? () => setDrawer(true) : () => go('')} />
      <div className="h-20" aria-hidden="true" />


      {page === 'shop' && (
        <main id="top">
          <div className="overflow-hidden bg-gold py-2 text-xs uppercase tracking-[.3em] text-night">
            <div className="marquee flex w-max gap-12 whitespace-nowrap">{[...PERKS, ...PERKS, ...PERKS, ...PERKS].map((p, i) => <span key={i}>✦ {p}</span>)}</div>
          </div>
          <Categories active={category} onSelect={select} />
          {category && <ProductsSection category={category} onCategory={setCategory} onOpen={(product, colour) => setOpen({ product, colour })} onQuick={(p, c) => add(p, c, p.sizes[0], 1)} />}
        </main>
      )}
      {page === 'checkout' && <Checkout items={cart} initial={address} onBack={() => go('')} onNext={a => { setAddress(a); go('payment'); }} />}
      {page === 'payment' && address && <Payment items={cart} address={address} onBack={() => go('checkout')} onPlace={o => { setOrder(o); setCart([]); go('confirmed'); }} />}
      {page === 'confirmed' && order && <Confirmation order={order} onShop={() => go('')} />}

      <footer className="bg-night px-5 py-12 text-center text-sm text-stone-400"><p className="gold-text font-serif text-3xl italic">VELVET TOUCH</p><p className="mt-2 tracking-widest">FACE · WELLNESS · BODY</p></footer>

      <CartDrawer open={drawer} items={cart} onClose={() => setDrawer(false)} onQty={changeQty} onRemove={remove} onCheckout={() => { setDrawer(false); go('checkout'); }} />
      {open && <ProductModal key={open.product.id} product={open.product} initialColour={open.colour} onClose={close} onAdd={(c, s, q) => add(open.product, c, s, q)} />}
    </div>
  );
}
