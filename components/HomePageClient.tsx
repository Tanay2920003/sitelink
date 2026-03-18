"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { PathCard } from "@/components/PathCard";
import { Input } from "@/components/ui/input";
import type { LearningPathSummary } from "@/lib/learning-paths";

export function HomePageClient({ learningPaths }: { learningPaths: LearningPathSummary[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLearningPaths = learningPaths.filter((path) =>
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    path.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background selection:bg-blue-500/30">
      <Navbar />

      <main className="container mx-auto px-4 pt-16 md:pt-24 pb-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 mt-10">
          <div className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Premium Resources Directory
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[1.15] sm:leading-[1.1]">
            Master Your Craft with <br className="hidden sm:block" />
            <span className="text-slate-200">Curated Roadmaps.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-light px-2">
            Choose your path, follow our guided sequences, and build real-world projects. High-quality learning resources, completely open-source.
          </p>

          <div className="relative w-full max-w-md px-4 sm:px-0">
            <Search className="absolute left-7 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search for various paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 bg-zinc-900/50 border-zinc-800 text-slate-200 placeholder:text-slate-500 h-12 rounded-full focus-visible:ring-zinc-700 focus-visible:border-zinc-700 transition-all w-full"
            />
          </div>
        </div>

        {filteredLearningPaths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredLearningPaths.map((path) => (
              <PathCard key={path.slug} {...path} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Search className="h-10 w-10 text-slate-700 mb-4" />
            <p className="text-lg">No path found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </main>
    </div>
  );
}
