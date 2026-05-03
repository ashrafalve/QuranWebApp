import SurahSidebar from "@/components/SurahSidebar";
import FontSettings from "@/components/FontSettings";

export default function SurahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SurahSidebar />
      <div className="flex-1 overflow-y-auto bg-background scroll-smooth">
        {children}
      </div>
      <FontSettings />
    </>
  );
}
