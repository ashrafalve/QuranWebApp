import { fetchJuzById } from '@/utils/api';
import { JuzWithAyahs } from '@/types';
import { notFound } from 'next/navigation';
import AyahCard from '@/components/AyahCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JuzPage({ params }: PageProps) {
  const { id } = await params;
  const juzId = parseInt(id);

  if (juzId < 1 || juzId > 30) {
    notFound();
  }

  const juz: JuzWithAyahs = await fetchJuzById(juzId);

  return (
    <div className="w-full bg-background transition-colors duration-300">
      {/* Juz Header */}
      <div className="relative w-full text-center py-20 px-6 bg-background overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-bold text-foreground tracking-tight drop-shadow-sm">Juz {juz.id}</h1>
          <div className="flex items-center justify-center gap-6 text-muted font-bold text-sm uppercase tracking-[0.3em]">
            <span>Ayahs {juz.startAyah} - {juz.endAyah}</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span>{juz.surahCount} Surahs</span>
          </div>
          <p className="text-base text-muted/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            <span className="text-primary/60 font-bold uppercase text-[10px] tracking-widest block mb-1">Included Surahs</span>
            {juz.uniqueSurahs.map(s => s.englishName).join(', ')}
          </p>
        </div>
        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-primary/5 via-transparent to-primary/5 opacity-50" />
      </div>

      {/* Ayahs */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 pb-32">
        <div className="divide-y divide-border">
          {juz.ayahs.map((ayah) => (
            <AyahCard
              key={ayah.number}
              ayah={ayah}
              totalAyahs={juz.endAyah} // Use end ayah as reference for navigation logic
            />
          ))}
        </div>
      </div>
    </div>
  );
}
