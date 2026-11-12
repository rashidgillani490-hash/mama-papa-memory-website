"use client";

import { useEffect, useRef, useState } from "react";
import { content } from "./content";

function Heart({ className = "" }: { className?: string }) {
  return <span className={className} aria-hidden="true">♥</span>;
}

function Photo({ src, alt, title, caption, index }: { src: string; alt: string; title: string; caption: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <article className={`memory-card memory-${index + 1}`}>
      <div className="photo-wrap">
        {/* The placeholder remains attractive until photos are added to /public/photos. */}
        {!loaded && <div className="photo-fallback"><span>✿</span><p>{failed ? "Photo unavailable" : "Loading memory…"}</p></div>}
        {/* Standard img tolerates missing optional files without breaking the page. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => { setLoaded(false); setFailed(true); }} style={{ opacity: loaded ? 1 : 0 }} />
      </div>
      <div className="memory-card-text"><h3>{title}</h3><p>{caption}</p></div>
    </article>
  );
}

export default function Home() {
  const [letterOpen, setLetterOpen] = useState(false);
  const [surprise, setSurprise] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!surprise) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [surprise]);



  return (
    <main>
      <nav className="topbar"><a className="brand" href="#home">A little gift <Heart /></a><a className="nav-link" href="#letter">A letter for you <span aria-hidden="true">↗</span></a></nav>

      <section className="hero" id="home">
        <div className="hero-orb orb-a"/><div className="hero-orb orb-b"/>
        <div className="floral floral-a" aria-hidden="true">✿</div><div className="floral floral-b" aria-hidden="true">✧</div>
        <p className="eyebrow appear">A LOVE THAT MADE A HOME</p>
        <p className="hero-pre appear">To the two people I love most</p>
        <h1 className="appear">Happy <em>Anniversary,</em><br/>{content.parents}<span className="heart-dot">♥</span></h1>
        <p className="hero-copy appear">{content.heroMessage}</p>
        <p className="date-pill appear">✦ &nbsp; {content.anniversaryDate} &nbsp; ✦</p>
        <a href="#memories" className="primary-button appear">Our beautiful memories <span aria-hidden="true">↓</span></a>
        <div className="scroll-note">MADE WITH LOVE <span aria-hidden="true">↓</span></div>
      </section>

      <section className="dedication section-shell">
        <span className="section-kicker">FROM MY HEART</span>
        <h2>Some people are home.<br/><em>You are my whole world.</em></h2>
        <p>{content.dedication}</p><div className="ornament" aria-hidden="true">✿ ❦ ✿</div>
      </section>

      <section className="memories-section" id="memories">
        <div className="section-shell">
          <div className="section-heading"><div><span className="section-kicker">LITTLE MOMENTS, FOREVER TREASURES</span><h2>Our <em>memory album</em></h2></div><p>Every photo holds a thousand feelings.</p></div>
          <div className="memory-grid">{content.memories.map((m, i) => <Photo key={m.src} {...m} index={i}/>)}</div>
        </div>
      </section>

      <section className="timeline-section section-shell">
        <span className="section-kicker">A BEAUTIFUL JOURNEY</span><h2>A lifetime of <em>together</em></h2>
        <div className="timeline">{content.milestones.map((m, i) => <div className="milestone" key={m.label}><div className="milestone-number">0{i + 1}</div><div><h3>{m.label}</h3><p>{m.text}</p></div></div>)}</div>
      </section>

      <section className="letter-section" id="letter">
        <div className="letter-container">
          <span className="section-kicker">WORDS I WISH I COULD SAY IN PERSON</span><h2>A letter to <em>Mama & Papa</em></h2>
          <p className="letter-intro">Even when I am far away, you are always close to my heart.</p>
          {!letterOpen ? <button className="envelope" onClick={() => setLetterOpen(true)} aria-label="Open your letter"><span className="envelope-seal">♥</span><span className="envelope-label">Tap to open my letter</span></button> :
            <div className="letter-paper" role="region" aria-label="Anniversary letter"><div className="letter-top">To my dearest Mama & Papa <Heart /></div>{content.letter.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<p className="signature">With all my love,<br/><strong>{content.from}</strong></p><button className="subtle-button" onClick={() => setLetterOpen(false)}>Close letter ↑</button></div>}
        </div>
      </section>

      <section className="dua-section section-shell"><span className="section-kicker">A PRAYER FOR YOU</span><div className="dua-symbol">☾</div><h2>My forever <em>dua</em></h2><p>{content.dua}</p><span className="dua-amen">Ameen 🤍</span></section>

      <section className="surprise-section" id="surprise"><span className="section-kicker">ONE LAST LITTLE SURPRISE</span><h2>Before you go… <em>one more thing</em></h2><p>I have one more message for you.</p><button className="primary-button" onClick={() => setSurprise(true)}>Open your surprise <Heart /></button></section>
      <footer><p>Forever grateful to be your son.</p><strong>{content.from}</strong><span>Made with ♥ · {content.anniversaryDate}</span></footer>

      {surprise && <dialog ref={dialogRef} className="modal-backdrop" aria-label="Anniversary surprise" onCancel={() => setSurprise(false)} onClick={(e) => { if (e.target === e.currentTarget) setSurprise(false); }}><div className="surprise-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" aria-label="Close surprise" onClick={() => setSurprise(false)}>×</button><div className="confetti" aria-hidden="true">{Array.from({length: 28}, (_, i) => <span key={i} style={{"--i": i} as React.CSSProperties}>{i % 3 === 0 ? "♥" : "✦"}</span>)}</div><span className="surprise-heart">♥</span><p className="section-kicker">FROM YOUR SON, WITH ALL MY LOVE</p><h2>I love you,<br/><em>Mama & Papa!</em></h2><p>No distance can ever change how much you mean to me. May Allah keep you both happy, healthy, and together. Ameen.</p><button className="subtle-button" onClick={() => setSurprise(false)}>Keep these memories close ♥</button></div></dialog>}

    </main>
  );
}
