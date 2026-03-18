"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Search, ChevronRight, Trophy, Rocket, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ContributorCard } from "@/components/ContributorCard";
import BookLoader from "@/components/BookLoader/BookLoader";
import type { LucideIcon } from "lucide-react";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
  isNew?: boolean;
}

interface ContributorFilterOption {
  id: "all" | "new" | "top" | "owner";
  label: string;
  icon?: LucideIcon;
  color?: string;
}

const REPO_OWNER = "Tanay2920003";
const REPO_NAME = "Learning-hub";
const FILTERS: ContributorFilterOption[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New", icon: Rocket, color: "text-blue-400" },
  { id: "top", label: "Top Contributors", icon: Trophy, color: "text-yellow-400" },
  { id: "owner", label: "Owner", icon: ShieldAlert, color: "text-emerald-400" }
] as const;

type ContributorFilter = (typeof FILTERS)[number]["id"];

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContributorFilter>("all");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contributorsRes, commitsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`),
          fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=100`),
        ]);

        if (!contributorsRes.ok) throw new Error("Failed to fetch");

        const contributorsData = await contributorsRes.json();
        const commitsData = await commitsRes.json();

        const recentAuthors = new Set<string>();
        if (Array.isArray(commitsData)) {
          for (const commit of commitsData) {
            if (commit.author?.login) recentAuthors.add(commit.author.login);
          }
        }

        const processed = contributorsData
          .map((c: Contributor) => ({
            ...c,
            isNew: recentAuthors.has(c.login) && c.contributions <= 5,
          }))
          .sort((a: Contributor, b: Contributor) => b.contributions - a.contributions);

        setContributors(processed);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredContributors = contributors.filter((c) => {
    const matchesSearch = c.login.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "new") return matchesSearch && c.isNew;
    if (activeFilter === "owner") return matchesSearch && c.login === REPO_OWNER;
    if (activeFilter === "top") return matchesSearch && contributors.indexOf(c) < 3;
    
    return matchesSearch;
  });

  const visibleContributors = filteredContributors.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 pt-16 pb-24 max-w-7xl">
        
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-slate-200">Contributors</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Open Source <span className="text-green-500">Contributors</span>
            </h1>
            <p className="text-lg text-slate-400 font-light">
              Meet the amazing people building the best open-source learning resource.
            </p>
          </div>
          
          <Link href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`} target="_blank">
            <Button className="bg-white text-black cursor-pointer hover:bg-slate-200 font-semibold rounded-full px-6">
              <Github className="mr-2 h-4 w-4" />
              Contribute Now
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search by GitHub handle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-500 h-11"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "secondary" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border-slate-800 ${activeFilter === filter.id ? 'bg-slate-800 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-900'}`}
              >
                {filter.icon && <filter.icon className={`mr-2 h-3.5 w-3.5 ${filter.color}`} />}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <BookLoader />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleContributors.map((c) => (
                <ContributorCard key={c.login} contributor={c} />
              ))}
            </div>
            
            {visibleContributors.length < filteredContributors.length && (
              <div className="mt-12 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setVisibleCount(p => p + 12)}
                  className="rounded-full border-slate-700 text-slate-300 hover:text-white"
                >
                  Load More ({filteredContributors.length - visibleContributors.length} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
