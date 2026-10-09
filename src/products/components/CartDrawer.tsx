import type { CartItem } from '../types';
import { formatPrice } from '../data/products';
import { FREE_SHIP, subtotalOf } from '../lib';
import ProductArt from './ProductArt';

interface Props { open: boolean; items: CartItem[]; onClose: () => void; onQty: (k: string, d: number) => void; onRemove: (k: string) => void; onCheckout: () => void }

export default function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }: Props) {
  if (!open) return null;
  const sub = subtotalOf(items);
  const left = Math.max(0, FREE_SHIP - sub);
  return (
    <div className="fixed inset-0 z-50 animate-fade bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <aside onClick={e => e.stopPropagation()} className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide flex-col bg-sand shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 p-6">
          <h2 className="font-serif text-3xl">Your cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="text-2xl">×</button>
        </div>
        {items.length === 0 ? (
          <p className="m-auto font-serif text-2xl italic text-stone-500">Your cart is empty</p>
        ) : (
          <>
            <div className="px-6 pt-5 text-sm">
              <p className="text-stone-600">{left === 0 ? 'You have unlocked complimentary shipping' : `Add ${formatPrice(left)} more for complimentary shipping`}</p>
              <div className="mt-2 h-1 rounded-full bg-stone-200"><div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${Math.min(100, (sub / FREE_SHIP) * 100)}%` }} /></div>
            </div>
            <ul className="flex-1 space-y-5 overflow-y-auto p-6">
              {items.map(i => (
                <li key={i.key} className="flex gap-4 animate-rise">
                  <div className="h-24 w-20 shrink-0 rounded-2xl" style={{ background: `${i.colour.hex}33` }}><ProductArt art={i.product.art} colour={i.colour.hex} className="h-full w-full p-1" /></div>
                  <div className="flex-1 text-sm">
                    <p className="font-serif text-xl leading-tight">{i.product.name}</p>
                    <p className="text-stone-500">{i.colour.name} · {i.size}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-stone-300 bg-white">
                        <button onClick={() => onQty(i.key, -1)} className="h-8 w-8" aria-label="Decrease">−</button><span className="w-6 text-center">{i.qty}</span><button onClick={() => onQty(i.key, 1)} className="h-8 w-8" aria-label="Increase">+</button>
                      </div>
                      <span>{formatPrice(i.product.price * i.qty)}</span>
                    </div>
                    <button onClick={() => onRemove(i.key)} className="mt-1 text-xs text-stone-500 underline">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-stone-200 p-6">
              <div className="flex justify-between text-lg"><span>Subtotal</span><span className="font-medium">{formatPrice(sub)}</span></div>
              <button onClick={onCheckout} className="btn-primary gold-btn w-full rounded-full py-4 text-sm tracking-widest">PROCEED TO CHECKOUT</button>
              <button onClick={onClose} className="w-full text-sm text-stone-600 underline">Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
