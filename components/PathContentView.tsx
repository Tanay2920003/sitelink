"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Video, Search } from "lucide-react";
import { TimelineView } from "./TimelineView";
import { ArticleGridView } from "./ArticleGridView";
import { Input } from "@/components/ui/input";

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
}

export function PathContentView({ playlists, articles }: PathContentProps) {
  const [activeTab, setActiveTab] = useState<"playlists" | "articles">("playlists");
  const [searchQuery, setSearchQuery] = useState("");

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
                No playlists found for "{searchQuery}"
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
              <ArticleGridView articles={filteredArticles} />
            ) : (
              <div className="text-center py-20 text-slate-500">
                No articles found for "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}