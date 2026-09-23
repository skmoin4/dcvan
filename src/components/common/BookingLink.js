'use client';

import React from 'react';
import Link from 'next/link';

const MOBILE_QUERY = '(max-width: 1023px)';

const BookingLink = ({ href = '#enquiry', className, children }) => {
  const handleClick = (event) => {
    if (typeof window === 'undefined' || !window.matchMedia(MOBILE_QUERY).matches) return;
    if (window.location.pathname !== '/') return;

    event.preventDefault();
    window.dispatchEvent(new Event('open-mobile-booking'));
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default BookingLink;
