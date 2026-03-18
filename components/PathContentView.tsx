"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Eye, ExternalLink, Monitor, Search, Sparkles, Video, X } from "lucide-react";
import { TimelineView } from "./TimelineView";
import { ArticleGridView } from "./ArticleGridView";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Playlist {
  title: string;
  creator: string;
  url: string;
  language: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  videoCount: number;
  description: string;
  year: number;
}

interface Article {
  title: string;
  url: string;
}

interface PathContentProps {
  playlists: Playlist[];
  articles: Article[];
  categorySlug?: string;
}

function CommunityProjectGrid({
  articles,
  previewEnabled,
}: {
  articles: Article[];
  previewEnabled: boolean;
}) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <>
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
        {articles.map((article, index) => (
          <motion.div
            key={article.url}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group block overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/45 transition-all hover:border-slate-600 hover:bg-slate-900/70"
          >
            <div className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  <Monitor className="h-3.5 w-3.5" />
                  Community Project
                </div>
                <h3 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-white">
                  {article.title}
                </h3>
                <p className="mt-2 break-all text-sm text-slate-500">{article.url}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-slate-300" />
            </div>

            {previewEnabled ? (
              <div className="hidden border-t border-slate-800/70 bg-slate-950/70 p-3 lg:block">
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-white shadow-2xl shadow-black/20">
                  <iframe
                    src={article.url}
                    title={`${article.title} preview`}
                    loading="lazy"
                    className="h-56 w-full"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-800/70 px-5 py-4 text-sm text-slate-500">
                Desktop preview is off. Enable it above if you want an embedded project view.
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-slate-800/70 bg-slate-950/60 p-4 sm:flex-row">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-400"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </a>

              {previewEnabled && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedArticle(article)}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Open Preview
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {previewEnabled && selectedArticle && (
        <div className="fixed inset-0 z-40 hidden items-center justify-center bg-black/55 px-6 backdrop-blur-sm lg:flex">
          <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
              <div>
                <p className="text-sm font-medium text-slate-100">{selectedArticle.title}</p>
                <p className="text-xs text-slate-500">Desktop preview</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedArticle(null)}
                  className="size-9 rounded-full text-slate-400 hover:bg-slate-900 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-white">
              <iframe
                src={selectedArticle.url}
                title={`${selectedArticle.title} enlarged preview`}
                loading="lazy"
                className="h-[70vh] w-full"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PathContentView({ playlists, articles, categorySlug }: PathContentProps) {
  const isCommunityProjects = categorySlug === "community-sites-and-projects";
  const [activeTab, setActiveTab] = useState<"playlists" | "articles">(
    isCommunityProjects ? "articles" : "playlists",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [projectPreviewEnabled, setProjectPreviewEnabled] = useState(false);
  const [showDesktopPrompt, setShowDesktopPrompt] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!isCommunityProjects) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateDesktopState = () => {
      const desktop = mediaQuery.matches;
      setIsDesktop(desktop);
      setShowDesktopPrompt(desktop);
    };

    updateDesktopState();
    mediaQuery.addEventListener("change", updateDesktopState);

    return () => {
      mediaQuery.removeEventListener("change", updateDesktopState);
    };
  }, [isCommunityProjects]);

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {isCommunityProjects && isDesktop && showDesktopPrompt && !projectPreviewEnabled && (
        <div className="fixed inset-0 z-30 hidden items-center justify-center bg-black/45 px-6 backdrop-blur-sm lg:flex">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-100">Try desktop previews</p>
                  <p className="text-sm text-slate-500">This category supports embedded project previews on desktop.</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowDesktopPrompt(false)}
                className="size-9 rounded-full text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-300">
                Enable preview mode to see embedded site previews in the cards, then click the preview button to open a larger desktop overlay.
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => {
                  setProjectPreviewEnabled(true);
                  setShowDesktopPrompt(false);
                }}
                className="flex-1 rounded-full bg-slate-100 text-slate-900 hover:bg-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                Try Preview
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDesktopPrompt(false)}
                className="flex-1 rounded-full border-slate-800 bg-transparent text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center mb-12 md:mb-16 gap-6 md:gap-8 w-full">
        
        {articles.length > 0 && (
          <div className="inline-flex bg-zinc-900/50 p-1 rounded-full border border-zinc-800 backdrop-blur-sm relative">
            <motion.div
              className="absolute inset-y-1 bg-zinc-800 rounded-full shadow-sm"
              layoutId="tab-highlight"
              initial={false}
              animate={{
                left: activeTab === "playlists" ? "4px" : "50%",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            <button
              onClick={() => setActiveTab("playlists")}
              className={`relative z-10 flex items-center justify-center px-6 py-2.5 text-sm font-medium cursor-pointer rounded-full transition-colors w-36 sm:w-40 ${
                activeTab === "playlists" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              Playlists
            </button>

            <button
              onClick={() => setActiveTab("articles")}
              className={`relative z-10 flex items-center justify-center px-6 py-2.5 text-sm font-medium cursor-pointer rounded-full transition-colors w-36 sm:w-40 ${
                activeTab === "articles" ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Articles
            </button>
          </div>
        )}

        <div className="relative w-full max-w-md px-4 sm:px-0">
          <Search className="absolute left-7 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder={activeTab === "playlists" ? "Search courses or creators..." : "Search articles..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-zinc-900/50 border-zinc-800 text-slate-200 placeholder:text-slate-500 h-12 rounded-full focus-visible:ring-zinc-700 focus-visible:border-zinc-700 transition-all w-full"
          />
        </div>

        {isCommunityProjects && activeTab === "articles" && (
          <div className="flex w-full max-w-3xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-0">
            <div className="text-center sm:text-left">
              <p className="text-sm font-medium text-slate-200">Desktop project previews</p>
              <p className="text-xs text-slate-500">
                Off by default. Enable to embed previews on large screens and open the larger preview on click.
              </p>
            </div>
            <Button
              type="button"
              variant={projectPreviewEnabled ? "secondary" : "outline"}
              onClick={() => setProjectPreviewEnabled((value) => !value)}
              className="rounded-full border-slate-800 bg-zinc-900/50 text-slate-200 hover:bg-zinc-800"
            >
              <Eye className="mr-2 h-4 w-4" />
              {projectPreviewEnabled ? "Disable Preview" : "Enable Preview"}
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "playlists" ? (
          <motion.div
            key="playlists"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredPlaylists.length > 0 ? (
              <TimelineView playlists={filteredPlaylists} />
            ) : (
              <div className="text-center py-20 text-slate-500">
                No playlists found for &quot;{searchQuery}&quot;
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredArticles.length > 0 ? (
              isCommunityProjects ? (
                <CommunityProjectGrid articles={filteredArticles} previewEnabled={projectPreviewEnabled} />
              ) : (
                <ArticleGridView articles={filteredArticles} />
              )
            ) : (
              <div className="text-center py-20 text-slate-500">
                No articles found for &quot;{searchQuery}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
