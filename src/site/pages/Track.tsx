import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from '../SmartLink'
import { useSearchParams } from 'react-router-dom'
import { Tilt, Counter, Photo } from '../components/three'
import { money, spa } from '../data'
import { ORDER_STAGES, APPT_STAGES, ORDER_STAGES_I18N, APPT_STAGES_I18N, getOrders, advanceOrder, getAppts, cancelAppt, advanceAppt, getProfile, saveProfile, fmtDay, fmtWhen, type Order, type Appt, type Profile } from '../account'

type Tab = 'orders' | 'appointments' | 'profile'
const TABS: [Tab, string][] = [['orders', 'Orders'], ['appointments', 'Appointments'], ['profile', 'Profile']]

function Chip({ text, tone }: { text: string; tone: 'gold' | 'green' | 'red' | 'grey' }) {
  const c = { gold: 'bg-gold/20 text-[#8c6d35]', green: 'bg-green-600/15 text-green-700', red: 'bg-red-600/15 text-red-700', grey: 'bg-ink/10 text-ink/70' }[tone]
  return <span className={`label px-3 py-1 rounded-full ${c}`}>{text}</span>
}

/** Vertical animated timeline. */
function Timeline({ steps, current, times, notes }: { steps: string[]; current: number; times?: (string | undefined)[]; notes?: (string | undefined)[] }) {
  const [p, setP] = useState(0)
  useEffect(() => { setP(0); const t = setTimeout(() => setP(current / (steps.length - 1)), 120); return () => clearTimeout(t) }, [current, steps.length])
  return (
    <ol className="relative pl-10">
      <span className="absolute left-[15px] top-3 bottom-3 w-px bg-ink/15" />
      <span className="absolute left-[15px] top-3 w-px bg-gold transition-all duration-[1400ms] ease-out" style={{ height: `calc((100% - 1.5rem) * ${p})` }} />
      {steps.map((s, i) => {
        const done = i <= current, now = i === current
        return (
          <li key={s} className="relative pb-7 last:pb-0">
            <span className={`absolute -left-10 top-0 h-[31px] w-[31px] rounded-full border flex items-center justify-center text-xs transition-all duration-700 ${done ? 'bg-ink text-gold border-ink' : 'bg-sand border-ink/25 text-ink/30'} ${now ? 'pulse-dot' : ''}`} style={{ transitionDelay: `${i * 160}ms` }}>{done ? '✓' : i + 1}</span>
            <p className={`text-sm ${done ? 'font-medium' : 'opacity-40'}`}>{s}{now && <span className="label text-gold ml-2">Current</span>}</p>
            {done && notes?.[i] && <p className="text-xs opacity-70 mt-1">{notes[i]}</p>}
            {done && times?.[i] && <p className="label !font-medium opacity-50 mt-1">{times[i]}</p>}
          </li>
        )
      })}
    </ol>
  )
}

function Bar({ v }: { v: number }) { return <div className="h-1 bg-ink/10 rounded-full overflow-hidden"><div className="h-full bg-gold transition-all duration-1000" style={{ width: `${v * 100}%` }} /></div> }


function stagesLang() {
  try {
    const l = localStorage.getItem('velvet-lang') || 'en'
    return { order: ORDER_STAGES_I18N[l] || ORDER_STAGES, appt: APPT_STAGES_I18N[l] || APPT_STAGES }
  } catch {
    return { order: ORDER_STAGES, appt: APPT_STAGES }
  }
}

function Hero({ pr, onFind, err }: { pr: Profile; onFind: (q: string) => void; err: string }) {
  const [q, setQ] = useState('')
  const sub = (e: FormEvent) => { e.preventDefault(); onFind(q.trim()) }
  const orders = getOrders(), ap = getAppts()
  return (
    <section className="relative min-h-[78svh] overflow-hidden bg-ink text-sand pt-28 pb-10 flex flex-col justify-end">
      <div className="absolute inset-0">
  <video
    className="h-full w-full object-cover"
    src="/track-hero.mp4"
    autoPlay
    muted
    loop
    playsInline
  />
</div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-ink" />
      <div className="relative px-5 md:px-10 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
        <div>
          <span className="label text-gold block fade-up">Customer area · {spa.name}</span>
          <h1 className="h text-[clamp(2.4rem,6.5vw,6rem)] mt-4 fade-up">Welcome back,<br /><span className="gold-text">{pr.name.split(' ')[0]}.</span></h1>
          <form onSubmit={sub} className="mt-8 flex max-w-lg glass rounded-full p-1.5 fade-up">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Track by ID · e.g. VT-ORD-10482 or VT-APT-7731" className="flex-1 bg-transparent px-5 text-xs outline-none placeholder:text-sand/50" />
            <button className="bg-gold text-ink rounded-full px-6 py-3 label hover:bg-sand transition">Track</button>
          </form>
          {err && <p className="text-xs text-red-300 mt-3">{err}</p>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[[orders.filter((o) => o.stage < 4).length, 'Active orders'], [ap.filter((a) => a.status === 'Upcoming').length, 'Upcoming visits'], [pr.points, 'Velvet points']].map(([n, l]) => (
            <Tilt key={l} max={14} className="glass p-4"><p className="h text-3xl md:text-4xl text-gold"><Counter to={Number(n)} /></p><p className="label mt-2 !text-[.55rem]">{l}</p></Tilt>))}
        </div>
      </div>
    </section>
  )
}

function OrdersTab({ sel, setSel }: { sel: string; setSel: (s: string) => void }) {
  const [list, setList] = useState<Order[]>(getOrders)
  const cur = list.find((o) => o.id === sel) ?? list[0]
  const adv = () => { advanceOrder(cur.id); setList(getOrders()) }
  const eta = (o: Order) => (o.stage === 4 ? 'Delivered' : `Arriving ${fmtDay(o.eta)}`)
  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
      <div className="space-y-5">
        {list.map((o, n) => (
          <div key={o.id} style={{ animationDelay: `${n * 80}ms` }} className="fade-up">
            <Tilt max={5} scale={1.015} className={`bg-white/60 border transition ${o.id === cur.id ? 'border-gold shadow-xl' : 'border-ink/10'}`}>
              <button onClick={() => setSel(o.id)} className="w-full text-left p-4 flex gap-4">
                <div className="relative h-24 w-20 shrink-0">{o.items.slice(0, 3).map((it, i) => <Photo key={it.pid + i} k={it.img} className="absolute h-24 w-20 border border-sand shadow-md" />).reverse().map((el, i, a) => <div key={i} className="absolute inset-0" style={{ transform: `translate(${(a.length - 1 - i) * 7}px,${(a.length - 1 - i) * -4}px)`, zIndex: i }}>{el}</div>)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2"><span className="label">{o.id}</span><Chip text={stagesLang().order[o.stage]} tone={o.stage === 4 ? 'green' : 'gold'} /></div>
                  <p className="text-sm mt-2 truncate">{o.items.map((i) => i.name).join(', ')}</p>
                  <p className="text-xs opacity-60 mt-1">{o.items.reduce((s, i) => s + i.qty, 0)} item(s) · {money(o.total)} · {eta(o)}</p>
                  <div className="mt-3"><Bar v={(o.stage + 1) / stagesLang().order.length} /></div>
                </div>
              </button>
            </Tilt>
          </div>))}
        <Link to="/products" className="inline-flex bg-ink text-sand rounded-full px-7 py-4 label">Shop more products ↗</Link>
      </div>
      <aside key={cur.id} className="pop-in bg-ink text-sand p-6 md:p-8 lg:sticky lg:top-24 self-start">
        <div className="flex justify-between gap-3 items-start"><div><p className="label text-gold">Tracking</p><h3 className="h text-3xl mt-2">{cur.id}</h3></div><Chip text={eta(cur)} tone={cur.stage === 4 ? 'green' : 'gold'} /></div>
        <div className="grid grid-cols-2 gap-4 text-xs mt-6 border-y border-sand/15 py-4">
          <p><span className="label opacity-60 block mb-1">Courier</span>{cur.courier}</p><p><span className="label opacity-60 block mb-1">Tracking no.</span>{cur.awb}</p>
          <p><span className="label opacity-60 block mb-1">Placed</span>{fmtWhen(cur.placed)}</p><p><span className="label opacity-60 block mb-1">Payment</span>{cur.payment}</p>
        </div>
        <div className="mt-6 bg-sand text-ink p-5"><Timeline steps={ORDER_STAGES} current={cur.stage} times={stagesLang().order.map((_, i) => { const l = cur.log.find((x) => x.stage === i); return l ? fmtWhen(l.at) : undefined })} notes={stagesLang().order.map((_, i) => cur.log.find((x) => x.stage === i)?.note)} /></div>
        <div className="mt-6 space-y-3">{cur.items.map((i, k) => <div key={i.pid + k} className="flex gap-3 items-center text-xs"><Photo k={i.img} className="h-14 w-12" /><span className="flex-1">{i.name}<br /><span className="opacity-60">{i.size} · Qty {i.qty}</span></span><span>{money(i.price * i.qty)}</span></div>)}
          <p className="flex justify-between border-t border-sand/15 pt-3 text-sm"><span>Total</span><span>{money(cur.total)}</span></p></div>
        <p className="text-xs opacity-70 mt-4">Delivering to: {cur.address}</p>
        <div className="flex flex-wrap gap-3 mt-6">
          {cur.stage < 4 && <button onClick={adv} className="bg-gold text-ink rounded-full px-6 py-3 label hover:bg-sand transition">Simulate next update →</button>}
          <Link to="/products" className="border border-sand/40 rounded-full px-6 py-3 label hover:bg-sand hover:text-ink transition">Reorder</Link>
        </div>
      </aside>
    </div>
  )
}

function ApptsTab({ sel, setSel }: { sel: string; setSel: (s: string) => void }) {
  const [list, setList] = useState<Appt[]>(getAppts)
  const cur = list.find((a) => a.ref === sel) ?? list[0]
  const refresh = () => setList(getAppts())
  const tone = (s: Appt['status']) => (s === 'Upcoming' ? 'gold' : s === 'Completed' ? 'green' : 'red')
  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8">
      <div className="space-y-5">
        {list.map((a, n) => (
          <div key={a.ref} style={{ animationDelay: `${n * 80}ms` }} className="fade-up">
            <Tilt max={5} scale={1.015} className={`bg-white/60 border overflow-hidden transition ${a.ref === cur.ref ? 'border-gold shadow-xl' : 'border-ink/10'}`}>
              <button onClick={() => setSel(a.ref)} className="w-full text-left flex">
                <Photo k={a.img} className="h-32 w-28 shrink-0" />
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex justify-between gap-2"><span className="label">{a.ref}</span><Chip text={a.status} tone={tone(a.status)} /></div>
                  <h3 className="h text-lg mt-2">{a.service}</h3>
                  <p className="text-xs opacity-70 mt-1">{fmtDay(a.date)} · {a.time} · {a.duration} min</p><p className="text-xs opacity-70">with {a.specialist}</p>
                </div>
              </button>
            </Tilt>
          </div>))}
        <Link to="/booking" className="inline-flex bg-ink text-sand rounded-full px-7 py-4 label">Book new appointment ↗</Link>
      </div>
      <aside key={cur.ref} className="pop-in bg-ink text-sand lg:sticky lg:top-24 self-start overflow-hidden">
        <div className="relative h-44"><Photo k={cur.img} className="h-full w-full kenburns" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-black/20" />
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end gap-3"><div><p className="label text-gold">{cur.category}</p><h3 className="h text-3xl mt-1">{cur.service}</h3></div><Chip text={cur.status} tone={tone(cur.status)} /></div></div>
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-sand/15 pb-4">
            <p><span className="label opacity-60 block mb-1">Date & time</span>{fmtDay(cur.date)} · {cur.time}</p><p><span className="label opacity-60 block mb-1">Specialist</span>{cur.specialist}</p>
            <p><span className="label opacity-60 block mb-1">Room</span>{cur.room}</p><p><span className="label opacity-60 block mb-1">Amount</span>{money(cur.price)} · pay at visit</p>
          </div>
          {cur.notes && <p className="text-xs opacity-70 mt-4">Note: {cur.notes}</p>}
          <div className="mt-6 bg-sand text-ink p-5">{cur.status === 'Cancelled' ? <p className="text-sm">This appointment was cancelled. The slot has been released.</p> : <Timeline steps={APPT_STAGES} current={cur.stage} />}</div>
          <div className="flex flex-wrap gap-3 mt-6">
            {cur.status === 'Upcoming' && <><button onClick={() => { advanceAppt(cur.ref); refresh() }} className="bg-gold text-ink rounded-full px-6 py-3 label hover:bg-sand transition">Simulate next step →</button>
              <Link to="/booking" className="border border-sand/40 rounded-full px-6 py-3 label hover:bg-sand hover:text-ink transition">Reschedule</Link>
              <button onClick={() => { cancelAppt(cur.ref); refresh() }} className="border border-sand/40 rounded-full px-6 py-3 label hover:bg-red-900/50 transition">Cancel</button></>}
            {cur.status !== 'Upcoming' && <Link to="/booking" className="bg-gold text-ink rounded-full px-6 py-3 label">Book again ↗</Link>}
          </div>
        </div>
      </aside>
    </div>
  )
}

function ProfileTab() {
  const [p, setP] = useState<Profile>(getProfile)
  const [saved, setSaved] = useState(false)
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => { setSaved(false); setP((x) => ({ ...x, [k]: v })) }
  const save = () => { saveProfile(p); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const f = 'bg-transparent border-b border-ink/30 py-2 text-sm w-full outline-none focus:border-ink'
  const pct = Math.min(p.points / p.nextTier, 1)
  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
      <div className="space-y-6">
        <Tilt max={14} scale={1.04} className="overflow-hidden aspect-[1.6/1] shadow-2xl text-sand">
          <Photo k="facial2" className="absolute inset-0 h-full w-full" /><div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80" />
          <div className="relative h-full p-6 flex flex-col justify-between" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex justify-between items-start"><div><p className="h text-xl">{spa.name}</p><p className="label !text-[.5rem] text-gold">Velvet membership</p></div><span className="label gold-text !text-sm">{p.tier}</span></div>
            <div><p className="h text-2xl">{p.name}</p><p className="label !font-medium opacity-70 mt-1">Member since {p.since} · {p.phone}</p></div>
          </div>
        </Tilt>
        <div className="bg-white/60 border border-ink/10 p-5"><div className="flex justify-between text-xs"><span className="label">Progress to Velvet Platinum</span><span>{p.points.toLocaleString('en-IN')} / {p.nextTier.toLocaleString('en-IN')}</span></div>
          <div className="mt-3"><Bar v={pct} /></div><p className="text-xs opacity-70 mt-3">{(p.nextTier - p.points).toLocaleString('en-IN')} points to go. Earn 1 point per ₹10 on products and spa visits.</p></div>
      </div>
      <div className="bg-white/60 border border-ink/10 p-6 md:p-8">
        <h3 className="h text-2xl">Your details</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-6">
          <label><span className="label opacity-60">Full name</span><input className={f} value={p.name} onChange={(e) => set('name', e.target.value)} /></label>
          <label><span className="label opacity-60">Phone</span><input className={f} value={p.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label><span className="label opacity-60">Email</span><input className={f} value={p.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label><span className="label opacity-60">Birthday</span><input type="date" className={f} value={p.birthday} onChange={(e) => set('birthday', e.target.value)} /></label>
          <label className="sm:col-span-2"><span className="label opacity-60">Delivery address</span><input className={f} value={p.address} onChange={(e) => set('address', e.target.value)} /></label>
          <div className="sm:col-span-2"><span className="label opacity-60">Skin type</span><div className="flex flex-wrap gap-2 mt-2">{['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'].map((s) => <button key={s} onClick={() => set('skin', s)} className={`px-4 py-2 rounded-full border text-xs transition ${p.skin === s ? 'bg-ink text-sand border-ink' : 'border-ink/25 hover:border-ink'}`}>{s}</button>)}</div></div>
          <div className="sm:col-span-2"><span className="label opacity-60">Send me updates on</span>
            <div className="flex flex-wrap gap-2 mt-2">{(['whatsapp', 'sms', 'email'] as const).map((k) => <button key={k} onClick={() => set('notify', { ...p.notify, [k]: !p.notify[k] })} className={`px-4 py-2 rounded-full border text-xs capitalize transition ${p.notify[k] ? 'bg-gold/25 border-gold' : 'border-ink/25'}`}>{p.notify[k] ? '✓ ' : ''}{k === 'sms' ? 'SMS' : k}</button>)}</div></div>
        </div>
        <div className="flex items-center gap-4 mt-8"><button onClick={save} className="bg-ink text-sand rounded-full px-7 py-4 label hover:bg-stone transition">Save changes</button>{saved && <span className="text-xs text-green-700 fade-up">Saved ✓</span>}</div>
      </div>
    </div>
  )
}

export default function Track() {
  const [sp, setSp] = useSearchParams()
  const tab = (TABS.find(([t]) => t === sp.get('tab'))?.[0] ?? 'orders') as Tab
  const [err, setErr] = useState('')
  const pr = useMemo(getProfile, [])
  const id = sp.get('id') ?? ''
  const go = (t: Tab, i = '') => setSp(i ? { tab: t, id: i } : { tab: t })
  const find = (q: string) => {
    const k = q.toUpperCase()
    if (getOrders().some((o) => o.id === k)) { setErr(''); go('orders', k); document.getElementById('panel')?.scrollIntoView({ behavior: 'smooth' }) }
    else if (getAppts().some((a) => a.ref === k)) { setErr(''); go('appointments', k); document.getElementById('panel')?.scrollIntoView({ behavior: 'smooth' }) }
    else setErr(`No order or appointment found for “${q}”. Try VT-ORD-10482 or VT-APT-7731.`)
  }
  return (
    <main className="bg-[#eeede9] min-h-screen">
      <Hero pr={pr} onFind={find} err={err} />
      <div id="panel" className="sticky top-0 z-30 bg-sand/85 backdrop-blur border-b border-ink/10 px-5 md:px-10 pt-14 md:pt-16">
        <div className="flex gap-8">{TABS.map(([t, l]) => <button key={t} onClick={() => go(t)} className={`label pb-4 border-b-2 transition ${tab === t ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'}`}>{l}</button>)}</div>
      </div>
      <section className="px-5 md:px-10 py-12 pb-28">
        {tab === 'orders' && <OrdersTab sel={id} setSel={(i) => go('orders', i)} />}
        {tab === 'appointments' && <ApptsTab sel={id} setSel={(i) => go('appointments', i)} />}
        {tab === 'profile' && <ProfileTab />}
      </section>
    </main>
  )
}
