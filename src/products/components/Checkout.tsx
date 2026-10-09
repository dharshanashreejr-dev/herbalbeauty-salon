import { useState } from 'react';
import type { Address, CartItem } from '../types';
import { formatPrice } from '../data/products';
import { FREE_SHIP, shipFee, subtotalOf } from '../lib';
import { Steps, Summary } from './CheckoutParts';

interface Props { items: CartItem[]; initial: Address | null; onNext: (a: Address) => void; onBack: () => void }
const EMPTY: Address = { name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pin: '', method: 'standard' };

export default function Checkout({ items, initial, onNext, onBack }: Props) {
  const [a, setA] = useState<Address>(initial ?? EMPTY);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const sub = subtotalOf(items);
  const set = (k: keyof Address, v: string) => setA(p => ({ ...p, [k]: v }));

  const submit = () => {
    const e: Record<string, string> = {};
    if (a.name.trim().length < 2) e.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(a.email)) e.email = 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(a.phone)) e.phone = 'Enter a 10-digit mobile number';
    if (a.line1.trim().length < 5) e.line1 = 'Enter your address';
    if (!a.city.trim()) e.city = 'Enter city';
    if (!a.state.trim()) e.state = 'Enter state';
    if (!/^\d{6}$/.test(a.pin)) e.pin = 'Enter a 6-digit PIN';
    setErrs(e);
    if (!Object.keys(e).length) onNext(a);
  };
  const f = (k: keyof Address, label: string, props: { type?: string; max?: number; span?: boolean } = {}) => (
    <label className={`block ${props.span ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs uppercase tracking-widest text-stone-500">{label}</span>
      <input className={`field ${errs[k] ? 'err' : ''}`} type={props.type ?? 'text'} maxLength={props.max} value={a[k]} onChange={e => set(k, e.target.value)} />
      {errs[k] && <span className="text-xs text-rose-700">{errs[k]}</span>}
    </label>
  );
  const opts: ['standard' | 'express', string, string][] = [['standard', 'Standard delivery', '4 to 6 days'], ['express', 'Express delivery', '1 to 2 days']];

  return (
    <section className="mx-auto max-w-6xl animate-rise px-5 py-14 sm:px-8">
      <Steps at={1} />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <div>
            <h1 className="font-serif text-5xl">Delivery <span className="gold-text italic">details</span></h1>
            <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {f('name', 'Full name', { span: true })}{f('email', 'Email', { type: 'email' })}{f('phone', 'Mobile', { max: 10 })}
              {f('line1', 'Address line 1', { span: true })}{f('line2', 'Apartment, landmark (optional)', { span: true })}
              {f('city', 'City')}{f('state', 'State')}{f('pin', 'PIN code', { max: 6 })}
            </div>
          </div>
          <div>
            <h2 className="font-serif text-3xl">Shipping method</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {opts.map(([k, t, d]) => (
                <button key={k} onClick={() => set('method', k)} aria-pressed={a.method === k} className={`rounded-2xl border p-5 text-left transition ${a.method === k ? 'border-gold bg-white shadow-lg' : 'border-stone-300 hover:border-gold'}`}>
                  <p className="font-medium">{t}</p><p className="text-sm text-stone-500">{d}</p>
                  <p className="mt-2 text-gold">{shipFee(sub, k) === 0 ? 'Complimentary' : formatPrice(shipFee(sub, k))}</p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone-500">Standard shipping is complimentary above {formatPrice(FREE_SHIP)}.</p>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="text-sm underline">← Back to shop</button>
            <button onClick={submit} className="btn-primary gold-btn rounded-full px-10 py-4 text-sm tracking-widest">CONTINUE TO PAYMENT</button>
          </div>
        </div>
        <Summary items={items} subtotal={sub} shipping={shipFee(sub, a.method)} />
      </div>
    </section>
  );
}
