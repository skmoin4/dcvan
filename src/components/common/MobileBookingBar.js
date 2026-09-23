'use client';

import React, { useEffect, useState } from 'react';
import { PhoneIcon, WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline';
import EnquiryForm from './EnquiryForm';

const MobileBookingBar = ({ phoneNumbers }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const openSheet = () => setOpen(true);
    window.addEventListener('open-mobile-booking', openSheet);
    if (window.location.hash === '#enquiry') {
      setOpen(true);
    }
    return () => window.removeEventListener('open-mobile-booking', openSheet);
  }, []);

  return (
    <div className="lg:hidden">
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur">
        <a
          href={phoneNumbers[0].href}
          aria-label={`Call ${phoneNumbers[0].display}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-white transition hover:bg-navy-800"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-flame-500 px-4 py-3 text-center font-black text-white shadow-glow"
        >
          <WrenchScrewdriverIcon className="h-5 w-5" />
          Book Cleaning Service
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close booking form"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3">
            <div className="animate-fade-up flex w-full max-w-md max-h-[85vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex shrink-0 items-center justify-between px-5 py-4 text-white bg-flame-500">
                <span className="flex items-center gap-2 text-base font-black">
                  <WrenchScrewdriverIcon className="h-5 w-5" />
                  Book Cleaning Service
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <PhoneIcon className="h-4 w-4 text-flame-500" /> Prefer to call?
                </span>
                {phoneNumbers.map((phone, index) => (
                  <React.Fragment key={phone.href}>
                    {index > 0 && <span className="text-slate-300">|</span>}
                    <a href={phone.href} className="text-flame-600">{phone.display}</a>
                  </React.Fragment>
                ))}
              </div>

              <div className="overflow-y-auto px-5 pb-6 pt-5">
                <EnquiryForm compact />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileBookingBar;
