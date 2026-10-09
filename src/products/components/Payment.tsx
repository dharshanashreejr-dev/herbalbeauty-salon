import { useState } from 'react';
import type { Address, CartItem, Order } from '../types';
import { COD_FEE, shipFee, subtotalOf } from '../lib';
import { formatPrice } from '../data/products';
import { Steps, Summary } from './CheckoutParts';

type Mode = 'upi' | 'card' | 'netbanking' | 'cod';
const MODES: [Mode, string, string][] = [['upi', 'UPI', 'GPay, PhonePe, Paytm'], ['card', 'Credit / Debit card', 'Visa, Mastercard, RuPay'], ['netbanking', 'Net banking', 'All major banks'], ['cod', 'Cash on delivery', `Extra ${formatPrice(COD_FEE)}`]];
const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];

export default function Payment({ items, address, onBack, onPlace }: { items: CartItem[]; address: Address; onBack: () => void; onPlace: (o: Order) => void }) {
  const [mode, setMode] = useState<Mode>('upi');
  const [v, setV] = useState({ upi: '', num: '', exp: '', cvv: '', holder: '', bank: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const sub = subtotalOf(items), ship = shipFee(sub, address.method), fee = mode === 'cod' ? COD_FEE : 0;
  const set = (k: keyof typeof v, x: string) => setV(p => ({ ...p, [k]: x }));

  const pay = () => {
    let e = '';
    if (mode === 'upi' && !/^[\w.\-]{2,}@[a-z]{2,}$/i.test(v.upi)) e = 'Enter a valid UPI ID, e.g. name@okbank';
    if (mode === 'card') {
      if (v.num.replace(/\s/g, '').length !== 16) e = 'Enter a 16-digit card number';
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.exp)) e = 'Expiry must be MM/YY';
      else if (!/^\d{3}$/.test(v.cvv)) e = 'Enter the 3-digit CVV';
      else if (v.holder.trim().length < 2) e = 'Enter the name on card';
    }
    if (mode === 'netbanking' && !v.bank) e = 'Select your bank';
    setErr(e);
    if (e) return;
    setBusy(true);
    setTimeout(() => {
      const d = new Date(), eta = new Date(Date.now() + (address.method === 'express' ? 2 : 6) * 864e5);
      const fmt = (x: Date) => x.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      onPlace({ id: `LUM${Math.floor(10000000 + Math.random() * 89999999)}`, items, address, pay: MODES.find(m => m[0] === mode)![1], subtotal: sub, shipping: ship, fee, total: sub + ship + fee, date: fmt(d), eta: fmt(eta) });
    }, 2200);
  };

  return (
    <section className="mx-auto max-w-6xl animate-rise px-5 py-14 sm:px-8">
      <Steps at={2} />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h1 className="font-serif text-5xl">Payment <span className="gold-text italic">mode</span></h1>
          <p className="mt-2 text-sm text-stone-500">Shipping to {address.name}, {address.city} {address.pin}</p>
          <div className="mt-8 space-y-3">
            {MODES.map(([k, t, d]) => (
              <div key={k} className={`overflow-hidden rounded-2xl border transition-all duration-500 ${mode === k ? 'border-gold bg-white shadow-lg' : 'border-stone-300'}`}>
                <button onClick={() => { setMode(k); setErr(''); }} aria-pressed={mode === k} className="flex w-full items-center justify-between p-5 text-left">
                  <span><span className="block font-medium">{t}</span><span className="text-sm text-stone-500">{d}</span></span>
                  <span className={`h-5 w-5 rounded-full border-2 ${mode === k ? 'border-gold bg-gold ring-2 ring-white ring-inset' : 'border-stone-300'}`} />
                </button>
                {mode === k && (
                  <div className="animate-fade grid gap-5 border-t border-stone-100 p-5 sm:grid-cols-2">
                    {k === 'upi' && <input className="field sm:col-span-2" placeholder="yourname@okbank" value={v.upi} onChange={e => set('upi', e.target.value)} aria-label="UPI ID" />}
                    {k === 'card' && (<>
                      <input className="field sm:col-span-2" placeholder="Card number" inputMode="numeric" maxLength={19} value={v.num} onChange={e => set('num', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} aria-label="Card number" />
                      <input className="field" placeholder="MM/YY" maxLength={5} value={v.exp} onChange={e => set('exp', e.target.value.replace(/^(\d{2})(\d)/, '$1/$2'))} aria-label="Expiry" />
                      <input className="field" placeholder="CVV" type="password" maxLength={3} value={v.cvv} onChange={e => set('cvv', e.target.value.replace(/\D/g, ''))} aria-label="CVV" />
                      <input className="field sm:col-span-2" placeholder="Name on card" value={v.holder} onChange={e => set('holder', e.target.value)} aria-label="Name on card" />
                    </>)}
                    {k === 'netbanking' && <select className="field sm:col-span-2" value={v.bank} onChange={e => set('bank', e.target.value)} aria-label="Bank"><option value="">Select your bank</option>{BANKS.map(b => <option key={b}>{b}</option>)}</select>}
                    {k === 'cod' && <p className="text-sm text-stone-600 sm:col-span-2">Pay in cash when your order arrives. A small handling fee applies.</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
          {err && <p className="mt-4 text-sm text-rose-700" role="alert">{err}</p>}
          <div className="mt-8 flex items-center justify-between">
            <button onClick={onBack} className="text-sm underline">← Back to details</button>
            <button onClick={pay} disabled={busy} className="btn-primary gold-btn rounded-full px-10 py-4 text-sm tracking-widest disabled:opacity-60">{mode === 'cod' ? 'PLACE ORDER' : `PAY ${formatPrice(sub + ship + fee)}`}</button>
          </div>
        </div>
        <Summary items={items} subtotal={sub} shipping={ship} fee={fee} />
      </div>
      {busy && (
        <div className="fixed inset-0 z-[60] flex animate-fade flex-col items-center justify-center bg-night/95 text-white">
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
          <p className="mt-8 font-serif text-3xl italic">Securing your order…</p>
        </div>
      )}
    </section>
  );
}
