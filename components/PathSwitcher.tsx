"use client";

import Image from "next/image";
import Link from "next/link";
import { createElement, type ElementType } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { LearningPathSummary } from "@/lib/learning-paths";

function renderIcon(icon: unknown, className?: string) {
  if (typeof icon === "string" && icon.startsWith("http")) {
    return <Image src={icon} alt="" width={16} height={16} className={className} unoptimized />;
  }

  if (typeof icon === "string") {
    return <span className={className}>{icon}</span>;
  }

  if (typeof icon === "function") {
    return createElement(icon as ElementType, { className });
  }

  return <span className={className}>📁</span>;
}

export function PathSwitcher({ currentSlug, paths }: { currentSlug: string; paths: LearningPathSummary[] }) {
  const currentPath = paths.find((path) => path.slug === currentSlug) || paths[0];

  if (!currentPath) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-9 max-w-[12rem] bg-zinc-900/50 px-2.5 text-xs text-slate-300 cursor-pointer transition-colors hover:bg-zinc-800 hover:text-white sm:h-10 sm:max-w-none sm:px-3 sm:text-sm border-zinc-800"
        >
          {renderIcon(currentPath.icon, `mr-2 h-4 w-4 ${currentPath.color}`)}
          <span className="truncate">{currentPath.title}</span>
          <ChevronsUpDown className="ml-2 h-3 w-3 opacity-50 sm:h-3.5 sm:w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-zinc-800 text-slate-200">
        <DropdownMenuLabel className="text-xs text-slate-500 font-normal">Switch Roadmap</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        
        {paths.map((path) => (
          <Link key={path.slug} href={`/${path.slug}`}>
            <DropdownMenuItem 
              className={`cursor-pointer focus:bg-zinc-800 focus:text-white ${currentSlug === path.slug ? 'bg-zinc-800/50' : ''}`}
            >
              {renderIcon(path.icon, `mr-2 h-4 w-4 ${path.color}`)}
              <span>{path.title}</span>
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
