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
    icon: [
      { url: "/quranlogo.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon", rel: "shortcut icon" }
    ],
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
            <div suppressHydrationWarning={true} className="flex h-screen overflow-hidden">
              <ConditionalLayout>
                <div suppressHydrationWarning={true} className="flex flex-col flex-1 min-w-0 relative">
                  <Header />
                  <main suppressHydrationWarning={true} className="flex-1 overflow-hidden flex">
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
