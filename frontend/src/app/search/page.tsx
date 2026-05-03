'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAyahs } from '@/utils/api';
import { PaginatedSearchResult } from '@/types';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<PaginatedSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const doSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchAyahs(query);
        setResults(data);
      } catch (err) {
        setError('Search failed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [query]);

  return (
    <div className="flex-1 overflow-y-auto bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-bold">Back to Home</span>
        </Link>

        <div className="mb-10">
          <h1 className="font-amiri text-4xl md:text-5xl font-bold text-foreground mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-muted text-lg">
              {loading ? 'Searching...' : results ? `${results.total} results for "${query}"` : `No results for "${query}"`}
            </p>
          )}
        </div>

        {/* Results */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl p-6 space-y-4">
                <div className="h-4 bg-border rounded w-1/4" />
                <div className="h-3 bg-border rounded w-full" />
                <div className="h-3 bg-border rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-destructive font-bold">{error}</p>
          </div>
        )}

        {!loading && results && results.results.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-xl font-bold text-foreground mb-2">No matches found</p>
            <p className="text-muted">Try different keywords or check spelling</p>
          </div>
        )}

        {!loading && results && results.results.length > 0 && (
          <div className="space-y-6">
            {results.results.map((result, idx) => (
              <Link
                key={`${result.ayah.number}-${idx}`}
                href={`/surah/${result.ayah.surahId}#ayah-${result.ayah.numberInSurah}`}
                className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {result.ayah.surahId}:{result.ayah.numberInSurah}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-amiri text-2xl text-foreground leading-loose text-right mb-4">
                      {result.ayah.text}
                    </p>
                    <p className="text-muted/80 leading-relaxed">
                      {result.ayah.translation}
                    </p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-3">
                      {result.matchType === 'arabic' ? 'Arabic match' : 'Translation match'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && results && results.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <p className="text-muted text-sm">
              Page {results.page} of {results.totalPages}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 overflow-y-auto bg-background p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-border rounded w-1/4" />
            <div className="h-12 bg-border rounded w-3/4" />
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}