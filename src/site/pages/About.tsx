import { useState } from 'react'
import { Link } from '../SmartLink'
import { Reveal, Parallax } from '../components/ui'
import { Tilt, Ring3D, Coverflow, Counter, Rail, Photo } from '../components/three'
import { spa, team, amenities } from '../data'

const journey: [string, string, string, string][] = [
  ['2018', 'The first treatment room', 'A single suite in Coimbatore, four therapists and one belief: rest should be done properly.', 'close'],
  ['2020', 'Our first formula', 'A body oil blended for the Abhyanga ritual. Guests kept asking where to buy it.', 'back'],
  ['2022', 'Salon & skin clinic', 'Stylists and a resident dermatologist join, so one visit can cover hair, skin and recovery.', 'facial2'],
  ['2024', 'The Velvet collection', 'Twelve small-batch products, tested on our treatment tables before they reach a shelf.', 'facial'],
  ['2026', 'Ships across India', 'Orders tracked end to end, with the same care as a booking at our front desk.', 'reception'],
]
const values: [string, string, string, string][] = [
  ['Slow by design', 'No rushed rooms, no double bookings. Every guest gets the full hour and a quiet minute after.', 'wide', '01'],
  ['Skin first', 'Every formula is dermatologist reviewed, vegan, cruelty free and free of harsh fillers.', 'facial', '02'],
  ['Small batch', 'We pour in limited runs so each jar is fresh, fragrant and traceable to its batch.', 'close', '03'],
  ['Genuine care', 'Certified specialists who remember your name, your allergies and your favourite tea.', 'reception', '04'],
]
const worlds: [string, string, string, string, string][] = [
  ['The Spa', 'Massage, facials, body rituals, couple suites.', 'wide', 'Book a ritual', '/booking'],
  ['The Salon', 'Cut, colour, bridal and keratin with senior stylists.', 'facial2', 'Meet the stylists', '/booking'],
  ['The Products', 'The exclusive Velvet collection, delivered to your door.', 'facial', 'Shop the collection', '/products'],
]

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-sand">
      <video className="absolute inset-0 h-full w-full object-cover object-[50%_35%]" src="/about-hero.mp4" autoPlay muted loop playsInline />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/50" />
      <div className="absolute bottom-10 left-5 md:left-10 right-5">
        <span className="label text-gold block fade-up">About · {spa.name}</span>
        <h1 className="h text-[clamp(2.6rem,8vw,8rem)] mt-4 fade-up">Where beauty<br />meets <span className="gold-text">care.</span></h1>
        <p className="text-xs md:text-sm max-w-md mt-5 opacity-85 fade-up">{spa.sub.toLowerCase().replace(/^./, (c) => c.toUpperCase())}. A spa, a salon, a skin clinic and a product studio under one quiet roof.</p>
        <a href="#story" className="inline-block mt-8 bg-gold text-ink rounded-full px-7 py-4 label hover:bg-sand transition fade-up">Our story ↓</a>
      </div>
    </section>
  )
}

function Story() {
  return (
    <section id="story" className="relative px-5 md:px-10 py-28 grid md:grid-cols-2 gap-14 items-center overflow-hidden">
      <div>
        <Reveal><span className="label block mb-5">Our story</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)]">Born in a treatment room.<br />Poured in a studio.</h2></Reveal>
        <Reveal delay={150}><p className="text-sm mt-8 max-w-md opacity-80">Velvet Touch began as a small day spa with a simple rule: use only what we would trust on our own skin. When guests started asking for the oils and creams we used in the room, we began making them ourselves.</p>
          <p className="text-sm mt-4 max-w-md opacity-80">Today the spa and the product studio feed each other. Every formula is tested on our treatment tables first, and every ritual is shaped by what our guests tell us.</p></Reveal>
      </div>
      <div className="relative h-[460px] md:h-[600px]">
        <Parallax speed={0.1} className="absolute left-0 top-0 w-[68%]"><Tilt max={8}><Photo k="close" className="w-full aspect-[4/5] shadow-2xl" /></Tilt></Parallax>
        <Parallax speed={-0.1} className="absolute right-0 bottom-0 w-[55%]"><Tilt max={10}><Photo k="facial" className="w-full aspect-[4/5] shadow-2xl border-4 border-sand" /></Tilt></Parallax>
      </div>
    </section>
  )
}

function Strip() {
  const w = ['Spa', 'Salon', 'Skin clinic', 'Beauty products', 'Bridal', 'Wellness']
  return <div className="bg-ink text-sand overflow-hidden py-5 border-y border-sand/10"><div className="flex w-max marquee">{[...w, ...w, ...w, ...w].map((t, i) => <span key={i} className="h text-3xl md:text-5xl px-6 flex items-center gap-12 whitespace-nowrap">{t}<i className="h-1.5 w-1.5 rounded-full bg-gold" /></span>)}</div></div>
}

function Stats() {
  const s: [number, string, string][] = [[8, '+ yrs', 'Of craft'], [12, 'k+', 'Guests cared for'], [24, '', 'Treatments'], [98, '%', 'Say they return']]
  return (
    <section className="relative h-[90svh] min-h-[560px] overflow-hidden bg-ink text-sand">
      <Parallax speed={0.08} className="absolute -inset-y-[10%] inset-x-0"><Photo k="wide" className="h-full w-full" /></Parallax>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative h-full flex flex-col justify-between px-5 md:px-10 pt-28 pb-10">
        <Reveal><span className="label text-gold block mb-4">By the numbers</span><h2 className="h text-[clamp(2.4rem,6.5vw,6rem)]">Trusted,<br />one visit at a time.</h2></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{s.map(([n, u, l]) => <Tilt key={l} max={12} className="glass p-5"><p className="h text-4xl md:text-5xl text-gold" style={{ transform: 'translateZ(30px)' }}><Counter to={n} suffix={u} /></p><p className="label mt-2">{l}</p></Tilt>)}</div>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section id="journey" className="py-28 bg-sand">
      <div className="px-5 md:px-10 mb-10"><Reveal><span className="label block mb-4">The journey</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)]">Eight years,<br />five chapters.</h2></Reveal></div>
      <Rail label="Drag to travel through time">
        {journey.map(([y, t, d, k]) => (
          <Tilt key={y} max={7} className="shrink-0 w-[78vw] sm:w-[360px] bg-ink text-sand overflow-hidden group">
            <div className="overflow-hidden"><Photo k={k} className="w-full aspect-[4/3] group-hover:scale-110 transition duration-[1400ms]" /></div>
            <div className="p-6" style={{ transform: 'translateZ(30px)' }}><p className="h text-5xl gold-text">{y}</p><h3 className="h text-xl mt-3">{t}</h3><p className="text-xs mt-3 opacity-75">{d}</p></div>
          </Tilt>))}
      </Rail>
    </section>
  )
}

function Values() {
  const [on, setOn] = useState<number | null>(null)
  return (
    <section id="values" className="py-28 bg-[#eeede9] px-5 md:px-10">
      <Reveal><span className="label block mb-4">What we stand for</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)]">Four promises.<br />Hover to flip.</h2></Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {values.map(([t, d, k, n], i) => (
          <div key={t} onClick={() => setOn(on === i ? null : i)} className={`flip h-[400px] relative cursor-pointer ${on === i ? 'on' : ''}`}>
            <div className="flip-inner absolute inset-0">
              <div className="flip-face overflow-hidden shadow-xl"><Photo k={k} className="h-full w-full" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /><div className="absolute bottom-0 p-6 text-sand"><p className="h text-5xl gold-text">{n}</p><h3 className="h text-2xl mt-2">{t}</h3></div></div>
              <div className="flip-face flip-back bg-ink text-sand p-7 flex flex-col justify-center shadow-xl"><p className="label text-gold">{n} · {t}</p><p className="text-sm mt-5 opacity-85">{d}</p></div>
            </div>
          </div>))}
      </div>
    </section>
  )
}

function Worlds() {
  const [a, setA] = useState(0)
  return (
    <section className="bg-ink text-sand">
      <div className="px-5 md:px-10 pt-24 pb-10"><Reveal><span className="label text-gold block mb-4">One brand, three worlds</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)]">Pick your<br />way in.</h2></Reveal></div>
      <div className="flex flex-col md:flex-row h-[1020px] md:h-[78vh] md:min-h-[520px]">
        {worlds.map(([t, d, k, cta, to], i) => (
          <div key={t} onMouseEnter={() => setA(i)} onClick={() => setA(i)} className={`relative overflow-hidden transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)] ${a === i ? 'flex-[3]' : 'flex-1'}`}>
            <Photo k={k} className="absolute inset-0 h-full w-full transition duration-[1400ms]" />
            <div className={`absolute inset-0 transition-all duration-700 ${a === i ? 'bg-black/30' : 'bg-black/65'}`} />
            <div className="absolute bottom-0 p-6 md:p-8"><h3 className="h text-3xl md:text-5xl">{t}</h3>
              <div className={`transition-all duration-700 overflow-hidden ${a === i ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}><p className="text-xs max-w-xs opacity-90">{d}</p><Link to={to} className="inline-block mt-4 bg-gold text-ink rounded-full px-6 py-3 label hover:bg-sand transition">{cta} ↗</Link></div></div>
          </div>))}
      </div>
    </section>
  )
}

function Team() {
  return (
    <section id="team" className="relative bg-ink text-sand pt-24 pb-16 overflow-hidden border-t border-sand/10">
      <div className="px-5 md:px-10 mb-6"><Reveal><span className="label text-gold block mb-4">The people</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)]">Hands you<br />can trust.</h2><p className="label mt-4 opacity-60">Drag the ring</p></Reveal></div>
      <Ring3D items={team.map((t) => ({ img: t.img, title: t.name, sub: t.role }))} />
      <div className="px-5 md:px-10 mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">{team.slice(0, 4).map((t) => <Tilt key={t.name} max={10} className="glass p-4"><p className="h text-xl">{t.name}</p><p className="label !font-medium text-gold mt-1">{t.role}</p><p className="text-xs mt-2 opacity-75">{t.skill}</p></Tilt>)}</div>
    </section>
  )
}

function Gallery() {
  const g = [['wide', 'The lounge'], ['close', 'Treatment suite'], ['facial', 'Facial studio'], ['foot2', 'Hand & foot bar'], ['back', 'Body ritual'], ['reception', 'Reception']]
  const [i, setI] = useState(0)
  return (
    <section className="py-24 bg-[#151915] text-sand overflow-hidden">
      <div className="px-5 md:px-10 mb-10"><Reveal><span className="label text-gold block mb-4">Inside Velvet Touch</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)]">A look<br />around.</h2></Reveal></div>
      <Coverflow items={g.map(([k, t]) => ({ img: k, title: t, sub: 'Velvet Touch' }))} index={i} onChange={setI} />
    </section>
  )
}

function Visit() {
  return (
    <section id="visit" className="bg-sand px-5 md:px-10 py-28">
      <Reveal><span className="label block mb-4">Visit us</span><h2 className="h text-[clamp(2.2rem,5vw,4.6rem)] max-w-3xl">Come in. Slow down.</h2></Reveal>
      <div className="grid md:grid-cols-3 gap-10 mt-14 text-xs leading-relaxed">
        <div><h4 className="label mb-4">Opening hours</h4>{spa.hours.map(([d, t]) => <p key={d} className="flex justify-between gap-4 border-b border-ink/15 py-2"><span>{d}</span><span className="opacity-70">{t}</span></p>)}</div>
        <div><h4 className="label mb-4">Find us</h4><p className="opacity-80">{spa.address}<br />{spa.phone}<br />{spa.email}</p></div>
        <div><h4 className="label mb-4">Amenities</h4><ul className="space-y-2 opacity-80">{amenities.slice(0, 6).map((a) => <li key={a}>— {a}</li>)}</ul></div>
      </div>
      <div className="flex flex-wrap gap-3 mt-14"><Link to="/booking" className="bg-ink text-sand rounded-full px-7 py-4 label">Book appointment ↗</Link><Link to="/products" className="border border-ink/40 rounded-full px-7 py-4 label hover:bg-ink hover:text-sand transition">Shop products</Link><Link to="/track" className="border border-ink/40 rounded-full px-7 py-4 label hover:bg-ink hover:text-sand transition">Track order</Link></div>
    </section>
  )
}

export default function About() { return <main><Hero /><Story /><Strip /><Stats /><Journey /><Values /><Worlds /><Team /><Gallery /><Visit /></main> }
