import Link from "next/link";
import Image from "next/image";
import { createElement, type ElementType } from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PathCardProps {
  title: string;
  description: string;
  slug: string;
  icon: unknown;
  color: string;
}

function renderIcon(icon: unknown, color: string) {
  if (typeof icon === "string" && icon.startsWith("http")) {
    return <Image src={icon} alt="" width={32} height={32} className="h-7 w-7 object-contain sm:h-8 sm:w-8" unoptimized />;
  }

  if (typeof icon === "string") {
    return <span className="text-[1.65rem] leading-none sm:text-[1.9rem]">{icon}</span>;
  }

  if (typeof icon === "function") {
    return createElement(icon as ElementType, { className: `h-5 w-5 sm:h-6 sm:w-6 ${color}` });
  }

  return <span className="text-[1.65rem] leading-none sm:text-[1.9rem]">📁</span>;
}

export function PathCard({ title, description, slug, icon, color }: PathCardProps) {
  return (
    <Link href={`/${slug}`}>
      <Card className="group relative overflow-hidden bg-card/50 border-border hover:border-slate-500 transition-all duration-300 cursor-pointer h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="relative z-10 pb-4">
          <div className={`mb-4 flex w-fit items-center justify-center rounded-lg border border-slate-800 bg-slate-900 p-2.5 sm:rounded-xl sm:p-3 ${color}`}>
            {renderIcon(icon, color)}
          </div>
          <CardTitle className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-white sm:text-xl">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 mt-auto flex items-center text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-300 sm:text-[0.95rem]">
          Start Journey 
          <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:h-[1.05rem] sm:w-[1.05rem]" />
        </CardContent>
      </Card>
    </Link>
  );
}
