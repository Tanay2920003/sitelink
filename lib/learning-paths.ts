import { promises as fs } from "fs";
import path from "path";

interface CategoryFileData {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface LearningPathSummary {
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

const DATA_DIR = path.join(process.cwd(), "data");

const LEGACY_ORDER = [
  "webdev",
  "coding-languages",
  "dsa",
  "ml",
  "dbms",
  "os",
  "system-design",
  "roadmaps",
  "tools",
  "community-sites-and-projects",
  "game-development",
];

const GROUPED_LANGUAGE_SLUGS = new Set(["c", "java", "python"]);

const COLOR_SEQUENCE = [
  "text-blue-400",
  "text-emerald-400",
  "text-purple-400",
  "text-orange-400",
  "text-rose-400",
  "text-cyan-400",
  "text-green-400",
  "text-amber-400",
  "text-pink-400",
];

function comparePaths(a: CategoryFileData, b: CategoryFileData) {
  const aIndex = LEGACY_ORDER.indexOf(a.slug);
  const bIndex = LEGACY_ORDER.indexOf(b.slug);

  if (aIndex !== -1 || bIndex !== -1) {
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  }

  return a.name.localeCompare(b.name);
}

export async function getLearningPaths(): Promise<LearningPathSummary[]> {
  try {
    const files = await fs.readdir(DATA_DIR);
    const categories = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          try {
            const filePath = path.join(DATA_DIR, file);
            const fileContents = await fs.readFile(filePath, "utf8");
            const data = JSON.parse(fileContents) as CategoryFileData;

            if (!data?.slug || !data?.name || !data?.description || !data?.icon) {
              return null;
            }

            if (GROUPED_LANGUAGE_SLUGS.has(data.slug)) {
              return null;
            }

            return data;
          } catch (error) {
            console.error(`Failed to load learning path from ${file}`, error);
            return null;
          }
        }),
    );

    return categories
      .filter((category): category is CategoryFileData => category !== null)
      .sort(comparePaths)
      .map((category, index) => ({
        title: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: COLOR_SEQUENCE[index % COLOR_SEQUENCE.length],
      }));
  } catch (error) {
    console.error("Failed to load learning paths", error);
    return [];
  }
}
