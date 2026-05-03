import React from 'react';

export const HomeIconCustom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3.5 L20.5 9.5 L17.5 20.5 H6.5 L3.5 9.5 Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export const ReadQuranIconCustom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="5" y="5" width="6" height="6" rx="2" />
    <rect x="13" y="5" width="6" height="6" rx="2" />
    <rect x="5" y="13" width="6" height="6" rx="2" />
    <rect x="13" y="13" width="6" height="6" rx="2" />
  </svg>
);

export const NavigationIconCustom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 3L10 14" />
    <path d="M21 3L14.5 21a.55.55 0 0 1-1 0L10 14L3 9.5a.55.55 0 0 1 0-1L21 3Z" />
  </svg>
);

export const BookmarkIconCustom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v13l-7-4-7 4V8z" />
    <line x1="5" y1="9" x2="19" y2="9" />
  </svg>
);

export const MoreIconCustom = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="5" y="5" width="6" height="6" rx="2" />
    <rect x="13" y="5" width="6" height="6" rx="2" />
    <rect x="5" y="13" width="6" height="6" rx="2" />
    <rect x="13" y="13" width="6" height="2" rx="1" />
    <rect x="13" y="17" width="6" height="2" rx="1" />
  </svg>
);
