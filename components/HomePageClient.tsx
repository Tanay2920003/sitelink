"use client";

import { Search, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PathCard } from "@/components/PathCard";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import type { LearningPathSummary } from "@/lib/learning-paths";

export function HomePageClient({ learningPaths }: { learningPaths: LearningPathSummary[] }) {
  const openGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent("global-search:open"));
  };

  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      <Navbar />

      <main className="container mx-auto px-4 pt-16 md:pt-24 pb-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 mt-10">
          <div className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Premium Resources Directory
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.15] sm:leading-[1.1] [overflow-anchor:none]">
            <span className="block min-h-[1.2em]">
              <TypewriterEffect
                words={["Learn", "Build", "Explore"]}
                typingSpeed={150}
                erasingSpeed={80}
                pauseDuration={3000}
                className="text-slate-200"
              />
            </span>
            <span className="text-slate-200">in One </span> <span className="text-green-500">Open Hub</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-light px-2">
            Discover roadmaps, tools, learning resources, and community-built projects in one open-source place designed to help you keep growing.
          </p>

          <button
            type="button"
            onClick={openGlobalSearch}
            className="group relative flex w-full max-w-xl items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/55 px-4 py-3.5 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/85 focus:outline-none focus-visible:border-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-700/60"
          >
            <Search className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-slate-300" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-slate-200 sm:text-base">Search for various paths...</div>
              <div className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                Categories, articles, playlists, and quick suggestions
              </div>
            </div>
            <span className="hidden items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 md:inline-flex">
              <Sparkles className="h-3 w-3" />
              Suggestions
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {learningPaths.map((path) => (
            <PathCard key={path.slug} {...path} />
          ))}
        </div>
      </main>
    </div>
  );
}
