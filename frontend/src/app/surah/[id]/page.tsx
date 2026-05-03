import { fetchSurahById } from '@/utils/api';
import SurahReader from '@/components/SurahReader';
import { SurahWithAyahs } from '@/types';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id);

  let surah: SurahWithAyahs | null = null;
  let error: string | null = null;

  try {
    surah = await fetchSurahById(surahId);
  } catch (err) {
    console.error('Failed to fetch surah:', err);
    error = 'Failed to load surah. Please try again later.';
  }

  if (error || !surah) {
    return (
      <div className="flex-1 overflow-y-auto bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-muted">{error || 'Surah not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background transition-colors duration-300">
      {/* Surah Header - Attached to Top, Full Width */}
      <div className="relative w-full text-center py-16 px-6 bg-background overflow-hidden group">
        {/* Watermark Illustration */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none group-hover:scale-105 transition-transform duration-1000 ease-out">
          {/* Light/Sepia Mode Icon */}
          <Image
            src="/makkahiconimage.png"
            alt="Makkah Light"
            width={200}
            height={200}
            priority
            className="object-contain w-auto h-auto dark:hidden"
          />
          {/* Dark Mode Icon */}
          <Image
            src="/makkahicon2.png"
            alt="Makkah Dark"
            width={200}
            height={200}
            priority
            className="object-contain w-auto h-auto hidden dark:block"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[120px]">
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight drop-shadow-sm">
              Surah {surah.englishName.replace(/-/g, ' ')}
            </h1>
            <p className="text-muted text-xs md:text-sm font-medium">
              Ayah - {surah.numberOfAyahs}, {surah.revelationType === 'Meccan' ? 'Makkah' : 'Madinah'}
            </p>
          </div>

          {/* Bismillah in the corner */}
          {surahId !== 1 && surahId !== 9 && (
            <div className="absolute top-0 right-0 opacity-30 hover:opacity-100 transition-opacity duration-500 hidden md:block pr-8 pt-4">
              <p className="font-amiri text-2xl text-foreground whitespace-nowrap">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}
        </div>

        {/* Subtle Decorative Gradient */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      {/* Reader Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-32">
        <SurahReader surah={surah} surahId={surahId} />

        {/* Navigation Footer */}
        <div className="py-24 flex justify-between items-center px-4 md:px-10 border-t border-border bg-background mt-20">
          {surahId > 1 ? (
            <a href={`/surah/${surahId - 1}`} className="group flex flex-col items-start gap-2">
              <span className="text-[11px] uppercase font-bold text-muted tracking-widest group-hover:text-primary transition-colors">
                Previous Surah
              </span>
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
              <span className="text-[11px] uppercase font-bold text-muted tracking-widest group-hover:text-primary transition-colors">
                Next Surah
              </span>
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