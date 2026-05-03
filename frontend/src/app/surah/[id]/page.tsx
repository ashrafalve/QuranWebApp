import { fetchSurahById } from '@/utils/api';
import AyahCard from '@/components/AyahCard';
import { SurahWithAyahs } from '@/types';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id);
  const surah: SurahWithAyahs = await fetchSurahById(surahId);

  return (
    <div className="w-full bg-background transition-colors duration-300">
      {/* Surah Header - Attached to Top, Full Width */}
      <div className="relative w-full text-center py-16 px-6 bg-background overflow-hidden group">
        {/* Watermark Illustration */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-1000 ease-out">
          <Image 
            src="/makkahiconimage.png" 
            alt="Makkah" 
            width={200} 
            height={200} 
            priority 
            className="object-contain w-auto h-auto"
          />
        </div>

        <div className="relative z-10 space-y-3">
          <h1 className="text-3xl font-bold text-foreground tracking-tight drop-shadow-sm">Surah {surah.englishName}</h1>
          <div className="flex items-center justify-center gap-4 text-muted font-bold text-xs uppercase tracking-[0.3em]">
            <span>{surah.revelationType}</span>
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span>{surah.numberOfAyahs} Ayahs</span>
          </div>
        </div>

        {/* Subtle Decorative Gradient */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      {/* Reader Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-32">
        {/* Bismillah (Except Surah 1 and 9) */}
        {surahId !== 1 && surahId !== 9 && (
          <div className="text-center py-20 border-b border-border">
            <p className="font-amiri text-6xl text-foreground drop-shadow-lg">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
          </div>
        )}

        {/* Ayah List */}
        <div className="divide-y divide-border">
          {surah.ayahs.map((ayah) => (
            <AyahCard 
              key={ayah.number} 
              ayah={ayah} 
              totalAyahs={surah.numberOfAyahs} 
            />
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="py-24 flex justify-between items-center px-4 md:px-10 border-t border-border bg-background mt-20">
          {surahId > 1 ? (
            <a href={`/surah/${surahId - 1}`} className="group flex flex-col items-start gap-2">
              <span className="text-[11px] uppercase font-bold text-muted tracking-widest group-hover:text-primary transition-colors">Previous Surah</span>
              <span className="text-lg font-bold text-foreground group-hover:-translate-x-1 transition-transform inline-flex items-center gap-2">
                ← {surahId - 1}
              </span>
            </a>
          ) : <div />}
          
          <div className="text-center">
            <p className="font-amiri text-4xl text-primary">{surah.arabicName}</p>
            <p className="text-[10px] text-muted font-bold uppercase mt-2 tracking-[0.2em]">{surah.englishName}</p>
          </div>

          {surahId < 114 ? (
            <a href={`/surah/${surahId + 1}`} className="group flex flex-col items-end gap-2 text-right">
              <span className="text-[11px] uppercase font-bold text-muted tracking-widest group-hover:text-primary transition-colors">Next Surah</span>
              <span className="text-lg font-bold text-foreground group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                {surahId + 1} →
              </span>
            </a>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
