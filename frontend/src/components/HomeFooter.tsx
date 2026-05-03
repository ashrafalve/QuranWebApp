'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomeFooter() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20 flex items-center justify-center overflow-hidden w-10 h-10">
                <Image
                  src="/quranlogo.png"
                  alt="Quran Mazid Logo"
                  width={24}
                  height={24}
                  className="object-contain grayscale brightness-0 invert"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">QURAN MAZID</h3>
                <p className="text-[9px] text-muted font-bold uppercase tracking-widest">Read, Study, Learn</p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              A beautiful, modern platform to read, study, and listen to the Holy Quran with translations and audio recitation.
            </p>
            <p className="text-[10px] text-muted/70">© 2026 Quran Mazid</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-muted hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/surah" className="text-sm text-muted hover:text-primary transition-colors">
                  Read Quran
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
            © 2026 Quran Mazid — Read, Study, and Learn The Quran
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert('Coming Soon')}
              className="text-xs text-muted hover:text-primary transition-colors font-bold"
            >
              Support Us
            </button>
            <span className="text-muted/30">|</span>
            <button
              onClick={() => alert('Coming Soon')}
              className="text-xs text-muted hover:text-primary transition-colors font-bold"
            >
              Feedback
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
