
import fs from 'fs';
import path from 'path';
import TutorialsView from './TutorialsView';

interface Playlist {
    title: string;
    creator: string;
    url: string;
    language: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    videoCount: number;
    description: string;
    year: number;
}

interface TopicData {
    name: string;
    slug: string;
    description: string;
    icon: string;
    playlists: Playlist[];
}

function getTutorialData(): TopicData[] {
    const dataDirectory = path.join(process.cwd(), 'data');
    const filenames = fs.readdirSync(dataDirectory);

    const allData = filenames
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const filePath = path.join(dataDirectory, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(fileContents) as TopicData;
        });

    return allData.sort((a, b) => a.name.localeCompare(b.name));
}

export default function YoutubeTutorials() {
    const topics = getTutorialData();
    return <TutorialsView topics={topics} />;
}
