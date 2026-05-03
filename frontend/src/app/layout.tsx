import type { Metadata } from "next";
import { Inter, Amiri, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { AudioProvider } from "@/contexts/AudioContext";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const amiri = Amiri({ 
  subsets: ["arabic"], 
  weight: ["400", "700"], 
  variable: "--font-amiri" 
});
const scheherazade = Scheherazade_New({ 
  subsets: ["arabic"], 
  weight: ["400", "700"], 
  variable: "--font-scheherazade" 
});

export const metadata: Metadata = {
  title: "Quran Mazid - Read, Study, Learn",
  description: "Read, study, and learn the Quran with Arabic text, translations, and audio recitation.",
  icons: {
    icon: "/quranlogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={`${inter.variable} ${amiri.variable} ${scheherazade.variable} font-sans antialiased bg-background text-foreground transition-colors duration-300`}>
        <Providers>
          <AudioProvider>
            <div className="flex h-screen overflow-hidden">
              <ConditionalLayout>
                <div className="flex flex-col flex-1 min-w-0 relative">
                  <Header />
                  <main className="flex-1 overflow-hidden flex">
                    {children}
                  </main>
                  <AudioPlayer />
                </div>
              </ConditionalLayout>
            </div>
          </AudioProvider>
        </Providers>
      </body>
    </html>
  );
}
