'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

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

export default function TutorialsView({ topics }: { topics: TopicData[] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.container}>
            {/* Mobile Hamburger */}
            <button
                className={styles.hamburger}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Sidebar Navigation */}
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.sidebarTitleLink}>
                        <h1>Learning Hub</h1>
                    </Link>
                    <p>YouTube Tutorials</p>
                </div>

                <div className={styles.sidebarContent}>
                    {topics.map((topic) => (
                        <a key={topic.slug} href={`#${topic.slug}`} className={styles.categoryLink}>
                            <span>{topic.icon}</span>
                            <span>{topic.name}</span>
                        </a>
                    ))}
                </div>

                <div className={styles.sidebarFooter}>
                    <p>✨ Curated Content</p>
                    <p>{topics.length} Categories</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2>YouTube Tutorials</h2>
                        <p>Curated video playlists for every developer skill level</p>
                    </div>
                </div>

                <div className={styles.cardsGrid}>
                    {topics.map((topic) => (
                        <section key={topic.slug} id={topic.slug} className={styles.categorySection}>
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryIcon}>{topic.icon}</span>
                                <h2 className={styles.categoryTitle}>{topic.name}</h2>
                                <p className={styles.categoryDescription}>{topic.description}</p>
                            </div>

                            <div className={styles.grid}>
                                {topic.playlists.map((playlist, index) => (
                                    <a
                                        key={`${topic.slug}-${index}`}
                                        href={playlist.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.card}
                                    >
                                        <div className={styles.cardHeader}>
                                            <span className={`${styles.difficultyBadge} ${styles[playlist.difficulty]}`}>
                                                {playlist.difficulty}
                                            </span>
                                            <span className={styles.languageBadge}>
                                                {playlist.language === 'Hindi' ? '🇮🇳 Hindi' : '🇬🇧 English'}
                                            </span>
                                        </div>

                                        <h3 className={styles.cardTitle}>{playlist.title}</h3>
                                        <div className={styles.creator}>
                                            <span>By {playlist.creator}</span>
                                            <span>•</span>
                                            <span>{playlist.year}</span>
                                        </div>

                                        <p className={styles.description}>{playlist.description}</p>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.stats}>
                                                <span className={styles.statItem}>
                                                    📺 {playlist.videoCount} videos
                                                </span>
                                            </div>
                                            <span className={styles.watchButton}>
                                                Watch Now
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
