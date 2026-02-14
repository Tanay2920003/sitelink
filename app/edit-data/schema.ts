import { z } from 'zod';

export const PlaylistSchema = z.object({
     title: z.string().min(1, "Title is required"),
     creator: z.string().min(1, "Creator is required"),
     url: z.string().url("Invalid URL"),
     language: z.string().min(1, "Language is required"),
     difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
     videoCount: z.number().int().min(0),
     description: z.string(),
     year: z.number().int().min(2000).max(new Date().getFullYear() + 1)
});

export const CategorySchema = z.object({
     name: z.string().min(1, "Name is required"),
     slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be kebab-case"),
     description: z.string(),
     icon: z.string(),
     playlists: z.array(PlaylistSchema)
});

export type Category = z.infer<typeof CategorySchema>;
export type Playlist = z.infer<typeof PlaylistSchema>;

export function validateCategory(data: unknown) {
     return CategorySchema.safeParse(data);
}
