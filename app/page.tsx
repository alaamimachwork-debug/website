 "use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const seasonFrames = [
  { text: "7", phase: "scan-in", duration: 320 },
  { text: "27", phase: "scan-in", duration: 320 },
  { text: "/27", phase: "scan-in", duration: 320 },
  { text: "6/27", phase: "scan-in", duration: 320 },
  { text: "26/27", phase: "scan-in", duration: 320 },
  { text: "W26/27", phase: "scan-in", duration: 320 },
  { text: "FW26/27", phase: "scan-in", duration: 1000 },
  { text: "FW26/27", phase: "scan-out", duration: 320 },
  { text: "FW26/2", phase: "scan-out", duration: 320 },
  { text: "FW26/", phase: "scan-out", duration: 320 },
  { text: "FW26", phase: "scan-out", duration: 320 },
  { text: "FW2", phase: "scan-out", duration: 320 },
  { text: "FW", phase: "scan-out", duration: 320 },
  { text: "F", phase: "scan-out", duration: 320 },
  { text: "", phase: "scan-out", duration: 1000 }
] as const;

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [seasonFrameIndex, setSeasonFrameIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const seasonFrameIndexRef = useRef(0);
  const seasonElapsedRef = useRef(0);

  useEffect(() => {
    seasonFrameIndexRef.current = seasonFrameIndex;
  }, [seasonFrameIndex]);

  useEffect(() => {
    let animationFrameId = 0;
    let previousTimestamp = 0;

    const tick = (timestamp: number) => {
      if (previousTimestamp === 0) {
        previousTimestamp = timestamp;
      }

      const delta = timestamp - previousTimestamp;
      previousTimestamp = timestamp;
      seasonElapsedRef.current += delta;

      const activeIndex = seasonFrameIndexRef.current;
      const activeDuration = seasonFrames[activeIndex].duration;

      if (seasonElapsedRef.current >= activeDuration) {
        seasonElapsedRef.current -= activeDuration;
        const nextIndex = (activeIndex + 1) % seasonFrames.length;
        seasonFrameIndexRef.current = nextIndex;
        setSeasonFrameIndex(nextIndex);
      }

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    const tryPlay = () => {
      void audioElement.play().catch(() => {
        // Browsers may block autoplay until the first user interaction.
      });
    };

    window.addEventListener("pointerdown", tryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsRevealed(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <main className={`page-shell${isRevealed ? " is-revealed" : ""}`}>
      <audio ref={audioRef} src="/Ambient 2.mp3" loop preload="auto" />
      <div className="page-overlay" aria-hidden="true" />
      <header className="top-header">
        <button
          type="button"
          className="menu-button"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <Image
          src="/Maison D'Aprile23.png"
          alt="Maison D'Aprile"
          width={3840}
          height={2160}
          priority
          className="brand-image"
        />
      </header>
      <div
        className={`menu-backdrop${isMenuOpen ? " is-open" : ""}`}
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside className={`menu-drawer${isMenuOpen ? " is-open" : ""}`} aria-hidden={!isMenuOpen}>
        <button
          type="button"
          className="menu-close"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        >
          <span />
          <span />
        </button>
        <div className="menu-copy">
          <p>An avant-garde design house by Adam Laamimach</p>
        </div>
        <p className="menu-copy menu-copy-bottom">Based in Amsterdam</p>
      </aside>
      <div className="hero-group">
        <Image
          src="/abstract-rectangle-sticker-10.png"
          alt=""
          width={1024}
          height={319}
          priority
          className="hero-image"
        />
      </div>
      <p className="hero-caption">COMING SOON</p>
      <div className="season-badge" aria-label="Fall Winter 2026 2027">
        <span
          className={`season-text season-text-top ${seasonFrames[seasonFrameIndex].phase}`}
        >
          {seasonFrames[seasonFrameIndex].text}
        </span>
        <span className="season-text season-text-bottom">FW26/27</span>
      </div>
    </main>
  );
}
