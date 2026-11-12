"use client";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { content } from "./content";
type Memory = (typeof content.memories)[number];

// Render visible photos in server HTML; never gate visibility on an onLoad event.
function MemoryImage({ memory, priority = false }: { memory: Memory; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, [attempt]);
  return <div className="image-surface">{failed ? <div className="image-error" role="status"><span aria-hidden="true">&#9825;</span><p>This memory could not be loaded.</p><button onClick={e => { e.stopPropagation(); setFailed(false); setAttempt(a => a + 1); }}>Try again</button><a href={memory.src}>Open original photo</a></div> : <img ref={imageRef} key={attempt} src={attempt ? `${memory.src}?retry=${attempt}` : memory.src} alt={memory.alt} width={720} height={960} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" onError={() => setFailed(true)} />}</div>;
}

function Modal({ children, label, onClose, onPrevious, onNext }: { children: ReactNode; label: string; onClose: () => void; onPrevious?: () => void; onNext?: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    el?.showModal(); document.body.style.overflow = "hidden";
    return () => { el?.close(); document.body.style.overflow = overflow; trigger?.focus(); };
  }, []);
  return <dialog ref={dialog} className="modal" aria-label={label} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={e => { if (e.key === "ArrowLeft" && onPrevious) { e.preventDefault(); onPrevious(); } if (e.key === "ArrowRight" && onNext) { e.preventDefault(); onNext(); } }}><div className="modal-panel"><button autoFocus className="close-button" onClick={onClose} aria-label="Close dialog">&#215;</button>{children}</div></dialog>;
}
function tilt(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--rx", `${(0.5 - (e.clientY - box.top) / box.height) * 7}deg`);
  e.currentTarget.style.setProperty("--ry", `${((e.clientX - box.left) / box.width - 0.5) * 9}deg`);
}
export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [surprise, setSurprise] = useState(false);
  const previous = () => setSelected(i => i === null ? null : (i + content.memories.length - 1) % content.memories.length);
  const next = () => setSelected(i => i === null ? null : (i + 1) % content.memories.length);
  return <main id="home">
    <a className="skip-link" href="#memories">Skip to memories</a>
    <nav className="topbar" aria-label="Main navigation"><a className="brand" href="#home"><span className="brand-mark">A</span>A little gift <span className="brand-star" aria-hidden="true">&#10022;</span></a><div className="nav-items"><a href="#memories">The memories</a><a className="nav-letter" href="#letter">A letter for you <span aria-hidden="true">&#8599;</span></a></div></nav>
    <section className="hero" aria-labelledby="hero-title"><div className="hero-light" aria-hidden="true"/><div className="orbit orbit-one" aria-hidden="true"/><div className="orbit orbit-two" aria-hidden="true"/>
      <div className="hero-copy"><p className="eyebrow"><span/>A LOVE THAT MADE A HOME</p><p className="hero-pre">To the two people I love most</p><h1 id="hero-title">Happy<br/><em>Anniversary,</em><br/>{content.parents}<span className="gold-heart" aria-hidden="true">&#9825;</span></h1><p className="hero-message">{content.heroMessage}</p><a href="#memories" className="button button-gold">Our beautiful memories <span aria-hidden="true">&#8599;</span></a><p className="hero-date"><span aria-hidden="true">&#10022;</span>{content.anniversaryDate}</p></div>
      <div className="hero-art"><div className="photo-halo" aria-hidden="true"/><div className="portrait-stage"><div className="portrait-border"><MemoryImage memory={content.memories[0]} priority/></div><span className="frame-corner corner-tl" aria-hidden="true"/><span className="frame-corner corner-br" aria-hidden="true"/><div className="portrait-caption"><span>CHAPTER 01</span><p>Where it all began</p></div></div><span className="art-inscription">A LIFETIME OF TOGETHER</span><span className="art-star" aria-hidden="true">&#10022;</span></div>
      <div className="hero-bottom"><span>MADE WITH LOVE, BY AWAIS</span><a href="#dedication">SCROLL TO FEEL THE LOVE <span aria-hidden="true">&#8595;</span></a></div></section>
    <section className="dedication section-shell" id="dedication"><span className="section-index">01 / FROM MY HEART</span><span className="little-star" aria-hidden="true">&#10022;</span><h2>Some people are home.<br/><em>You are my whole world.</em></h2><p>{content.dedication}</p><div className="gold-rule" aria-hidden="true"><span/>&#9825;<span/></div></section>
    <section className="memories-section section-shell" id="memories"><div className="section-heading"><div><span className="section-index">02 / LITTLE MOMENTS, FOREVER TREASURES</span><h2>Our <em>memory album</em></h2></div><p>Every photo holds a thousand feelings.<br/><span>Choose a photograph to look a little closer.</span></p></div><div className="memory-grid">{content.memories.map((memory, i) => <article className="memory-card" key={memory.src}><div className="memory-photo" onPointerMove={tilt} onPointerLeave={e => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }}><MemoryImage memory={memory}/><span className="photo-number">0{i + 1}</span><button className="expand-photo" aria-label={`View photo ${i + 1}: ${memory.title}`} onClick={() => setSelected(i)}><span aria-hidden="true">&#8599;</span></button></div><div className="memory-text"><h3>{memory.title}</h3><p>{memory.caption}</p></div></article>)}</div></section>
    <section className="journey section-shell"><div className="section-heading"><div><span className="section-index">03 / A BEAUTIFUL JOURNEY</span><h2>A lifetime of <em>together</em></h2></div><span className="journey-heart" aria-hidden="true">&#9825;</span></div><div className="timeline">{content.milestones.map((m, i) => <article className="milestone" key={m.label}><span className="milestone-number">0{i + 1}</span><h3>{m.label}</h3><p>{m.text}</p></article>)}</div></section>
    <section className="letter-section" id="letter"><div className="section-shell letter-layout"><div className="letter-heading"><span className="section-index">04 / WORDS FROM YOUR SON</span><h2>A letter to<br/><em>{content.parents}</em></h2><p>WORDS I WISH I COULD SAY IN PERSON</p><p>Even when I am far away, you are always close to my heart.</p><span className="letter-line" aria-hidden="true"/></div><details className="letter"><summary><span className="envelope-art" aria-hidden="true"><span className="envelope-flap"/><span className="envelope-seal">A</span></span><span className="envelope-label"><span className="open-label">Tap to open my letter</span><span className="close-label">Close my letter</span><span aria-hidden="true">&#8599;</span></span></summary><div className="letter-paper"><p className="letter-to">To my dearest Mama &amp; Papa <span aria-hidden="true">&#9825;</span></p>{content.letter.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<p className="signature">With all my love,<br/><strong>{content.from}</strong></p></div></details></div></section>
    <section className="dua-section section-shell"><span className="section-index">05 / A PRAYER FOR YOU</span><div className="moon" aria-hidden="true">&#9789;</div><h2>My forever <em>dua</em></h2><p>{content.dua}</p><span className="ameen">Ameen &#9825;</span></section>
    <section className="surprise-section"><div className="section-shell"><span className="section-index">ONE LAST LITTLE SURPRISE</span><h2>Before you go&hellip;<br/><em>one more thing</em></h2><p>I have one more message for you.</p><button className="button button-gold" onClick={() => setSurprise(true)}>Open your surprise <span aria-hidden="true">&#9825;</span></button></div></section>
    <footer><a className="brand-mark" href="#home" aria-label="Back to top">A</a><p>Forever grateful to be your son.</p><strong>{content.from}</strong><span>Made with &#9829; &middot; {content.anniversaryDate}</span></footer>
    {selected !== null && <Modal label="Memory photo viewer" onClose={() => setSelected(null)} onPrevious={previous} onNext={next}><div className="lightbox-image" key={selected}><MemoryImage memory={content.memories[selected]} priority/></div><div className="lightbox-bottom"><button className="round-button" onClick={previous} aria-label="Previous photo">&#8592;</button><div aria-live="polite"><span className="section-index">{selected + 1} / {content.memories.length}</span><h3>{content.memories[selected].title}</h3><p>{content.memories[selected].caption}</p></div><button className="round-button" onClick={next} aria-label="Next photo">&#8594;</button></div><p className="keyboard-note">Use arrow keys to browse &middot; Esc to close</p></Modal>}
    {surprise && <Modal label="Anniversary surprise" onClose={() => setSurprise(false)}><div className="surprise-message"><span className="surprise-heart" aria-hidden="true">&#9825;</span><p className="section-index">FROM YOUR SON, WITH ALL MY LOVE</p><h2>I love you,<br/><em>Mama &amp; Papa!</em></h2><p>No distance can ever change how much you mean to me. May Allah keep you both happy, healthy, and together. Ameen.</p><button className="button button-outline" onClick={() => setSurprise(false)}>Keep these memories close &#9825;</button></div></Modal>}
  </main>;
}
