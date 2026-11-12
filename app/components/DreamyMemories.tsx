"use client";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll } from "motion/react";
import { content } from "../content";
import MemoryImage from "./MemoryImage";

const storyPhotos = [0, 2, 3];
const storyNotes = ["A beautiful beginning", "Through every season", content.anniversaryDate];
const particles = Array.from({ length: 18 }, (_, i) => ({ left: `${(i * 37 + 11) % 100}%`, top: `${(i * 29 + 7) % 100}%`, delay: `${i * -.7}s` }));

function Star({ className = "" }: { className?: string }) {
  return <svg className={`star ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 0c0 12-4 16-16 16 12 0 16 4 16 16 0-12 4-16 16-16C20 16 16 12 16 0Z" fill="currentColor"/></svg>;
}
function Reveal({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const reduced = useReducedMotion();
  // Content is never initially transparent; delayed JS cannot make writing invisible.
  return <motion.div id={id} className={className} initial={false} whileInView={reduced ? undefined : { y: [16, 0] }} viewport={{ once: true, amount: .12 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
function Modal({ children, label, onClose, onPrevious, onNext, className = "" }: { children: ReactNode; label: string; onClose: () => void; onPrevious?: () => void; onNext?: () => void; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  useEffect(() => {
    const el = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    el?.showModal(); document.body.style.overflow = "hidden";
    return () => { el?.close(); document.body.style.overflow = overflow; trigger?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`modal ${className}`} aria-label={label} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} onKeyDown={e => {
    if (e.key === "ArrowLeft" && onPrevious) { e.preventDefault(); onPrevious(); }
    if (e.key === "ArrowRight" && onNext) { e.preventDefault(); onNext(); }
  }}><div className="modal-panel"><button className="close-button" autoFocus onClick={onClose} aria-label="Close dialog">&#215;</button><div className="modal-content" onPointerDown={e => { if (e.pointerType === "touch") touchStart.current = e.clientX; }} onPointerUp={e => {
    if (e.pointerType !== "touch" || touchStart.current === null) return;
    const distance = e.clientX - touchStart.current; touchStart.current = null;
    if (distance > 65) onPrevious?.(); else if (distance < -65) onNext?.();
  }} onPointerCancel={() => { touchStart.current = null; }}>{children}</div></div></dialog>;
}
function tilt(e: PointerEvent<HTMLDivElement>) {
  if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--rx", `${(.5 - (e.clientY - rect.top) / rect.height) * 7}deg`);
  e.currentTarget.style.setProperty("--ry", `${((e.clientX - rect.left) / rect.width - .5) * 9}deg`);
}
function resetTilt(e: PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg");
}

export default function DreamyMemories({ qrDataUrl, siteUrl }: { qrDataUrl: string; siteUrl: string }) {
  const [chapter, setChapter] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [surprise, setSurprise] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const chapterTabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const previous = () => setSelected(i => i === null ? null : (i + content.memories.length - 1) % content.memories.length);
  const next = () => setSelected(i => i === null ? null : (i + 1) % content.memories.length);
  async function shareGift() {
    try {
      if (navigator.share) { await navigator.share({ title: "Dreamy Memories | Mama & Papa", text: content.heroMessage, url: siteUrl }); setShareStatus("Shared with love."); }
      else { await navigator.clipboard.writeText(siteUrl); setShareStatus("Link copied. Ready to share with love."); }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setShareStatus("You can copy the website address below.");
    }
  }
  return <MotionConfig reducedMotion="user"><main id="home">
    <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>
    <a className="skip-link" href="#story">Skip to our story</a>
    <header className="header"><a className="brand" href="#home"><span className="brand-symbol" aria-hidden="true"><Star/></span><span>Dreamy Memories<small>A LITTLE GIFT, FOREVER YOURS</small></span></a><nav aria-label="Main navigation"><a href="#story">Our story</a><a href="#memories">The memories</a><a className="nav-letter" href="#letter">The letter <span aria-hidden="true">&#8599;</span></a></nav><span className="header-date">19 <span>NOVEMBER</span></span></header>

    <section className="hero" aria-labelledby="hero-title"><div className="hero-atmosphere" aria-hidden="true"/><div className="particles" aria-hidden="true">{particles.map((p, i) => <i key={i} style={{ left: p.left, top: p.top, animationDelay: p.delay }}/>)}</div>
      <div className="hero-copy"><p className="eyebrow"><span/>A LOVE THAT MADE A HOME</p><motion.p className="hero-pre" initial={false} animate={{ y: 0 }}>To the two people I love most</motion.p><h1 id="hero-title">Happy <em>Anniversary,</em><span>{content.parents}<Star/></span></h1><p className="hero-message">{content.heroMessage}</p><div className="hero-actions"><a className="button button-primary" href="#memories">Explore memories <span aria-hidden="true">&#8599;</span></a><span className="hero-date">{content.anniversaryDate}<small>A lifetime of together</small></span></div><p className="hero-signature">A little piece of my heart, <span>from Awais.</span></p></div>
      <div className="hero-composition" aria-label="Family wedding photo composition"><div className="composition-orbit orbit-a" aria-hidden="true"/><div className="composition-orbit orbit-b" aria-hidden="true"/><div className="composition-glow" aria-hidden="true"/><div className="hero-photo back-photo back-left"><MemoryImage memory={content.memories[3]} sizes="(max-width: 650px) 30vw, 180px"/></div><div className="hero-photo back-photo back-right"><MemoryImage memory={content.memories[2]} sizes="(max-width: 650px) 30vw, 180px"/></div><div className="hero-photo front-photo"><div className="photo-mat"><MemoryImage memory={content.memories[0]} priority sizes="(max-width: 650px) 60vw, (max-width: 1000px) 32vw, 340px"/></div><p>Where it all began<small>A BEAUTIFUL BEGINNING</small></p></div><Star className="composition-star star-one"/><Star className="composition-star star-two"/><div className="floating-note"><span aria-hidden="true">&#9825;</span><p>Some stories<br/>stay with us forever.</p></div><span className="composition-label">THE LOVE WE CALL HOME</span></div>
      <div className="hero-bottom"><span>MADE WITH LOVE, BY YOUR SON</span><a href="#dedication"><span className="scroll-circle" aria-hidden="true">&#8595;</span>Let the memories unfold</a><span>01 / 05</span></div></section>

    <section className="dedication section-shell" id="dedication"><Reveal><span className="section-kicker">FROM MY HEART</span><h2>Some people are home.<br/><em>You are my whole world.</em></h2><p>{content.dedication}</p><div className="ornament" aria-hidden="true"><span/><Star/><span/></div></Reveal></section>

    <section className="story-section" id="story"><div className="section-shell"><Reveal className="section-heading"><div><span className="section-kicker">01 / OUR STORY</span><h2>A lifetime of <em>together</em></h2></div><p>A beautiful journey.<br/>The little moments that became everything.</p></Reveal><div className="story-layout"><div className="story-tabs" role="tablist" aria-label="Story chapters" aria-orientation="vertical">{content.milestones.map((milestone, i) => <button key={milestone.label} ref={el => { chapterTabs.current[i] = el; }} id={`chapter-tab-${i}`} role="tab" aria-selected={chapter === i} aria-controls="story-panel" tabIndex={chapter === i ? 0 : -1} className={`story-tab ${chapter === i ? "active" : ""}`} onClick={() => setChapter(i)} onKeyDown={e => {
      let target = i;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") target = (i + 1) % 3;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") target = (i + 2) % 3;
      else if (e.key === "Home") target = 0; else if (e.key === "End") target = 2; else return;
      e.preventDefault(); setChapter(target); chapterTabs.current[target]?.focus();
    }}><span className="chapter-index">0{i + 1}</span><span><small>{i === 2 ? content.anniversaryDate : `CHAPTER 0${i + 1}`}</small><strong>{milestone.label}</strong><span className="chapter-description">{milestone.text}</span></span><span className="chapter-arrow" aria-hidden="true">&#8599;</span></button>)}</div><div className="story-panel" id="story-panel" role="tabpanel" aria-labelledby={`chapter-tab-${chapter}`} tabIndex={0}><div className="story-photo" key={chapter}><MemoryImage memory={content.memories[storyPhotos[chapter]]}/></div><div className="story-caption"><span className="section-kicker">{storyNotes[chapter]}</span><p>{content.milestones[chapter].label}</p><span aria-hidden="true">&#9825;</span></div></div></div></div></section>

    <section className="gallery-section section-shell" id="memories"><Reveal className="section-heading"><div><span className="section-kicker">02 / LITTLE MOMENTS, FOREVER TREASURES</span><h2>Our <em>memory album</em></h2></div><p>Every photo holds a thousand feelings.<br/>Touch a memory. Stay a little longer.</p></Reveal><div className="memory-grid">{content.memories.map((memory, i) => <Reveal className={`memory-card memory-card-${i + 1}`} key={memory.src}><article><div className="memory-photo" onPointerMove={tilt} onPointerLeave={resetTilt}><div className="photo-mat"><MemoryImage memory={memory}/></div><span className="photo-number">0{i + 1}</span><button className="expand-photo" aria-label={`View photo ${i + 1}: ${memory.title}`} onClick={() => setSelected(i)}><span aria-hidden="true">&#8599;</span></button></div><div className="memory-text"><h3>{memory.title}</h3><p>{memory.caption}</p></div></article></Reveal>)}</div><p className="gallery-footnote"><Star/>Four little windows into a lifetime of love.<Star/></p></section>

    <section className="letter-section" id="letter"><div className="section-shell letter-layout"><Reveal className="letter-heading"><span className="section-kicker">03 / WORDS FROM YOUR SON</span><h2>Some feelings<br/>deserve <em>a letter.</em></h2><p className="letter-subheading">A letter to {content.parents}</p><p>Even when I am far away, you are always close to my heart.</p><span className="letter-inscription">WORDS I WISH I COULD SAY IN PERSON</span><Star/></Reveal><details className="letter" onToggle={e => setLetterOpen(e.currentTarget.open)}><summary><span className="envelope-art" aria-hidden="true"><span className="envelope-lining"/><span className="envelope-flap"/><span className="envelope-seal">A</span><span className="envelope-to">For Mama &amp; Papa</span></span><span className="envelope-label"><span className="open-label">A little letter, with all my love</span><span className="close-label">Close my letter</span><span aria-hidden="true">&#8599;</span></span></summary><motion.div className="letter-paper" initial={false} animate={letterOpen && !reduced ? { rotateX: [8, 0], y: [-12, 0] } : undefined} transition={{ duration: .7 }}><div className="letter-paper-heading"><span>{content.anniversaryDate}</span><span aria-hidden="true">&#9825;</span></div><p className="letter-to">To my dearest Mama &amp; Papa</p>{content.letter.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<p className="signature">With all my love,<br/><strong>{content.from}</strong></p><Star/></motion.div></details></div></section>

    <section className="dua-section section-shell"><Reveal><span className="section-kicker">04 / A PRAYER FOR YOU</span><div className="moon" aria-hidden="true">&#9789;</div><h2>My forever <em>dua</em></h2><p>{content.dua}</p><span className="ameen">Ameen &#9825;</span></Reveal></section>

    <section className="surprise-section" id="surprise"><div className="surprise-halo" aria-hidden="true"/><div className="section-shell"><Reveal><span className="section-kicker">05 / ONE LAST LITTLE SURPRISE</span><h2>Before you go&hellip;<br/><em>one more thing.</em></h2><p>I have one more message for you.</p><button className="button button-primary" onClick={() => setSurprise(true)}>Open your surprise <span aria-hidden="true">&#9825;</span></button><div className="sharing"><button className="text-button" onClick={shareGift}>Share this little gift <span aria-hidden="true">&#8599;</span></button><details className="qr-details"><summary>Keep the memories close <span aria-hidden="true">&#10022;</span></summary><div className="qr-content"><img src={qrDataUrl} width={200} height={200} alt="QR code linking to this anniversary website"/><div><h3>A little love, one scan away.</h3><p>Scan to revisit these memories, or add this QR to a card.</p><a download="mama-papa-anniversary-qr.png" href={qrDataUrl} className="text-button">Download QR code &#8595;</a><label htmlFor="gift-link">Website address</label><input id="gift-link" readOnly value={siteUrl} onFocus={e => e.currentTarget.select()}/></div></div></details><p className="share-status" role="status" aria-live="polite">{shareStatus}</p></div></Reveal></div></section>
    <footer><Star/><p>Forever grateful to be your son.</p><strong>{content.from}</strong><span>Made with &#9829; &middot; {content.anniversaryDate}</span><a href="#home">Back to the beginning &#8593;</a></footer>

    {selected !== null && <Modal label="Memory photo viewer" className="photo-viewer" onClose={() => setSelected(null)} onPrevious={previous} onNext={next}><div className="viewer-top"><span>DREAMY MEMORIES</span><a href={content.memories[selected].src} target="_blank" rel="noreferrer">View original &#8599;</a></div><div className="lightbox-image" key={selected}><MemoryImage memory={content.memories[selected]} priority sizes="95vw"/></div><div className="lightbox-bottom"><button className="round-button" onClick={previous} aria-label="Previous photo">&#8592;</button><div aria-live="polite"><span className="section-kicker">{selected + 1} / {content.memories.length}</span><h3>{content.memories[selected].title}</h3><p>{content.memories[selected].caption}</p></div><button className="round-button" onClick={next} aria-label="Next photo">&#8594;</button></div><div className="viewer-dots">{content.memories.map((m, i) => <button key={m.src} aria-label={`Go to photo ${i + 1}`} aria-pressed={i === selected} onClick={() => setSelected(i)}/>)}</div><p className="keyboard-note">Swipe or use arrow keys to browse &middot; Esc to close</p></Modal>}
    {surprise && <Modal label="Anniversary surprise" className="surprise-dialog" onClose={() => setSurprise(false)}><div className="celebration" aria-hidden="true">{particles.map((p, i) => <i key={i} style={{ "--i": i, left: p.left, animationDelay: `${i * -.16}s` } as CSSProperties}/>)}</div><div className="surprise-message"><span className="surprise-heart" aria-hidden="true">&#9825;</span><p className="section-kicker">FROM YOUR SON, WITH ALL MY LOVE</p><h2>I love you,<br/><em>Mama &amp; Papa!</em></h2><p>No distance can ever change how much you mean to me. May Allah keep you both happy, healthy, and together. Ameen.</p><button className="button button-primary" onClick={() => setSurprise(false)}>Keep these memories close &#9825;</button></div></Modal>}
  </main></MotionConfig>;
}
