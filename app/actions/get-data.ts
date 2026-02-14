'use server';

import fs from 'fs';
import path from 'path';

export interface Playlist {
     title: string;
     creator: string;
     url: string;
     language: string;
     difficulty: 'beginner' | 'intermediate' | 'advanced';
     videoCount: number;
     description: string;
     year: number;
}

export interface TopicData {
     name: string;
     slug: string;
     description: string;
     icon: string;
     playlists: Playlist[];
}

export async function getAllCategories(): Promise<TopicData[]> {
     try {
          const dataDirectory = path.join(process.cwd(), 'data');
          // Ensure directory exists
          if (!fs.existsSync(dataDirectory)) {
               return [];
          }

          const filenames = fs.readdirSync(dataDirectory);
          const allData = filenames
               .filter(file => file.endsWith('.json'))
               .map(file => {
                    try {
                         const filePath = path.join(dataDirectory, file);
                         const fileContents = fs.readFileSync(filePath, 'utf8');
                         return JSON.parse(fileContents) as TopicData;
                    } catch (e) {
                         console.error(`Error parsing ${file}`, e);
                         return null;
                    }
               })
               .filter((data): data is TopicData => data !== null);

          return allData.sort((a, b) => a.name.localeCompare(b.name));
     } catch (error) {
          console.error('Error fetching categories:', error);
          return [];
     }
}
