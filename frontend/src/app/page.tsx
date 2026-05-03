import { fetchSurahs } from '@/utils/api';
import { Surah } from '@/types';
import Link from 'next/link';
import { Search, BookOpen, Clock, Heart, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import HomeFooter from '@/components/HomeFooter';

export default async function Home() {
  const surahs: Surah[] = await fetchSurahs();

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-12 scroll-smooth transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-card rounded-3xl md:rounded-[40px] border border-border flex flex-col items-center text-center space-y-6 md:space-y-8 py-10 md:py-16 px-4 md:px-6">
          {/* Background Watermark */}
          <div className="absolute left-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
              <Image 
               src="/makkahiconimage.png" 
               alt="Makkah Light" 
               fill 
               sizes="(max-width: 768px) 100vw, 33vw"
               className="object-contain p-12 -translate-x-1/4 w-auto h-auto dark:hidden" 
               priority
             />
              <Image 
               src="/makkahicon2.png" 
               alt="Makkah Dark" 
               fill 
               sizes="(max-width: 768px) 100vw, 33vw"
               className="object-contain p-12 -translate-x-1/4 w-auto h-auto hidden dark:block" 
               priority
             />
          </div>
          
               <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="bg-primary p-4 rounded-3xl shadow-2xl shadow-primary/20 mb-4 flex items-center justify-center overflow-hidden w-20 h-20">
                     <Image 
                       src="/quranlogo.png" 
                       alt="Quran Logo" 
                       width={64} 
                       height={64} 
                       className="object-contain grayscale brightness-0 dark:invert"
                       priority
                     />
                  </div>
              <h1 className="font-amiri text-4xl md:text-6xl font-bold text-foreground tracking-tight drop-shadow-2xl">
                QURAN <span className="text-primary">MAZID</span>
              </h1>
              <p className="text-base md:text-lg text-muted font-medium tracking-wide max-w-lg">
                Read, Study, and Learn The Quran
              </p>
           </div>

           {/* Large Pill Search Bar */}
           <form action="/search" method="get" className="relative w-full max-w-3xl group">
             <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
             <div className="relative flex items-center bg-background border border-border group-focus-within:border-primary/50 rounded-full py-4 px-6 shadow-2xl transition-all">
               <Search className="w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 name="q"
                 placeholder="Search surah, ayah, or keyword..." 
                 className="w-full bg-transparent border-none focus:ring-0 text-base text-foreground placeholder-muted pl-4 outline-none"
               />
             </div>
           </form>
        </div>

        {/* Surah Grid Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-2 rounded-lg text-primary">
                 <LayoutGrid className="w-5 h-5" />
               </div>
               <h2 className="text-2xl font-bold text-foreground">All Surahs</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {surahs.map((surah) => (
              <Link 
                key={surah.id} 
                href={`/surah/${surah.id}`}
                className="group relative bg-card border border-border hover:border-primary/50 rounded-2xl p-5 transition-all hover:shadow-2xl hover:shadow-primary/5 flex items-center gap-5 overflow-hidden"
              >
                <div className="relative z-10 w-11 h-11 min-w-[44px] flex items-center justify-center bg-background group-hover:bg-primary text-muted group-hover:text-white rounded-xl rotate-45 transition-all duration-500 shadow-lg border border-border/50">
                  <span className="-rotate-45 font-bold text-xs">{surah.id}</span>
                </div>

                <div className="relative z-10 flex-1 min-w-0">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {surah.englishName}
                  </h3>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider mt-1 truncate">
                    {surah.englishNameTranslation}
                  </p>
                </div>

                <div className="relative z-10 text-right">
                  <p className="font-amiri text-xl font-bold text-foreground leading-none">{surah.arabicName.split(' ')[1] || surah.arabicName}</p>
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
              </Link>
            ))}
          </div>
        </div>

        <HomeFooter />
      </div>
    </div>
  );
}
