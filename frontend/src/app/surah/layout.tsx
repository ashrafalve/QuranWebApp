import FontSettings from "@/components/FontSettings";

export default function SurahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto bg-background scroll-smooth">
        {children}
      </div>
      <FontSettings />
    </>
  );
}
