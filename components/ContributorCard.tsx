import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
  isNew?: boolean;
}

const REPO_OWNER = "Tanay2920003";

export function ContributorCard({ contributor }: { contributor: Contributor }) {
  const isOwner = contributor.login === REPO_OWNER;
  
  return (
    <Card className="group bg-card/50 border-border hover:border-slate-500 transition-all duration-300 overflow-hidden relative">
      <CardContent className="p-6 flex flex-col items-center text-center">
        
        <div className="absolute top-4 right-4">
          {isOwner ? (
             <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0">Owner</Badge>
          ) : contributor.isNew ? (
             <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0">New 🚀</Badge>
          ) : null}
        </div>

        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-slate-800 group-hover:border-slate-600 transition-colors">
          <Image 
            src={contributor.avatar_url} 
            alt={contributor.login} 
            width={96} 
            height={96} 
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors truncate w-full">
          {contributor.login}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          {contributor.contributions} {contributor.contributions === 1 ? 'Commit' : 'Commits'}
        </p>

        <Link href={contributor.html_url} target="_blank" className="mt-auto w-full">
          <Button variant="secondary" className="w-full bg-slate-900 cursor-pointer hover:bg-slate-800 text-slate-300">
            <Github className="mr-2 h-4 w-4" /> View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
