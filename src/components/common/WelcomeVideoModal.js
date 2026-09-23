'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SpeakerWaveIcon, XMarkIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

const SESSION_KEY = 'welcome-video-dismissed';

const WelcomeVideoModal = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (pathname !== '/') return;
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    setIsOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') window.sessionStorage.setItem(SESSION_KEY, '1');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/85 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-video-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="relative w-full max-w-4xl animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-navy-900 shadow-2xl shadow-black/50">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-black/60 text-white shadow-lg transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close welcome video"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="border-b border-white/10 bg-gradient-to-r from-navy-900 to-navy-800 px-5 py-5 pr-16 sm:px-7">
          <p className="eyebrow text-flame-400">
            <PlayCircleIcon className="h-4 w-4" /> See how we work
          </p>
          <h2 id="welcome-video-title" className="mt-1.5 text-xl font-black text-white sm:text-2xl">
            From your call to a clean, completed job
          </h2>
        </div>

        <div className="bg-black">
          <video
            className="max-h-[65vh] w-full object-contain"
            src="/customer-service-story.mp4"
            poster="/customer-service-story.jpg"
            autoPlay
            muted
            controls
            playsInline
            preload="auto"
          >
            Your browser does not support video playback.
          </video>
        </div>

        <div className="flex flex-col items-start gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="inline-flex items-center gap-2 text-sm text-blue-100/80">
            <SpeakerWaveIcon className="h-5 w-5 shrink-0 text-flame-400" />
            Video starts muted. Use the player controls for sound.
          </span>
          <button type="button" onClick={close} className="btn-primary btn-sm w-full sm:w-auto">
            Continue to website
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeVideoModal;
