"use client";
import { useEffect, useRef, useState } from "react";
import manifest from "../photo-manifest.json";
import { content } from "../content";
type Memory = (typeof content.memories)[number];

export default function MemoryImage({ memory, priority = false, sizes = "(max-width: 560px) 88vw, (max-width: 1000px) 44vw, 28vw" }: { memory: Memory; priority?: boolean; sizes?: string }) {
  const image = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  const [originalOnly, setOriginalOnly] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const asset = manifest[memory.src as keyof typeof manifest];
  function handleError() {
    if (!originalOnly) setOriginalOnly(true);
    else setFailed(true);
  }
  useEffect(() => {
    const img = image.current;
    if (img?.complete && img.naturalWidth === 0) {
      if (!originalOnly) setOriginalOnly(true);
      else setFailed(true);
    }
  }, [originalOnly, attempt]);
  return <div className="image-surface">{failed ? <div className="image-error" role="status"><span aria-hidden="true">&#9825;</span><p>This photograph is taking a little longer.</p><button onClick={() => { setFailed(false); setOriginalOnly(true); setAttempt(a => a + 1); }}>Try again</button><a href={memory.src}>Open original photograph</a></div> : <img key={`${originalOnly}-${attempt}`} ref={image} src={attempt ? `${memory.src}?retry=${attempt}` : memory.src} srcSet={originalOnly ? undefined : asset?.srcSet} sizes={sizes} alt={memory.alt} width={asset?.width ?? 720} height={asset?.height ?? 960} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" onError={handleError} />}</div>;
}
