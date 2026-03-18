"use client";

import Image from "next/image";
import Link from "next/link";

interface NavigationLink {
  name: string;
  url: string;
  icon: string;
}

interface SidebarCategory {
  name: string;
  icon: string;
  slug: string;
}

interface SidebarProps {
  navigationLinks: NavigationLink[];
  categories: SidebarCategory[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  currentPage: string;
  onAction?: () => void;
}

function renderIcon(icon: string) {
  if (icon.startsWith("http")) {
    return <Image src={icon} alt="" width={18} height={18} unoptimized />;
  }

  return <span className="text-base leading-none">{icon}</span>;
}

export default function Sidebar({
  navigationLinks,
  categories,
  isSidebarOpen,
  setIsSidebarOpen,
  currentPage,
  onAction,
}: SidebarProps) {
  const baseClasses =
    "z-[1000] border-r border-white/10 bg-black/40 backdrop-blur-xl text-slate-200";
  const mobileState = isSidebarOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={[
        baseClasses,
        "fixed inset-y-0 left-0 w-72 overflow-y-auto px-4 py-6 transition-transform duration-300 md:static md:block md:w-72 md:translate-x-0",
        mobileState,
      ].join(" ")}
      aria-hidden={!isSidebarOpen && undefined}
    >
      <div className="mb-8 flex items-center justify-between md:justify-start">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white"
          onClick={() => {
            setIsSidebarOpen(false);
            onAction?.();
          }}
        >
          Learning Hub
        </Link>
        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-1 text-sm text-slate-300 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          Close
        </button>
      </div>

      <div className="space-y-8">
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Navigation
          </p>
          <nav className="space-y-1">
            {navigationLinks.map((link) => {
              const isActive = link.name === currentPage;
              const isExternal = link.url.startsWith("http");

              return (
                <Link
                  key={link.name}
                  href={link.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    onAction?.();
                  }}
                >
                  {renderIcon(link.icon)}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Topics
          </p>
          <nav className="space-y-1">
            {categories.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => {
                  setIsSidebarOpen(false);
                  onAction?.();
                }}
              >
                {renderIcon(category.icon)}
                <span>{category.name}</span>
              </a>
            ))}
          </nav>
        </section>
      </div>
    </aside>
  );
}
