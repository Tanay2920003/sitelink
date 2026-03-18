import { HomePageClient } from "@/components/HomePageClient";
import { getLearningPaths } from "@/lib/learning-paths";

export default async function HomePage() {
  const learningPaths = await getLearningPaths();

  return <HomePageClient learningPaths={learningPaths} />;
}
