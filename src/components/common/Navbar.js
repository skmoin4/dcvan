import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { phoneNumbers } from '../../config/contact';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = user?.role === 'driver' ? [
    { label: 'My Jobs', to: '/driver' },
  ] : user ? [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Enquiries', to: '/admin/enquiries' },
    { label: 'Tasks', to: '/admin/tasks' },
    { label: 'Fleet', to: '/admin/fleet' },
    ...(user.role === 'admin' ? [{ label: 'Users', to: '/admin/users' }] : []),
  ] : [];

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-200/80 bg-white/90 shadow-soft backdrop-blur-lg' : 'border-b border-transparent bg-white/70 backdrop-blur-sm'}`}>
      {!user && (
        <div className="bg-navy-950">
          <div className="section flex items-center justify-center gap-x-4 gap-y-1 py-2 sm:justify-between">
            <span className="hidden items-center gap-1.5 text-xs font-semibold text-blue-100/60 sm:flex">
              <PhoneIcon className="h-3.5 w-3.5 text-flame-400" /> Call us for quick booking
            </span>
            <div className="flex items-center gap-3 sm:gap-4">
              {phoneNumbers.map((phone, index) => (
                <React.Fragment key={phone.href}>
                  {index > 0 && <span className="text-white/15">|</span>}
                  <a
                    href={phone.href}
                    className="flex items-center gap-1.5 text-sm font-extrabold text-white transition hover:text-flame-400 sm:text-base"
                  >
                    <PhoneIcon className="h-4 w-4 text-flame-400" />
                    {phone.display}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="section flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            className="h-11 w-auto md:h-14"
            src="/brand-assets/logo.png"
            alt="Swaraj Infra Services"
            width={112}
            height={112}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                pathname === link.to ? 'bg-flame-50 text-flame-600' : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {user && (
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm font-semibold text-slate-500">{user.name} <span className="text-slate-300">&middot;</span> <span className="capitalize text-navy-700">{user.role}</span></span>
            <button onClick={handleLogout} className="btn-outline btn-sm">
              <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
            </button>
          </div>
        )}

        {!user && (
          <Link href="/#enquiry" className="btn-primary btn-sm">
            Book Now
          </Link>
        )}

        {links.length > 0 && (
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-navy-900 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        )}
      </div>

      {menuOpen && user && (
        <div className="animate-fade-in border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`rounded-lg px-3 py-2.5 text-sm font-bold ${pathname === link.to ? 'bg-flame-50 text-flame-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="px-3 text-sm font-semibold text-slate-500">{user.name} &middot; <span className="capitalize text-navy-700">{user.role}</span></p>
            <button onClick={handleLogout} className="btn-outline mt-2 w-full">
              <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
