import { useEffect, useMemo, useState } from 'react'
import { Link } from '../SmartLink'
import { Reveal, Parallax, DragRail, Arrow, ArrowUR } from '../components/ui'
import { services, categories, amenities, policies, spa, team, img, money, type Category } from '../data'

const Img = ({ k, className = '', alt = '' }: { k: string; className?: string; alt?: string }) => <img src={img(k)} alt={alt} draggable={false} loading="lazy" className={`object-cover ${className}`} />
const Cap = ({ children }: { children: string }) => <p className="label !font-medium mt-3 max-w-[16rem] opacity-80">{children}</p>

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-sand">
      <video className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" src="/hero.mp4" autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/35" />
      <h1 className="h absolute left-5 md:left-10 bottom-[190px] md:bottom-6 text-[clamp(1.9rem,3.4vw,3.4rem)] fade-up">Restore.<br />Renew. Return.</h1>
      <div className="absolute bottom-0 inset-x-0 md:left-auto md:w-[min(44vw,660px)] h-[170px] md:h-[200px] flex">
        <a href="#menu" className="flex-1 bg-ink p-4 flex flex-col justify-between group">
          <span className="label">The ritual menu</span><ArrowUR className="group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          <span className="label !font-medium text-[.55rem]">See all treatments ↓</span>
        </a>
        <Link to="/booking" className="flex-1 bg-sand text-ink p-4 flex flex-col justify-between group">
          <span className="label">Follow your calm</span>
          <span className="h text-xl md:text-2xl">Find your<br />ritual.</span>
          <span className="label !font-medium text-[.55rem] group-hover:underline">Book appointment ↗</span>
        </Link>
      </div>
    </section>
  )
}


function Bleed({ k, label, title, body, right }: { k: string; label: string; title: string; body: string; right?: boolean }) {
  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-sand">
      <Parallax speed={0.08} className="absolute -inset-y-[10%] inset-x-0"><Img k={k} className="h-full w-full" /></Parallax>
      <div className="absolute inset-0 bg-black/30" />
      <span className="label absolute top-24 left-5 md:left-10">{label}</span>
      <div className={`absolute bottom-8 md:bottom-10 ${right ? 'right-5 md:right-10 text-right' : 'left-5 md:left-10'}`}>
        <Reveal><h2 className="h text-[clamp(2.4rem,6.5vw,6rem)]">{title}</h2></Reveal>
        <p className={`text-xs mt-4 max-w-[19rem] opacity-90 ${right ? 'ml-auto' : ''}`}>{body}</p>
      </div>
    </section>
  )
}


function Motion() {
  return (
    <section className="relative h-[100vh] min-h-[640px] overflow-hidden">
      <Parallax speed={-0.12} className="absolute inset-x-0 top-1/3"><p className="h text-[clamp(4rem,15vw,15rem)] text-center text-ink/20 leading-[.85]">Stillness<br />in motion.</p></Parallax>
      <Parallax speed={0.18} className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[min(72vw,380px)]"><Img k="facial" className="w-full aspect-[4/5] shadow-2xl" /></Parallax>
      <span className="label absolute bottom-24 left-5 md:left-10">Petal, clay, oil. An entirely new composition.</span>
      <p className="absolute bottom-10 right-5 md:right-10 max-w-sm text-xs">Our palette moves from bright citrus to soft floral, from dry wood to warm amber. The interesting part is what happens between them.</p>
    </section>
  )
}


function Moments() {
  const m = [['Morning', 'facial', 'Morning. Bright, awakening rituals: facials, petal soaks and a cup of ginger tea.'], ['Afternoon', 'back', 'Afternoon. Deep tissue and salt scrubs to release the weight of a long day.'], ['Evening', 'wide', 'Evening. Slow aromatherapy and hot stone to close the day softly.']]
  const [i, setI] = useState(0)
  return (
    <section className="bg-[#151915] text-sand min-h-[100svh] grid md:grid-cols-2 items-center gap-10 px-5 md:px-10 py-28 border-t border-sand/10">
      <div>
        <span className="label block mb-5">A change of mood</span>
        <h2 className="h text-[clamp(2.2rem,4.5vw,4.2rem)]">A ritual<br />for this<br />moment.</h2>
        <div className="flex gap-6 mt-8 text-sm">{m.map(([t], n) => <button key={t} onClick={() => setI(n)} className={`pb-1 border-b transition ${n === i ? 'border-sand' : 'border-transparent opacity-50 hover:opacity-100'}`}>{t}</button>)}</div>
      </div>
      <div key={i} className="slide-in">
        <Img k={m[i][1]} className="w-full aspect-[4/3] md:aspect-square max-h-[70vh]" />
        <p className="text-xs mt-3 max-w-md">{m[i][2]}</p>
      </div>
    </section>
  )
}

function Ingredients() {
  const s = [['Lavender', 'facial2', 'Soft doesn\'t mean simple.', 'Calming and quietly powerful. Lavender slows the breath and settles the nervous system.'], ['Rose', 'foot2', 'A petal-soft beginning.', 'Hand-picked petals for our soaks and facials, gentle on even the most sensitive skin.'], ['Sandalwood', 'back', 'Warmth that stays.', 'Creamy, grounding wood notes carried in our massage oils and ritual candles.'], ['Himalayan salt', 'close', 'Clean, mineral, honest.', 'Fine crystals polish away dullness and leave skin smooth, soft and glowing.'], ['Jasmine', 'facial', 'Light in the shadows.', 'A small white flower with an expansive presence, used in our evening rituals.']]
  const [i, setI] = useState(0)
  const go = (d: number) => setI((i + d + s.length) % s.length)
  return (
    <section id="ingredients" className="bg-ink text-sand min-h-[100svh] pt-24 pb-10 px-5 md:px-10 flex flex-col">
      <div className="flex justify-between items-start">
        <h2 className="h text-[clamp(1.6rem,3.2vw,3rem)]">Raw materials.<br />Rich possibilities.</h2>
        <div className="flex items-center gap-4 label"><span className="flex gap-1.5">{s.map((_, n) => <i key={n} className={`h-1.5 w-1.5 rounded-full transition ${n === i ? 'bg-sand' : 'bg-sand/30'}`} />)}</span><Arrow dir="l" light onClick={() => go(-1)} /><Arrow dir="r" light onClick={() => go(1)} /></div>
      </div>
      <div key={i} className="flex-1 grid md:grid-cols-[1fr_62%] gap-8 items-end mt-10">
        <div className="slide-in order-2 md:order-1 pb-4">
          <span className="label block mb-4">{s[i][0]}</span>
          <h3 className="h text-[clamp(1.5rem,2.6vw,2.4rem)]">{s[i][2]}</h3><p className="text-xs mt-4 max-w-xs opacity-80">{s[i][3]}</p>
        </div>
        <Img k={s[i][1]} className="slide-in order-1 md:order-2 w-full aspect-[4/3] md:max-h-[62vh]" />
      </div>
      <div className="h-px bg-sand/20 mt-6"><div className="h-px bg-sand transition-all duration-700" style={{ width: `${((i + 1) / s.length) * 100}%` }} /></div>
    </section>
  )
}


function Menu() {
  const [cat, setCat] = useState<'All' | Category>('All')
  const [dur, setDur] = useState('any')
  const [sort, setSort] = useState('featured')
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    let l = services.filter((s) => (cat === 'All' || s.category === cat) && s.name.toLowerCase().includes(q.toLowerCase()) &&
      (dur === 'any' || (dur === 'short' && s.duration <= 60) || (dur === 'mid' && s.duration > 60 && s.duration <= 90) || (dur === 'long' && s.duration > 90)))
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'time') l = [...l].sort((a, b) => a.duration - b.duration)
    if (sort === 'featured') l = [...l].sort((a, b) => Number(!!b.popular) - Number(!!a.popular))
    return l
  }, [cat, dur, sort, q])
  const chip = (on: boolean) => `px-4 py-2 rounded-full border text-xs transition ${on ? 'bg-ink text-sand border-ink' : 'border-ink/25 hover:border-ink'}`
  return (
    <section id="menu" className="bg-[#eeede9] px-5 md:px-10 pt-28 pb-28 scroll-mt-0">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end">
        <div><span className="label block mb-4">The ritual menu</span><h2 className="h text-[clamp(2.4rem,5.5vw,5rem)]">All treatments.<br />All yours.</h2></div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search treatments…" className="bg-transparent border-b border-ink/40 py-2 text-sm w-full md:w-72 outline-none focus:border-ink" />
      </div>
      <div className="mt-10 flex flex-wrap gap-2">{categories.map((c) => <button key={c} onClick={() => setCat(c)} className={chip(cat === c)}>{c}</button>)}</div>
      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 items-center text-xs">
        <div className="flex items-center gap-2"><span className="label">Duration</span>
          {[['any', 'Any'], ['short', '≤ 60 min'], ['mid', '61–90 min'], ['long', '90+ min']].map(([v, t]) => <button key={v} onClick={() => setDur(v)} className={chip(dur === v)}>{t}</button>)}</div>
        <label className="flex items-center gap-2"><span className="label">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border border-ink/25 rounded-full px-3 py-2">
            <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="time">Shortest first</option></select></label>
        <span className="opacity-60 ml-auto">{list.length} treatment{list.length !== 1 && 's'}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 mt-10">
        {list.map((s, n) => (
          <article key={s.id} style={{ animationDelay: `${n * 50}ms` }} className="fade-up group">
            <div className="overflow-hidden relative"><Img k={s.img} className="w-full aspect-[4/3] group-hover:scale-105 transition duration-700" />
              {s.popular && <span className="label absolute top-3 left-3 bg-sand px-3 py-1 rounded-full">Most loved</span>}</div>
            <div className="flex justify-between gap-4 mt-4"><h3 className="h text-xl">{s.name}</h3><span className="text-sm font-medium whitespace-nowrap">{money(s.price)}</span></div>
            <p className="label !font-medium opacity-60 mt-2">{s.category} · {s.duration} min</p>
            <p className="text-xs mt-3 opacity-80">{s.desc}</p>
            <Link to={`/booking?service=${s.id}`} className="inline-flex items-center gap-2 mt-4 bg-ink text-sand rounded-full px-5 py-3 label hover:bg-stone transition">Book appointment <ArrowUR /></Link>
          </article>
        ))}
      </div>
      {!list.length && <p className="mt-16 text-sm opacity-70">No treatments match those filters. <button className="underline" onClick={() => { setCat('All'); setDur('any'); setQ('') }}>Clear filters</button></p>}
    </section>
  )
}

function Visit() {
  return (
    <section id="visit" className="bg-ink text-sand px-5 md:px-10 py-28">
      <span className="label block mb-4">Visit the spa</span>
      <h2 className="h text-[clamp(2.2rem,5vw,4.6rem)] max-w-3xl">A sanctuary in the middle of the day.</h2>
      <div className="grid md:grid-cols-4 gap-10 mt-16 text-xs leading-relaxed">
        <div><h4 className="label mb-4">About</h4><p className="opacity-80">Serene brings a day spa, a hair and beauty salon and a small clinic under one roof. Certified specialists, organic products and private suites.</p></div>
        <div><h4 className="label mb-4">Opening hours</h4>{spa.hours.map(([d, t]) => <p key={d} className="flex justify-between gap-4 border-b border-sand/15 py-2"><span>{d}</span><span className="opacity-70">{t}</span></p>)}</div>
        <div><h4 className="label mb-4">Amenities</h4><ul className="space-y-2 opacity-80">{amenities.map((a) => <li key={a}>— {a}</li>)}</ul></div>
        <div><h4 className="label mb-4">Good to know</h4><ul className="space-y-2 opacity-80">{policies.map((a) => <li key={a}>— {a}</li>)}</ul>
          <h4 className="label mt-8 mb-3">Find us</h4><p className="opacity-80">{spa.address}<br />{spa.phone}<br />{spa.email}</p></div>
      </div>
      <Faq />
    </section>
  )
}


function Intro() {
  const p = [['Release', 'Spa', 'close'], ['Style', 'Salon', 'facial2'], ['Heal', 'Clinic', 'foot']]
  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-end">
        <Reveal><span className="label">A point of view</span></Reveal>
        <Reveal><h2 className="h text-[clamp(2rem,4.4vw,4.2rem)]">Rest, done properly.</h2><p className="text-sm mt-5 max-w-sm opacity-75">A boutique spa, salon and clinic for slow, unhurried care.</p></Reveal>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mt-14">
        {p.map(([t, c, k], n) => (
          <Reveal key={t} delay={n * 120}><a href="#menu" className="block group">
            <div className="overflow-hidden"><Img k={k} className="w-full aspect-[4/5] group-hover:scale-105 transition duration-700" /></div>
            <div className="flex justify-between items-center mt-4"><h3 className="h text-3xl">{t}</h3><span className="label opacity-70 group-hover:opacity-100 flex items-center gap-2">{c} <ArrowUR /></span></div>
          </a></Reveal>))}
      </div>
    </section>
  )
}

function Marquee() {
  const w = ['Massage', 'Facials', 'Hair & styling', 'Skin clinic', 'Physiotherapy', 'Couple suites', 'Bridal']
  return (
    <div className="bg-ink text-sand overflow-hidden py-5 border-y border-sand/10">
      <div className="flex w-max" style={{ animation: 'marquee 30s linear infinite' }}>
        {[...w, ...w, ...w, ...w].map((t, i) => <span key={i} className="h text-3xl md:text-5xl px-6 flex items-center gap-12 whitespace-nowrap">{t}<i className="h-1.5 w-1.5 rounded-full bg-sand/50" /></span>)}
      </div>
    </div>
  )
}

function Team() {
  return (
    <section className="py-24">
      <div className="px-5 md:px-10 mb-10"><Reveal><h2 className="h text-[clamp(2rem,4vw,3.6rem)]">Meet your<br />specialists.</h2></Reveal></div>
      <DragRail label="Drag to explore">
        {team.map((t, n) => (
          <div key={t.name} className={`shrink-0 w-[64vw] md:w-[22vw] ${n % 2 ? 'mt-10' : ''}`}>
            <Img k={t.img} className="w-full aspect-[4/5]" />
            <h3 className="h text-2xl mt-4">{t.name}</h3><p className="label !font-medium opacity-60 mt-1">{t.role}</p><p className="text-xs mt-2 opacity-80">{t.skill}</p>
            <Link to={`/booking?therapist=${t.name}`} className="inline-flex items-center gap-2 label mt-3 hover:opacity-60">Book with {t.name} <ArrowUR /></Link>
          </div>))}
      </DragRail>
    </section>
  )
}

function Reviews() {
  const q = [['The best hour of my month. I walked out lighter.', 'Priya S.', 'Aromatherapy Massage'], ['Quiet, spotless and genuinely caring. That rose facial glows for days.', 'Karthik R.', 'Radiance Rose Facial'], ['We booked the couple suite for our anniversary. Perfect.', 'Meena & Arun', 'Couple\'s Serenity'], ['They actually listen. My shoulders thank them.', 'Divya L.', 'Deep Tissue Release']]
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % q.length), 5000); return () => clearInterval(t) }, [q.length])
  return (
    <section className="bg-sand px-5 md:px-10 py-28 text-center">
      <span className="label block mb-8">Kind words</span>
      <div key={i} className="fade-up max-w-4xl mx-auto min-h-[200px]">
        <p className="h text-[clamp(1.6rem,3.6vw,3.2rem)]">“{q[i][0]}”</p>
        <p className="text-xs mt-6 opacity-70">{q[i][1]} · {q[i][2]}</p>
      </div>
      <div className="flex justify-center gap-2 mt-8">{q.map((_, n) => <button key={n} aria-label="Show review" onClick={() => setI(n)} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-8 bg-ink' : 'w-1.5 bg-ink/30'}`} />)}</div>
    </section>
  )
}

function Offers() {
  const o = [['First visit', '15% off your first ritual, on any treatment.', 'Claim offer', '/booking'], ['Membership', 'One ritual a month at a better price, with priority booking.', 'Ask us', '/booking'], ['Gift cards', 'Give the gift of calm, for any amount or treatment.', 'Gift a ritual', '/booking']]
  return (
    <section className="bg-[#eeede9] px-5 md:px-10 pb-28 grid md:grid-cols-3 gap-5">
      {o.map(([t, d, b, to], n) => (
        <Reveal key={t} delay={n * 100}><div className="bg-ink text-sand p-7 h-full flex flex-col justify-between min-h-[250px] hover:-translate-y-1 transition duration-500">
          <div><h3 className="h text-3xl">{t}</h3><p className="text-xs mt-4 opacity-75 max-w-[16rem]">{d}</p></div>
          <Link to={to} className="label mt-8 flex items-center gap-2">{b} <ArrowUR /></Link></div></Reveal>))}
    </section>
  )
}

function Faq() {
  const f = [['Do I need to book in advance?', 'Walk-ins are welcome when there is space, but booking guarantees your time and therapist.'], ['What should I bring?', 'Nothing at all. Robes, towels, slippers and lockers are provided.'], ['Can I reschedule?', 'Yes, free of charge up to 12 hours before your appointment.'], ['Are the products safe for sensitive skin?', 'We use organic, vegan products. Tell us about any allergies and we will adapt.']]
  return (
    <div className="mt-20 border-t border-sand/15">
      <h4 className="label py-6">Questions</h4>
      {f.map(([qq, a]) => <details key={qq} className="group border-t border-sand/15 py-4"><summary className="cursor-pointer list-none flex justify-between text-sm">{qq}<span className="group-open:rotate-45 transition">+</span></summary><p className="text-xs opacity-70 mt-3 max-w-lg">{a}</p></details>)}
    </div>
  )
}

export default function Home() {
  return (
    <main>
      <Hero /><Intro /><Marquee /><Menu />
      <Bleed k="wide" label="The ritual" title="Calm. Slow. Unhurried." body="Warm oil. Steady hands. The instant a whole room exhales." />
      <Motion /><Moments /><Team /><Ingredients /><Reviews /><Offers /><Visit />
      <footer className="bg-sand px-5 md:px-10 py-16 flex flex-col md:flex-row justify-between gap-8 items-start md:items-end">
        <h2 className="h text-[clamp(2rem,5vw,4.5rem)]">Your calm<br />is waiting.</h2>
        <div className="text-xs space-y-1"><Link to="/booking" className="inline-block bg-ink text-sand rounded-full px-7 py-4 label mb-4">Book appointment ↗</Link><p>{spa.address}</p><Link to="/manager" className="underline opacity-60">Manager view</Link><p>© {new Date().getFullYear()} {spa.name} {spa.sub}</p></div>
      </footer>
    </main>
  )
}
