import { useMemo, useState } from 'react'
import { Link } from '../SmartLink'
import { Tilt, Counter, Photo } from '../components/three'
import Admin from './Admin'
import { products } from '../shop'
import { money, spa } from '../data'
import { getBookings, iso } from '../store'
import { ORDER_STAGES, REORDER, advanceMOrder, cancelMOrder, customers, getMOrders, getStock, setStock, topSold, week } from '../manager'
import { fmtWhen } from '../account'

type Tab = 'overview' | 'orders' | 'inventory' | 'customers' | 'schedule'
const TABS: [Tab, string][] = [['overview', 'Overview'], ['orders', 'Orders'], ['inventory', 'Inventory'], ['customers', 'Customers'], ['schedule', 'Schedule']]
const PIN = '1234'
const stageTone = (s: number, c: boolean) => (c ? 'bg-red-600/15 text-red-700' : s === 4 ? 'bg-green-600/15 text-green-700' : 'bg-gold/25 text-[#8c6d35]')

function Gate({ onOk }: { onOk: () => void }) {
  const [v, setV] = useState(''), [bad, setBad] = useState(false)
  return (
    <main className="relative min-h-screen bg-ink text-sand flex items-center justify-center px-5 overflow-hidden">
      <Photo k="reception" className="absolute inset-0 h-full w-full kenburns opacity-50" /><div className="absolute inset-0 bg-gradient-to-b from-black/60 to-ink" />
      <Tilt max={8} className="relative glass p-8 md:p-10 w-full max-w-md text-center">
        <p className="label text-gold">{spa.name} · Manager access</p><h1 className="h text-4xl mt-4">Enter PIN.</h1>
        <form onSubmit={(e) => { e.preventDefault(); if (v === PIN) { sessionStorage.setItem('VELVET TOUCH-mgr', '1'); onOk() } else setBad(true) }}>
          <input autoFocus type="password" inputMode="numeric" value={v} onChange={(e) => { setV(e.target.value); setBad(false) }} placeholder="••••" className="mt-8 w-full bg-transparent border-b border-sand/40 text-center text-2xl tracking-[.5em] py-2 outline-none focus:border-gold" />
          {bad && <p className="text-xs text-red-300 mt-3">Wrong PIN. Demo PIN is 1234.</p>}
          <button className="mt-8 bg-gold text-ink rounded-full px-8 py-4 label hover:bg-sand transition">Unlock dashboard</button>
        </form>
      </Tilt>
    </main>
  )
}

function Overview({ go }: { go: (t: Tab) => void }) {
  const orders = getMOrders(), stock = getStock(), today = iso(new Date())
  const rev = orders.filter((o) => !o.cancelled).reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => !o.cancelled && o.stage < 4).length
  const appts = getBookings().filter((b) => b.date === today && b.status === 'Confirmed').length
  const low = products.filter((p) => stock[p.id] <= REORDER)
  const max = Math.max(...week.map((w) => w[1] + w[2]))
  const topMax = topSold[0][1]
  const k: [number, string, string, string?][] = [[rev, 'Product revenue', '₹'], [pending, 'Orders in progress', ''], [appts, 'Appointments today', ''], [low.length, 'Low-stock alerts', '']]
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {k.map(([n, l, pre]) => <Tilt key={l} max={10} className="bg-ink text-sand p-5 md:p-6"><p className="h text-3xl md:text-5xl text-gold" style={{ transform: 'translateZ(30px)' }}><Counter to={n} prefix={pre} /></p><p className="label mt-3">{l}</p></Tilt>)}
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white/60 border border-ink/10 p-6">
          <div className="flex justify-between"><h3 className="h text-2xl">This week</h3><span className="flex gap-4 label"><span><i className="inline-block h-2 w-2 bg-ink mr-1" />Products</span><span><i className="inline-block h-2 w-2 bg-gold mr-1" />Spa</span></span></div>
          <div className="flex items-end gap-3 h-56 mt-8">{week.map(([d, a, b], i) => (
            <div key={d} className="flex-1 flex flex-col items-center justify-end h-full group">
              <span className="text-[.65rem] opacity-0 group-hover:opacity-100 transition mb-1">₹{a + b}k</span>
              <div className="w-full flex flex-col justify-end transition-all duration-1000 ease-out" style={{ height: `${((a + b) / max) * 100}%`, transitionDelay: `${i * 90}ms` }}>
                <div className="bg-gold" style={{ flex: b }} /><div className="bg-ink" style={{ flex: a }} /></div>
              <span className="label mt-2">{d}</span></div>))}</div>
        </div>
        <div className="bg-white/60 border border-ink/10 p-6"><h3 className="h text-2xl">Top sellers</h3>
          <div className="mt-6 space-y-4">{topSold.map(([n, u]) => <div key={n}><div className="flex justify-between text-xs"><span>{n}</span><span>{u} units</span></div><div className="h-1.5 bg-ink/10 mt-1.5 rounded-full overflow-hidden"><div className="h-full bg-gold transition-all duration-1000" style={{ width: `${(u / topMax) * 100}%` }} /></div></div>)}</div></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/60 border border-ink/10 p-6"><div className="flex justify-between items-center"><h3 className="h text-2xl">Latest orders</h3><button onClick={() => go('orders')} className="label underline">View all</button></div>
          {orders.slice(0, 5).map((o) => <p key={o.id} className="flex justify-between gap-3 border-t border-ink/10 py-3 text-xs first:mt-4"><span>{o.id} · {o.customer}</span><span className={`label px-3 py-1 rounded-full ${stageTone(o.stage, o.cancelled)}`}>{o.cancelled ? 'Cancelled' : ORDER_STAGES[o.stage]}</span></p>)}</div>
        <div className="bg-ink text-sand p-6"><div className="flex justify-between items-center"><h3 className="h text-2xl">Needs attention</h3><button onClick={() => go('inventory')} className="label underline">Inventory</button></div>
          {low.length ? low.map((p) => <p key={p.id} className="flex gap-3 items-center border-t border-sand/15 py-3 text-xs first:mt-4"><Photo k={p.img} className="h-10 w-9" /><span className="flex-1">{p.name}</span><span className="text-gold">{stock[p.id]} left</span></p>) : <p className="text-xs mt-4 opacity-70">All stock healthy.</p>}</div>
      </div>
    </div>
  )
}

function Orders() {
  const [, t] = useState(0), re = () => t((n) => n + 1)
  const [f, setF] = useState('All'), [q, setQ] = useState('')
  const all = getMOrders()
  const list = useMemo(() => all.filter((o) => (f === 'All' || (f === 'Cancelled' ? o.cancelled : !o.cancelled && ORDER_STAGES[o.stage] === f)) && (o.id + o.customer + o.items).toLowerCase().includes(q.toLowerCase())), [all, f, q])
  const chip = (on: boolean) => `px-4 py-2 rounded-full border text-xs transition ${on ? 'bg-ink text-sand border-ink' : 'border-ink/25 hover:border-ink'}`
  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">{['All', ...ORDER_STAGES, 'Cancelled'].map((s) => <button key={s} onClick={() => setF(s)} className={chip(f === s)}>{s}</button>)}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, customer…" className="ml-auto bg-transparent border-b border-ink/40 py-2 text-xs w-full md:w-64 outline-none focus:border-ink" /></div>
      <div className="overflow-x-auto mt-6 bg-white/60 border border-ink/10"><table className="min-w-full text-xs text-left">
        <thead className="label opacity-60"><tr>{['Order', 'Customer', 'Items', 'Total', 'Payment', 'Placed', 'Progress', 'Status', ''].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{list.map((o) => (
          <tr key={o.id} className={`border-t border-ink/10 ${o.cancelled ? 'opacity-40' : ''}`}>
            <td className="p-3 whitespace-nowrap font-medium">{o.id}</td><td className="p-3">{o.customer}<br /><span className="opacity-60">{o.phone}</span></td><td className="p-3">{o.items}</td>
            <td className="p-3 whitespace-nowrap">{money(o.total)}</td><td className="p-3">{o.payment}</td><td className="p-3 whitespace-nowrap">{fmtWhen(o.placed)}</td>
            <td className="p-3 w-32"><div className="h-1.5 bg-ink/10 rounded-full overflow-hidden"><div className="h-full bg-gold transition-all duration-700" style={{ width: `${((o.stage + 1) / ORDER_STAGES.length) * 100}%` }} /></div></td>
            <td className="p-3"><span className={`label px-3 py-1 rounded-full whitespace-nowrap ${stageTone(o.stage, o.cancelled)}`}>{o.cancelled ? 'Cancelled' : ORDER_STAGES[o.stage]}</span></td>
            <td className="p-3 whitespace-nowrap">{!o.cancelled && o.stage < 4 && <><button onClick={() => { advanceMOrder(o.id); re() }} className="underline mr-3">Advance →</button><button onClick={() => { cancelMOrder(o.id); re() }} className="underline opacity-60">Cancel</button></>}</td>
          </tr>))}</tbody></table>
        {!list.length && <p className="p-6 text-xs opacity-60">No orders match.</p>}</div>
    </div>
  )
}

function Inventory() {
  const [, t] = useState(0), re = () => t((n) => n + 1)
  const stock = getStock()
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{products.map((p, n) => {
      const s = stock[p.id], low = s <= REORDER
      return (
        <div key={p.id} style={{ animationDelay: `${n * 50}ms` }} className="fade-up"><Tilt max={6} className="bg-white/60 border border-ink/10 flex">
          <Photo k={p.img} className="h-36 w-28 shrink-0" />
          <div className="flex-1 p-4 min-w-0"><div className="flex justify-between gap-2"><p className="label opacity-60">{p.category}</p>{low && <span className="label text-red-700">Low</span>}</div>
            <h3 className="h text-base mt-1 truncate">{p.name}</h3><p className="text-xs opacity-60">{money(p.price)}</p>
            <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden mt-3"><div className={`h-full transition-all duration-700 ${low ? 'bg-red-600' : 'bg-gold'}`} style={{ width: `${Math.min(s, 100)}%` }} /></div>
            <div className="flex items-center gap-2 mt-3"><span className="h text-2xl w-12">{s}</span>
              <button onClick={() => { setStock(p.id, s - 1); re() }} className="h-8 w-8 rounded-full border border-ink/30 hover:bg-ink hover:text-sand transition">−</button>
              <button onClick={() => { setStock(p.id, s + 1); re() }} className="h-8 w-8 rounded-full border border-ink/30 hover:bg-ink hover:text-sand transition">+</button>
              <button onClick={() => { setStock(p.id, s + 24); re() }} className="label ml-auto underline">Restock +24</button></div></div>
        </Tilt></div>)})}</div>
  )
}

function Customers() {
  const vip = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 3)
  const tone: Record<string, string> = { 'Velvet Platinum': 'bg-ink text-gold', 'Velvet Gold': 'bg-gold/25 text-[#8c6d35]', 'Velvet Silver': 'bg-ink/10', New: 'bg-green-600/15 text-green-700' }
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-5">{vip.map((c, i) => <Tilt key={c.name} max={12} className="bg-ink text-sand p-6 overflow-hidden"><Photo k={['facial2', 'reception', 'close'][i]} className="absolute inset-0 h-full w-full opacity-25" />
        <div className="relative" style={{ transform: 'translateZ(30px)' }}><p className="label text-gold">Top customer #{i + 1}</p><h3 className="h text-2xl mt-3">{c.name}</h3><p className="h text-4xl text-gold mt-4"><Counter to={c.spent} prefix="₹" /></p><p className="label mt-2 opacity-70">{c.orders} orders · {c.visits} visits</p></div></Tilt>)}</div>
      <div className="overflow-x-auto bg-white/60 border border-ink/10"><table className="min-w-full text-xs text-left">
        <thead className="label opacity-60"><tr>{['Customer', 'City', 'Tier', 'Orders', 'Visits', 'Lifetime spend', 'Last seen'].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{customers.map((c) => <tr key={c.name} className="border-t border-ink/10"><td className="p-3">{c.name}<br /><span className="opacity-60">{c.phone}</span></td><td className="p-3">{c.city}</td><td className="p-3"><span className={`label px-3 py-1 rounded-full ${tone[c.tier]}`}>{c.tier}</span></td><td className="p-3">{c.orders}</td><td className="p-3">{c.visits}</td><td className="p-3">{money(c.spent)}</td><td className="p-3">{c.last}</td></tr>)}</tbody></table></div>
    </div>
  )
}

export default function Manager() {
  const [ok, setOk] = useState(() => sessionStorage.getItem('VELVET TOUCH-mgr') === '1')
  const [tab, setTab] = useState<Tab>('overview')
  if (!ok) return <Gate onOk={() => setOk(true)} />
  return (
    <main className="bg-[#eeede9] min-h-screen">
      <section className="relative overflow-hidden bg-ink text-sand pt-28 pb-10 px-5 md:px-10">
        <Photo k="back" className="absolute inset-0 h-full w-full kenburns opacity-40" /><div className="absolute inset-0 bg-gradient-to-b from-black/50 to-ink" />
        <div className="relative flex flex-wrap justify-between items-end gap-6"><div><span className="label text-gold block">Manager view · demo data in this browser</span><h1 className="h text-[clamp(2.2rem,5.5vw,5rem)] mt-3">Command <span className="gold-text">centre.</span></h1></div>
          <div className="flex gap-3"><Link to="/" className="border border-sand/40 rounded-full px-6 py-3 label hover:bg-sand hover:text-ink transition">Exit</Link><button onClick={() => { sessionStorage.removeItem('VELVET TOUCH-mgr'); setOk(false) }} className="border border-sand/40 rounded-full px-6 py-3 label hover:bg-sand hover:text-ink transition">Lock</button></div></div>
      </section>
      <div className="sticky top-0 z-30 bg-sand/85 backdrop-blur border-b border-ink/10 px-5 md:px-10 pt-14 md:pt-16"><div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar">{TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`label pb-4 border-b-2 whitespace-nowrap transition ${tab === k ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'}`}>{l}</button>)}</div></div>
      <section className="px-5 md:px-10 py-12 pb-28">
        {tab === 'overview' && <Overview go={setTab} />}{tab === 'orders' && <Orders />}{tab === 'inventory' && <Inventory />}{tab === 'customers' && <Customers />}
        {tab === 'schedule' && <div className="-mx-5 md:-mx-10 -mt-24"><Admin /></div>}
      </section>
    </main>
  )
}
