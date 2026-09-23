import React from 'react';
import {
  ArrowRightIcon,
  BeakerIcon,
  BoltIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import EnquiryForm from '../components/common/EnquiryForm';
import HeroVideo from '../components/common/HeroVideo';

const videoIds = ['IMG_8518', 'IMG_8519', 'IMG_8520', 'IMG_8521', 'IMG_8522', 'IMG_8523', 'IMG_8525', 'IMG_8526'];
const videos = videoIds.map((id) => `/brand-assets/optimized/${id}.mp4`);
const videoPosters = videoIds.map((id) => `/brand-assets/optimized/${id}.jpg`);

const services = [
  {
    title: 'Drainage Line Cleaning',
    text: 'Blocked chambers, overflowing lines, odor issues, and emergency drain cleaning handled with trained field teams.',
    icon: WrenchScrewdriverIcon,
  },
  {
    title: 'Septic Tank Cleaning',
    text: 'Safe septic tank emptying and sludge removal for homes, bungalows, apartments, societies, and commercial buildings.',
    icon: TruckIcon,
  },
  {
    title: 'Industrial Cleaning',
    text: 'Suction, desilting, wastewater handling, and scheduled maintenance for factories, warehouses, and plants.',
    icon: BuildingOffice2Icon,
  },
  {
    title: 'High Pressure Jetting',
    text: 'Powerful jetting support for stubborn grease, mud, and waste buildup inside drainage and sewer lines.',
    icon: BoltIcon,
  },
];

const highlights = [
  ['24/7', 'Emergency response'],
  ['Fast', 'Callback and dispatch'],
  ['Clean', 'Professional equipment'],
  ['Tracked', 'Job status updates'],
];

const process = [
  ['Share the issue', 'Send location, service need, and preferred visit time.'],
  ['Team confirms', 'Operations verifies details and gives an estimated service plan.'],
  ['Vehicle dispatched', 'The right suction van, driver, and field team are assigned.'],
  ['Work completed', 'Cleaning is completed with status notes and customer follow-up.'],
];

const trustPoints = [
  'Residential, commercial, and industrial site support',
  'Modern suction vans and trained cleaning operators',
  'Transparent booking flow with quick customer callback',
  'Suitable for routine maintenance and urgent overflow calls',
];

const phoneNumbers = [
  { display: '98237 03702', href: 'tel:+919823703702' },
  { display: '96577 03702', href: 'tel:+919657703702' },
];

const VideoTile = ({ src, poster, index }) => (
  <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
    <div className="relative">
      <video
        className="aspect-[4/3] w-full bg-navy-950 object-cover"
        src={src}
        poster={poster}
        playsInline
        muted
        controls
        preload="none"
      />
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
        <PlayIcon className="h-3 w-3" /> Field video
      </span>
    </div>
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm font-black text-navy-900">Site work {String(index + 1).padStart(2, '0')}</span>
      <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-bold text-flame-600">Tap to play</span>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <HeroVideo src={videos[0]} poster={videoPosters[0]} />
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:36px_36px] opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/30" />
        <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 animate-float rounded-full bg-navy-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[28rem] w-[28rem] rounded-full bg-flame-500/20 blur-3xl" />

        <div className="section relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_430px] lg:py-12">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow text-flame-400">
              <ShieldCheckIcon className="h-4 w-4" /> Trusted drainage &amp; industrial cleaning partner
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.08] sm:text-6xl">
              Reliable suction van cleaning for <span className="text-flame-400">urgent</span> and scheduled site work.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50/85">
              Book expert drainage cleaning, septic tank emptying, sewer line support, and industrial cleaning with a team that coordinates quickly and works neatly on site.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#enquiry" className="btn-primary">
                Book Service <ArrowRightIcon className="h-4 w-4" />
              </a>
              {phoneNumbers.map((phone) => (
                <a key={phone.href} href={phone.href} className="btn-ghost-light">
                  <PhoneIcon className="h-4 w-4" /> {phone.display}
                </a>
              ))}
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {highlights.map(([value, label]) => (
                <div key={label} className="glass-card p-4">
                  <strong className="block text-2xl font-black text-white">{value}</strong>
                  <span className="mt-1 block text-xs font-semibold text-blue-50/80">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div id="enquiry" className="hidden lg:block">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Quick trust strip */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="section grid gap-4 md:grid-cols-3">
          {[
            [ClockIcon, 'Quick site response', 'Emergency overflow and blockage calls handled with fast callback.'],
            [TruckIcon, 'Suction van service', 'Right vehicle assignment for septic tanks, chambers, and sewer lines.'],
            [CheckBadgeIcon, 'Professional completion', 'Clear communication from enquiry to finished cleaning work.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy-900 text-white">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-black text-navy-900">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16 sm:py-20">
        <div className="section">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow">Our services</p>
            <h2 className="mt-2 text-3xl font-black text-navy-900 sm:text-4xl">
              Complete cleaning support for drainage, septic, and industrial wastewater needs.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="card-hover group relative overflow-hidden">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-flame-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-navy-900 text-white transition-colors duration-300 group-hover:bg-flame-500">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="relative mt-5 text-xl font-black text-navy-900">{service.title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-slate-600">{service.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video showcase */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="section grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow">Work in action</p>
            <h2 className="mt-2 text-3xl font-black text-navy-900 sm:text-4xl">Real site videos from client-provided field work.</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Visitors can see the vans, equipment, and on-ground service quality without forcing every large video to autoplay.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-flame-500 text-white">
                    <CheckBadgeIcon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold leading-6 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200 bg-white text-center shadow-soft">
              {['Drainage', 'Septic', 'Industrial'].map((item) => (
                <div key={item} className="border-r border-slate-200 px-3 py-4 last:border-r-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-flame-600">{item}</p>
                  <p className="mt-1 text-sm font-bold text-navy-900">Service ready</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <VideoTile src={videos[1]} poster={videoPosters[1]} index={1} />
            {videos.slice(2, 5).map((src, index) => (
              <VideoTile key={src} src={src} poster={videoPosters[index + 2]} index={index + 2} />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-50" />
        <div className="section relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow text-flame-400">Why choose us</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">A field-ready cleaning partner for homes, societies, and businesses.</h2>
            <p className="mt-4 max-w-2xl leading-8 text-blue-50/80">
              From blocked drainage to industrial sludge cleaning, the service flow is built around quick communication, proper equipment, and dependable site execution.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [MapPinIcon, 'Location based dispatch'],
                [BeakerIcon, 'Hygienic waste handling'],
                [SparklesIcon, 'Clean finish on site'],
                [ShieldCheckIcon, 'Safer site coordination'],
              ].map(([Icon, item]) => (
                <div key={item} className="glass-card p-4 transition hover:bg-white/15">
                  <Icon className="h-7 w-7 text-flame-400" />
                  <p className="mt-3 font-black">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 glass-card p-5">
              <p className="text-sm font-bold leading-7 text-blue-50/90">
                Best for emergency overflow, septic tank emptying, chamber cleaning, sludge removal, and routine maintenance contracts.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
            <video
              className="aspect-[4/3] max-h-[460px] w-full bg-navy-950 object-cover"
              src={videos[5]}
              poster={videoPosters[5]}
              controls
              muted
              playsInline
              preload="none"
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-16 sm:py-20">
        <div className="section">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow">Simple process</p>
            <h2 className="mt-2 text-3xl font-black text-navy-900 sm:text-4xl">From enquiry to completion, every step stays organized.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {process.map(([title, text], index) => (
              <div key={title} className="card relative">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-flame-500 text-sm font-black text-white shadow-glow">{index + 1}</span>
                <h3 className="mt-4 font-black text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                {index < process.length - 1 && (
                  <span className="absolute right-[-14px] top-9 hidden text-slate-300 md:block">
                    <ArrowRightIcon className="h-5 w-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More videos */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="section">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">More field work</p>
              <h2 className="mt-2 text-3xl font-black text-navy-900">Equipment, vans, and cleaning activity on site.</h2>
            </div>
            <a href="#enquiry" className="btn-secondary w-fit">
              Enquire now <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.slice(6).map((src, index) => (
              <VideoTile key={src} src={src} poster={videoPosters[index + 6]} index={index + 6} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden bg-flame-500 py-14 text-white">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[size:28px_28px] opacity-20" />
        <div className="section relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black">Need urgent drainage or septic tank cleaning?</h2>
            <p className="mt-2 text-orange-50/90">Send an enquiry now and our team will call back for service confirmation.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#enquiry" className="rounded-xl bg-white px-6 py-3 font-black text-navy-900 shadow-lift transition hover:-translate-y-0.5 hover:bg-orange-50">Book Now</a>
            {phoneNumbers.map((phone) => (
              <a key={phone.href} href={phone.href} className="btn-ghost-light">Call {phone.display}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden">
        <details>
          <summary className="cursor-pointer list-none rounded-xl bg-flame-500 px-4 py-3 text-center font-black text-white shadow-glow">Book Cleaning Service</summary>
          <div className="mt-3 max-h-[70vh] overflow-y-auto">
            <EnquiryForm compact />
          </div>
        </details>
      </div>
    </div>
  );
};

export default Home;
