"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Github, Users, Menu, X, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden text-slate-300 hover:text-white sm:size-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>

          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md bg-blue-600 sm:h-9 sm:w-9">
              <Image src="/logo.svg" alt="Learning Hub logo" width={36} height={36} className="h-8 w-8 object-contain sm:h-9 sm:w-9" priority />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-100 sm:text-lg">Learning Hub</span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex lg:gap-3">
          {isDev && (
            <Link href="/edit-data">
              <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-slate-300 cursor-pointer hover:text-white hover:bg-slate-800 lg:h-9 lg:px-3 lg:text-sm">
                <PencilLine className="mr-1.5 h-3.5 w-3.5 lg:mr-2 lg:h-4 lg:w-4" />
                Edit Data
              </Button>
            </Link>
          )}
          <Link href="/contributors">
            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-slate-300 cursor-pointer hover:text-white hover:bg-slate-800 lg:h-9 lg:px-3 lg:text-sm">
              <Users className="mr-1.5 h-3.5 w-3.5 lg:mr-2 lg:h-4 lg:w-4" />
              Contributors
            </Button>
          </Link>
          <Link href="https://github.com/Tanay2920003/Learning-hub" target="_blank">
            <Button variant="outline" size="sm" className="h-8 px-2.5 border-slate-700 bg-slate-900 text-xs cursor-pointer text-slate-200 hover:bg-slate-800 hover:text-white lg:h-9 lg:px-3 lg:text-sm">
              <Github className="mr-1.5 h-3.5 w-3.5 lg:mr-2 lg:h-4 lg:w-4" />
              Open Source
            </Button>
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-14 flex w-full flex-col gap-3 border-t border-border bg-background/95 px-4 py-4 shadow-2xl backdrop-blur-xl md:hidden sm:top-16">
          {isDev && (
            <Link href="/edit-data" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="h-11 w-full justify-start px-3 text-sm cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800">
                <PencilLine className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                Edit Data
              </Button>
            </Link>
          )}
          <Link href="/contributors" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="h-11 w-full justify-start px-3 text-sm cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800">
              <Users className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Contributors
            </Button>
          </Link>
          <Link href="https://github.com/Tanay2920003/Learning-hub" target="_blank" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="h-11 w-full justify-start border-slate-700 bg-slate-900 px-3 text-sm cursor-pointer text-slate-200 hover:bg-slate-800 hover:text-white">
              <Github className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              Open Source
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
