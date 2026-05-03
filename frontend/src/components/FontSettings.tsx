'use client';

import { BookOpen, Type, ChevronRight, Settings, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';

export default function FontSettings() {
  const { settings, setSettings, readingMode, setReadingMode, isFontSettingsOpen, setFontSettingsOpen } = useAppStore();

  return (
    <>
      {/* Mobile Overlay */}
      {isFontSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] xl:hidden animate-in fade-in duration-300"
          onClick={() => setFontSettingsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed inset-y-0 right-0 xl:static z-[100] w-[320px] h-full bg-background border-l border-border flex flex-col transition-all duration-300 transform",
        isFontSettingsOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0",
        "flex" // Always flex, but the translate-x handles visibility
      )}>
        {/* Header - Mobile Only */}
        <div className="p-6 flex items-center justify-between xl:hidden">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-xl">
               <Settings className="w-5 h-5 text-white" />
             </div>
             <h2 className="font-bold text-lg text-foreground">Settings</h2>
          </div>
          
          <button 
            onClick={() => setFontSettingsOpen(false)}
            className="p-2 hover:bg-card rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
      {/* Tabs */}
      <div className="p-6">
        <div className="bg-card rounded-2xl p-1 flex">
          <button 
            onClick={() => setReadingMode(false)}
            className={cn("flex-1 py-2 text-xs font-bold rounded-xl transition-all", !readingMode ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted hover:text-foreground")}
          >
            Translation
          </button>
          <button 
            onClick={() => setReadingMode(true)}
            className={cn("flex-1 py-2 text-xs font-bold rounded-xl transition-all", readingMode ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted hover:text-foreground")}
          >
            Reading
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-10 custom-scrollbar">
        {!readingMode ? (
          <>
        {/* Font Settings Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between text-primary">
            <div className="flex items-center gap-3">
              <Type className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Font Settings</h3>
            </div>
          </div>

          {/* Arabic Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted">Arabic Font Size</span>
              <span className="text-primary">{settings.arabicFontSize}</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="60" 
              value={settings.arabicFontSize}
              onChange={(e) => setSettings({ arabicFontSize: parseInt(e.target.value) })}
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Translation Font Size */}
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted">Translation Font Size</span>
              <span className="text-primary">{settings.translationFontSize}</span>
            </div>
            <input 
              type="range" 
              min="12" 
              max="30" 
              value={settings.translationFontSize}
              onChange={(e) => setSettings({ translationFontSize: parseInt(e.target.value) })}
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Arabic Font Face */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted">Arabic Font Face</label>
            <button className="w-full bg-card border border-border rounded-xl py-3 px-4 flex items-center justify-between group hover:border-primary transition-all">
              <span className="text-sm font-semibold text-muted group-hover:text-foreground">Amiri</span>
              <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-card rounded-[24px] p-6 space-y-4 border border-border">
          <h4 className="font-bold text-sm text-foreground">Help spread the knowledge</h4>
          <p className="text-[11px] text-muted leading-relaxed font-medium">Your support helps us reach more people with the message of Islam.</p>
          <button className="w-full bg-primary hover:opacity-90 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 transition-all">
            Support Us
          </button>
        </div>
        </>
        ) : (
          <div className="space-y-4">
            <button className="w-full bg-background border border-border rounded-xl py-3 px-4 flex items-center justify-between group hover:border-primary transition-all">
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-muted group-hover:text-foreground" />
                <span className="text-sm font-semibold text-muted group-hover:text-foreground">Change Mushaf</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  </>
);
}
