import { promises as fs } from "fs";
import path from "path";

export type SearchItemType = "page" | "category" | "article" | "playlist";

export interface GlobalSearchItem {
  id: string;
  title: string;
  href: string;
  description: string;
  type: SearchItemType;
  group: string;
  isExternal?: boolean;
}

interface CategoryFileData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  playlists?: Array<{
    title: string;
    creator: string;
    url: string;
    description: string;
  }>;
  articles?: Array<{
    title: string;
    url: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), "data");

const TOP_LEVEL_HIDDEN_SLUGS = new Set(["c", "java", "python", "github"]);

export async function getGlobalSearchItems(): Promise<GlobalSearchItem[]> {
  const basePages: GlobalSearchItem[] = [
    {
      id: "page-home",
      title: "Home",
      href: "/",
      description: "Browse all learning categories and curated paths.",
      type: "page",
      group: "Pages",
    },
    {
      id: "page-contributors",
      title: "Contributors",
      href: "/contributors",
      description: "Meet the open source contributors behind Learning Hub.",
      type: "page",
      group: "Pages",
    },
  ];

  try {
    const files = await fs.readdir(DATA_DIR);
    const loadedCategories = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          try {
            const filePath = path.join(DATA_DIR, file);
            const raw = await fs.readFile(filePath, "utf8");
            return JSON.parse(raw) as CategoryFileData;
          } catch (error) {
            console.error(`Failed to build search item for ${file}`, error);
            return null;
          }
        }),
    );

    const items = loadedCategories.flatMap((category) => {
      if (!category?.slug || !category.name) {
        return [];
      }

      const categoryItems: GlobalSearchItem[] = [];

      if (!TOP_LEVEL_HIDDEN_SLUGS.has(category.slug)) {
        categoryItems.push({
          id: `category-${category.slug}`,
          title: category.name,
          href: `/${category.slug}`,
          description: category.description || `Open the ${category.name} roadmap.`,
          type: "category",
          group: "Categories",
        });
      }

      for (const article of category.articles || []) {
        categoryItems.push({
          id: `article-${category.slug}-${article.title}`,
          title: article.title,
          href: article.url,
          description: `${category.name} article`,
          type: "article",
          group: category.name,
          isExternal: true,
        });
      }

      for (const playlist of category.playlists || []) {
        categoryItems.push({
          id: `playlist-${category.slug}-${playlist.title}`,
          title: playlist.title,
          href: playlist.url,
          description: `${playlist.creator} • ${category.name}`,
          type: "playlist",
          group: category.name,
          isExternal: true,
        });
      }

      return categoryItems;
    });

    return [...basePages, ...items];
  } catch (error) {
    console.error("Failed to build global search items", error);
    return basePages;
  }
}
