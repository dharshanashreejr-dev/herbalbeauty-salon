import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { ProductArt } from "./art";
import { products, allServices, productPhoto, rupees, BRAND, type Lang } from "./data";
import { img, photos, type Photo } from "./photos";
import { herbalSlides, promoCards, festiveDays, spaOfferings, bundles, arrivals } from "./showcase";

const byId = (id: string) => products.find((p) => p.id === id)!;
const svc = (id: string) => allServices.find((s) => s.id === id)!;

/* ───────── shared helpers ───────── */

/** Real product photo from /public/assets/products/<id>.webp, with a graceful fallback. */
export function ProductPhoto({ id, className, alt, lang = "en" }: { id: string; className?: string; alt?: string; lang?: Lang }) {
  const p = byId(id);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  const label = alt ?? p.name[lang];
  if (failed)
    return <ProductArt kind={p.kind} tone={p.tone} className={`${className ?? ""} is-fallback`} title={label} />;
  return (
    <img
      ref={ref}
      className={className}
      src={productPhoto(id)}
      alt={label}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function useSwipe(opts: Parameters<typeof useEmblaCarousel>[0] = {}) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", ...opts });
  const [index, setIndex] = useState(0);
  const [snaps, setSnaps] = useState(0);
  useEffect(() => {
    if (!api) return;
    const on = () => {
      setIndex(api.selectedScrollSnap());
      setSnaps(api.scrollSnapList().length);
    };
    on();
    api.on("select", on);
    api.on("reInit", on);
    return () => {
      api.off("select", on);
      api.off("reInit", on);
    };
  }, [api]);
  return { ref, api, index, snaps, prev: () => api?.scrollPrev(), next: () => api?.scrollNext() };
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setSeen(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

function Arrows({ prev, next, label }: { prev: () => void; next: () => void; label: string }) {
  return (
    <div className="swipe-arrows">
      <button className="icon-button swipe-arrow" aria-label={`${label}: previous`} onClick={prev}>
        <ArrowLeft size={20} />
      </button>
      <button className="icon-button swipe-arrow" aria-label={`${label}: next`} onClick={next}>
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

/* ───────── 02 · Herbal signature showcase + promo cards ───────── */

const lights = [
  { key: "dusk", label: "Dusk" },
  { key: "ivory", label: "Ivory" },
  { key: "bloom", label: "Bloom" },
] as const;
const lightBg = [
  null,
  "linear-gradient(135deg,#ffffff 0%,#f4f1ee 60%,#e9e2dc 100%)",
  "linear-gradient(135deg,#fde7ea 0%,#f3bfc8 55%,#e49aa8 100%)",
];

export function HerbalShowcase({ onOpen, onAdd, lang = "en" }: { onOpen: (id: string) => void; onAdd: (id: string) => void; lang?: Lang }) {
  const main = useSwipe({ loop: true, align: "center", containScroll: false });
  const promo = useSwipe({ dragFree: true });
  const [herb, setHerb] = useState(0);
  const [light, setLight] = useState(0);
  useEffect(() => setHerb(0), [main.index]);
  const strip = "FREE DELIVERY ON ALL ORDERS ABOVE ₹1,999   |   HERBAL COLLECTION IS LIVE   |   ";
  return (
    <section id="collection" className="herbal">
      <div className="herbal-strip" aria-hidden="true">
        <div>
          {[0, 1, 2].map((k) => (
            <span key={k}>{strip}</span>
          ))}
        </div>
      </div>
      <div className="herbal-stage">
        <div className="swipe-viewport" ref={main.ref}>
          <div className="swipe-track">
            {herbalSlides.map((s, i) => {
              const p = byId(s.id);
              const active = main.index === i;
              return (
                <article
                  key={s.id}
                  className={`herbal-slide ${active ? "is-active" : ""} ${light === 1 ? "is-light" : ""}`}
                  style={{ background: lightBg[light] ?? s.bg }}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${herbalSlides.length}`}
                >
                  <span className="herbal-ghost" aria-hidden="true">
                    {s.ghost}
                  </span>
                  <div className="herbal-label">
                    <span className="eyebrow">
                      {String(i + 1).padStart(2, "0")} / Herbal collection
                    </span>
                    <span className="eyebrow">{BRAND}</span>
                  </div>
                  <div className="herbal-product">
                    <div className="herbal-photo">
                      <span className="herbal-halo" aria-hidden="true" />
                      <ProductPhoto id={s.id} className="herbal-img" alt={p.name[lang]} />
                      {s.hotspots.map((h, hi) => (
                        <button
                          key={hi}
                          className={`hotspot ${active && herb === hi ? "is-active" : ""}`}
                          style={{ left: `${h.x}%`, top: `${h.y}%` }}
                          aria-label={s.herbs[hi].v}
                          aria-pressed={herb === hi}
                          onClick={() => setHerb(hi)}
                        >
                          <span className="hotspot-dot" />
                          <span className="hotspot-label">
                            <small>
                              {String(hi + 1).padStart(2, "0")} · {s.herbs[hi].k}
                            </small>
                            {s.herbs[hi].v}
                          </span>
                        </button>
                      ))}
                    </div>
                    <span className="product-caption">Touch the points to explore the herbs</span>
                  </div>
                  <div className="herbal-info">
                    <span className="eyebrow">{s.tags}</span>
                    <span className="herbal-badge">✦ Herbal-infused · {s.kind}</span>
                    <h2>
                      {s.title[0]}
                      <br />
                      {s.title[1]}
                    </h2>
                    <p>{s.copy}</p>
                    <div className="herbal-notes">
                      {s.herbs.map((h) => (
                        <span key={h.v}>{h.v}</span>
                      ))}
                    </div>
                    <div className="mood-picker herbal-light" role="radiogroup" aria-label="Set the light">
                      <span className="eyebrow">Set the light</span>
                      <div>
                        {lights.map((m, li) => (
                          <button
                            key={m.key}
                            role="radio"
                            aria-checked={light === li}
                            className={light === li ? "is-active" : ""}
                            onClick={() => setLight(li)}
                          >
                            <span className="mood-swatch" style={{ background: lightBg[li] ?? s.bg }} />
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="herbal-cta">
                      <button className="pill dark herbal-pill" onClick={() => onOpen(s.id)}>
                        Discover {p.name[lang].split(" ")[0]}
                        <span className="pill-dot">
                          <Plus size={20} />
                        </span>
                      </button>
                      <button className="herbal-add" onClick={() => onAdd(s.id)}>
                        Add to bag · {rupees(p.price)}
                      </button>
                    </div>
                    <span className="product-size">{s.size}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="herbal-nav">
          <Arrows prev={main.prev} next={main.next} label="Herbal collection" />
          <div className="herbal-dots" role="tablist" aria-label="Choose product">
            {herbalSlides.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={main.index === i}
                aria-label={byId(s.id).name[lang]}
                className={main.index === i ? "is-active" : ""}
                onClick={() => main.api?.scrollTo(i)}
              />
            ))}
          </div>
          <span className="herbal-count">
            {String(main.index + 1).padStart(2, "0")} / {String(herbalSlides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="promo">
        <div className="promo-head">
          <div>
            <span className="eyebrow">The herbal edit</span>
            <h3>Offers worth a swipe.</h3>
          </div>
          <Arrows prev={promo.prev} next={promo.next} label="Offers" />
        </div>
        <div className="swipe-viewport" ref={promo.ref}>
          <div className="swipe-track promo-track">
            {promoCards.map((c) => {
              const p = byId(c.id);
              return (
                <article className="promo-card" key={c.id + c.title} style={{ background: c.bg }}>
                  <span className="promo-brand">{c.brand}</span>
                  {c.chips && (
                    <span className="promo-chips">
                      {c.chips.split(" · ").map((w) => (
                        <i key={w}>{w}</i>
                      ))}
                    </span>
                  )}
                  <h4>
                    {c.title.split("\n").map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </h4>
                  <div className="promo-photo">
                    <ProductPhoto id={c.id} alt={p.name[lang]} />
                  </div>
                  <div className="promo-foot">
                    <div>
                      <strong>{c.offer}</strong>
                      <span>{c.sub}</span>
                    </div>
                    <button onClick={() => onOpen(c.id)}>
                      Shop Now <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── video components ───────── */

function AutoVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video ref={ref} className={className} muted loop playsInline preload="metadata" poster={poster}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

export function VideoBand({ onBook }: { onBook: () => void }) {
  const reels = [
    { src: "/assets/video/salon.mp4", tag: "The salon", line: "Hair wash to hood dryer" },
    { src: "/assets/video/reel-1.mp4", tag: "The spa", line: "Herbal rituals, slowly" },
    { src: "/assets/video/reel-2.mp4", tag: "The makeup", line: "Velvet lips, golden finish" },
  ];
  const main = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const toggle = () => {
    const v = main.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <section className="film" id="film">
      <div className="film-head">
        <div>
          <span className="eyebrow">The film</span>
          <h2>Watch the ritual unfold.</h2>
        </div>
        <p>A few quiet minutes inside THE VELVET TOUCH. From the first herbal oil to the final glow.</p>
      </div>
      <div className="film-grid">
        <div className="film-main">
          <video
            ref={main}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster="/assets/video/velvet-film.jpg"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/assets/video/velvet-film.mp4" type="video/mp4" />
          </video>
          <div className="film-shade" />
          <div className="film-caption">
            <span className="eyebrow">Beauty · Salon · Spa</span>
            <strong>Where every day turns a little more luxurious.</strong>
            <button className="pill light film-pill" onClick={onBook}>
              Book an appointment
              <span className="pill-dot">
                <Plus size={20} />
              </span>
            </button>
          </div>
          <button className="film-toggle" onClick={toggle} aria-label={playing ? "Pause film" : "Play film"}>
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <div className="film-reels">
          {reels.map((r) => (
            <figure className="reel" key={r.src}>
              <AutoVideo src={r.src} />
              <figcaption>
                <span>{r.tag}</span>
                {r.line}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 9 days · 9 ways to glow ───────── */

export function NineDays({ onBook }: { onBook: () => void }) {
  const s = useSwipe({ dragFree: true });
  const wheelLock = useRef(0);
  useEffect(() => {
    const el = s.api?.rootNode();
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < 8) return;
      const now = Date.now();
      if (now - wheelLock.current < 420) return;
      wheelLock.current = now;
      if (e.deltaY > 0) s.api?.scrollNext();
      else s.api?.scrollPrev();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [s.api]);
  return (
    <section className="nine" id="nine-days">
      <div className="nine-pattern" aria-hidden="true" />
      <div className="nine-head">
        <h2>
          <em>9</em> Shades <em>of</em> you, In our signature products and SPA
        </h2>
        <span className="nine-sub">Festive seasons are comming UP!</span>
        <p>Nine colours, nine looks. Pick your day and let our artists dress you in it.</p>
      </div>
      <div className="swipe-viewport" ref={s.ref}>
        <div className="swipe-track nine-track">
          {festiveDays.map((d) => (
            <button
              key={d.n}
              className="day-card"
              style={{ "--c": d.bg, "--f": d.fg } as React.CSSProperties}
              data-cursor="Book"
              onClick={onBook}
            >
              <span
                className="day-photo"
                style={{
                  backgroundImage: `url(/assets/hero-${d.hero}.webp)`,
                  backgroundPosition: `center, ${d.pos}`,
                }}
              />
              <span className="day-wash" />
              <span className="day-num">
                <em>{d.n}</em>
                <small>DAY</small>
              </span>
              <span className="day-label">{d.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="nine-foot">
        <Arrows prev={s.prev} next={s.next} label="Festive looks" />
        <button className="pill light" onClick={onBook}>
          Book your festive look
          <span className="pill-dot">
            <Plus size={20} />
          </span>
        </button>
      </div>
    </section>
  );
}

/* ───────── spa offerings ───────── */

export function SpaOfferings({ onBook, lang = "en" }: { onBook: (id: string) => void; lang?: Lang }) {
  const [ref, seen] = useInView<HTMLElement>(0.12);
  const s = useSwipe({ loop: false, align: "center" });
  const wheelLock = useRef(0);
  useEffect(() => {
    const el = s.api?.rootNode();
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (Math.abs(e.deltaY) < 8) return;
      const now = Date.now();
      if (now - wheelLock.current < 420) return;
      wheelLock.current = now;
      if (e.deltaY > 0) s.api?.scrollNext();
      else s.api?.scrollPrev();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [s.api]);
  return (
    <section className={`spa ${seen ? "is-in" : ""}`} id="spa" ref={ref}>
      <div className="spa-head">
        <div>
          <span className="eyebrow">05 / The spa</span>
          <h2>Slow, herbal, restorative.</h2>
        </div>
        <p>
          Every spa treatment uses warm herbal oils and is finished with a product from our collection. Scroll or swipe
          through each ritual and reserve your time.
        </p>
      </div>
      <div className="spa-swipe-wrap">
        <div className="swipe-viewport spa-viewport" ref={s.ref}>
          <div className="swipe-track spa-track">
            {spaOfferings.map((o, i) => {
              const svcItem = svc(o.id);
              const fin = byId(o.finish);
              const photo = (photos as Record<string, Photo>)[o.photo];
              return (
                <article className="spa-card spa-slide" key={o.id} style={{ "--i": i } as React.CSSProperties}>
                  <div className="spa-media">
                    <img {...img(photo, "(max-width: 799px) 100vw, 70vw")} loading="lazy" width="1200" height="900" />
                    <span className="spa-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="spa-herb">✦ {o.herbs}</span>
                  </div>
                  <div className="spa-body">
                    <div className="spa-title">
                      <h3>{svcItem.name[lang]}</h3>
                      <span>{svcItem.mins} min</span>
                    </div>
                    <p>{svcItem.desc.en}</p>
                    <ul>
                      {o.includes.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <small>Finished with {fin.name[lang]}</small>
                    <div className="spa-foot">
                      <strong>{rupees(svcItem.price)}</strong>
                      <button className="service-book" onClick={() => onBook(o.id)}>
                        Book
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="spa-swipe-foot">
          <Arrows prev={s.prev} next={s.next} label="Spa offerings" />
          <div className="spa-dots" role="tablist" aria-label="Spa offerings">
            {spaOfferings.map((_, i) => (
              <button
                key={i}
                className={`spa-dot ${s.index === i ? "is-active" : ""}`}
                aria-label={`Show spa ritual ${i + 1}`}
                aria-selected={s.index === i}
                onClick={() => s.api?.scrollTo(i)}
              />
            ))}
          </div>
          <span className="spa-counter">
            {String(s.index + 1).padStart(2, "0")} / {String(spaOfferings.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ───────── 06 · recommended picks (service + product reveal) ───────── */

function PickCard({ b, onBundle, lang = "en" }: { b: (typeof bundles)[number]; onBundle: (service: string, product: string) => void; lang?: Lang }) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const s = svc(b.service);
  const p = byId(b.product);
  const total = s.price + p.price;
  const offer = Math.round((total * 0.9) / 10) * 10;
  return (
    <article className={`pick ${seen ? "is-in" : ""}`} ref={ref}>
      <div className="pick-stage">
        <span className="pick-tag pick-tag-a">{b.a}</span>
        <span className="pick-tag pick-tag-b">{b.b}</span>
        <div className="pick-service" style={{ backgroundImage: `url(${b.photo})`, backgroundPosition: b.pos }} />
        <span className="pick-plus">
          <Plus size={20} />
        </span>
        <div className="pick-product">
          <ProductPhoto id={b.product} alt={p.name[lang]} />
        </div>
      </div>
      <div className="pick-body">
        <h3>{b.title}</h3>
        <p>{b.copy}</p>
        <div className="pick-price">
          <s>{rupees(total)}</s>
          <strong>{rupees(offer)}</strong>
          <span>Save 10%</span>
        </div>
        <button className="pill dark pick-cta" onClick={() => onBundle(b.service, b.product)}>
          Book &amp; add to bag
          <span className="pill-dot">
            <Plus size={20} />
          </span>
        </button>
      </div>
    </article>
  );
}

export function RecommendedPicks({ onBundle, lang = "en" }: { onBundle: (service: string, product: string) => void; lang?: Lang }) {
  const s = useSwipe({ dragFree: true });
  return (
    <section className="picks" id="picks">
      <div className="picks-head">
        <div>
          <span className="eyebrow">06 / Our recommended picks</span>
          <h2>Treat yourself, then take it home.</h2>
        </div>
        <p>Pair a spa or salon service with the herbal product we use in it. Book together and save 10%.</p>
        <Arrows prev={s.prev} next={s.next} label="Recommended picks" />
      </div>
      <div className="swipe-viewport" ref={s.ref}>
        <div className="swipe-track picks-track">
          {bundles.map((b) => (
            <PickCard key={b.service + b.product} b={b} onBundle={onBundle} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 07 · beauty that stays with you (new arrivals row) ───────── */

export function NewArrivals({
  onOpen,
  onAdd,
  onJournal,
  lang = "en",
}: {
  onOpen: (id: string) => void;
  onAdd: (id: string) => void;
  onJournal: () => void;
  lang?: Lang;
}) {
  const s = useSwipe({ dragFree: true });
  return (
    <section className="arrivals" id="story">
      <span className="arrivals-ghost" aria-hidden="true">
        NEW
      </span>
      <div className="arrivals-head">
        <span className="eyebrow">07 / The world of {BRAND}</span>
        <h2>Beauty that stays with you.</h2>
        <p>Latest herbal arrivals you&rsquo;ll want to own.</p>
      </div>
      <div className="arrivals-wrap">
        <div className="swipe-viewport" ref={s.ref}>
          <div className="swipe-track arrivals-track">
            {arrivals.map((a) => {
              const p = byId(a.id);
              return (
                <article className="arrival" key={a.id}>
                  <span className="arrival-brand">{a.brand}</span>
                  <button className="arrival-photo" onClick={() => onOpen(a.id)} aria-label={`View ${p.name[lang]}`}>
                    <ProductPhoto id={a.id} alt={p.name[lang]} />
                  </button>
                  <h3>{p.name[lang]}</h3>
                  <p>{a.line}</p>
                  <div className="arrival-foot">
                    <span>{rupees(p.price)}</span>
                    <button onClick={() => onAdd(a.id)}>
                      Add <Plus size={14} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <button className="arrivals-next" aria-label="Next" onClick={s.next}>
          <ArrowRight size={20} />
        </button>
      </div>
      <button className="text-link arrivals-link" onClick={onJournal}>
        Enter our world
        <Plus size={16} />
      </button>
    </section>
  );
}