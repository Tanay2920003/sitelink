"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BookOpen,
  CornerDownLeft,
  FileText,
  FolderKanban,
  Home,
  Keyboard,
  PlayCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GlobalSearchItem, SearchItemType } from "@/lib/search";

declare global {
  interface WindowEventMap {
    "global-search:open": CustomEvent<{ query?: string }>;
  }
}

const ICONS: Record<SearchItemType, typeof Home> = {
  page: Home,
  category: FolderKanban,
  article: FileText,
  playlist: PlayCircle,
};

function matchesQuery(item: GlobalSearchItem, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [item.title, item.description, item.group].some((value) =>
    value.toLowerCase().includes(normalized),
  );
}

export function GlobalSearch({ items }: { items: GlobalSearchItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const hideFloatingTrigger = pathname === "/" || pathname === "/edit-data" || pathname === "/contributors"

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }

      if (event.key === "/" && !open) {
        const target = event.target as HTMLElement | null;
        const typing =
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target?.isContentEditable;

        if (!typing) {
          event.preventDefault();
          setOpen(true);
        }
      }

      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const onOpen = (event: WindowEventMap["global-search:open"]) => {
      setOpen(true);
      setQuery(event.detail?.query ?? "");
    };

    window.addEventListener("global-search:open", onOpen);
    return () => window.removeEventListener("global-search:open", onOpen);
  }, []);

  const suggestions = useMemo(() => {
    const matched = items.filter((item) => matchesQuery(item, query));

    if (!query.trim()) {
      return matched.slice(0, 8);
    }

    return matched.slice(0, 10);
  }, [items, query]);

  const topSuggestion = suggestions[0];

  const openItem = (item: GlobalSearchItem) => {
    closeSearch();

    if (item.isExternal) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(item.href);
  };

  return (
    <>
    {!hideFloatingTrigger && (
      <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-11 rounded-full border-slate-700 bg-slate-950/90 px-3 text-sm text-slate-200 shadow-xl shadow-black/20 backdrop-blur-md hover:bg-slate-900 hover:text-white sm:h-12 sm:px-4"
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">Find</span>
          <span className="ml-3 hidden rounded-md border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-400 md:inline">
            Ctrl K
          </span>
        </Button>
      </div>
    )}

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/65 px-4 py-6 backdrop-blur-sm sm:py-12"
          onClick={closeSearch}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-4 sm:px-5">
              <Search className="h-5 w-5 text-slate-500" />
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search categories, articles, playlists, and pages..."
                className="h-11 border-0 bg-transparent px-0 text-sm text-slate-100 shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-slate-400 hover:bg-slate-900 hover:text-white"
                onClick={closeSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 px-4 py-3 text-xs text-slate-500 sm:px-5">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-1">
                <Sparkles className="h-3 w-3" />
                Smart suggestions
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-1">
                <Keyboard className="h-3 w-3" />
                Esc to close
              </span>
              {topSuggestion && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-slate-400">
                  <CornerDownLeft className="h-3 w-3" />
                  Top match: <span className="text-slate-300">{topSuggestion.title}</span>
                </span>
              )}
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-3 sm:p-4">
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  <div className="px-1 pb-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {query.trim() ? `Results for "${query.trim()}"` : "Popular shortcuts"}
                  </div>
                  {suggestions.map((item) => {
                    const Icon = ICONS[item.type];

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openItem(item)}
                        className="flex w-full items-start gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/50 px-3 py-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900"
                      >
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-300">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-slate-100">{item.title}</p>
                            {item.isExternal && <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-500" />}
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                              <Sparkles className="h-3 w-3" />
                              {item.group}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center text-slate-500">
                  <BookOpen className="mb-4 h-10 w-10 text-slate-700" />
                  <p className="text-base text-slate-300">Nothing matched that search</p>
                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    Try a broader keyword like a topic, article title, playlist name, or page.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
