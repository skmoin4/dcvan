import React from 'react';
import Image from 'next/image';
import { PhoneIcon, EnvelopeIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';

const services = ['Septic tank cleaning', 'Drainage blockage removal', 'Industrial cleaning', 'Sewage suction van service', 'High pressure jetting'];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-blue-100">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-40" />
      <div className="section relative grid gap-10 py-14 md:grid-cols-[1.3fr_0.8fr_1fr]">
        <div>
          <Image
            className="h-14 w-auto rounded-lg bg-white px-2 py-1.5"
            src="/brand-assets/logo.png"
            alt="Swaraj Infra Services"
            width={112}
            height={112}
            loading="lazy"
          />
          <p className="mt-5 max-w-md text-sm leading-7 text-blue-100/70">
            Professional drainage cleaning, septic tank cleaning, suction van, and industrial cleaning service for homes, societies, shops, and worksites.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="tel:+919823703702" className="btn-ghost-light btn-sm">
              <PhoneIcon className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-blue-100/70">
            {services.map((service) => (
              <li key={service} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-flame-500" />
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a className="flex items-center gap-3 text-blue-100/80 transition hover:text-white" href="tel:+919823703702">
                <PhoneIcon className="h-4 w-4 shrink-0 text-flame-400" /> 98237 03702
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 text-blue-100/80 transition hover:text-white" href="tel:+919657703702">
                <PhoneIcon className="h-4 w-4 shrink-0 text-flame-400" /> 96577 03702
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 text-blue-100/80 transition hover:text-white" href="mailto:operations@sewagecleanpro.com">
                <EnvelopeIcon className="h-4 w-4 shrink-0 text-flame-400" /> operations@sewagecleanpro.com
              </a>
            </li>
            <li className="flex items-center gap-3 text-blue-100/80">
              <ClockIcon className="h-4 w-4 shrink-0 text-flame-400" /> Service hours: 24/7
            </li>
            <li className="flex items-center gap-3 text-blue-100/80">
              <MapPinIcon className="h-4 w-4 shrink-0 text-flame-400" /> On-site service across the region
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="section flex flex-col gap-3 py-5 text-center text-sm text-blue-100/60 md:flex-row md:items-center md:justify-between md:text-left">
          <p>&copy; 2026 Swaraj Infra Services. All Rights Reserved.</p>
          <p>
            Developed by{' '}
            <a
              href="https://magnusideas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-flame-300 hover:text-white"
            >
              Magnus Ideas Pvt. Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
