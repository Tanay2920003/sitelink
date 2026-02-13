'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Generate suggestions
    const suggestions = searchQuery.length > 0 ? (() => {
        const allSuggestions: { type: 'topic' | 'playlist', item: TopicData | Playlist, icon?: string }[] = [];
        
        topics.forEach(topic => {
            // Check topic matches
            if (topic.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                allSuggestions.push({ type: 'topic', item: topic, icon: topic.icon });
            }
            // Check playlist matches
            topic.playlists.forEach(playlist => {
                if (playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    playlist.creator.toLowerCase().includes(searchQuery.toLowerCase())) {
                    allSuggestions.push({ type: 'playlist', item: playlist, icon: '📺' });
                }
            });
        });
        return allSuggestions.slice(0, 5);
    })() : [];

    const filteredTopics = topics.map(topic => {
        const filteredPlaylists = topic.playlists.filter(playlist =>
            playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            playlist.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return {
            ...topic,
            playlists: filteredPlaylists
        };
    }).filter(topic => topic.playlists.length > 0);

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
                        <div className={styles.logoContainer}>
                            <Image src="/logo.svg" alt="Learning Hub Logo" width={32} height={32} className={styles.logo} />
                            <h1>Learning Hub</h1>
                        </div>
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
                        
                        {/* Search Bar */}
                        <div className={styles.searchContainer} ref={searchContainerRef}>
                            <input
                                type="text"
                                placeholder="Search tutorials, creators, or topics..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className={styles.searchInput}
                            />
                            <span className={styles.searchIcon}>🔍</span>

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && searchQuery.length > 0 && (
                                <div className={styles.suggestionsDropdown}>
                                    {suggestions.map((suggestion, index) => {
                                        const title = suggestion.type === 'topic' 
                                            ? (suggestion.item as TopicData).name 
                                            : (suggestion.item as Playlist).title;
                                        const subtitle = suggestion.type === 'topic'
                                            ? 'Topic'
                                            : `Playlist • ${(suggestion.item as Playlist).creator}`;
                                            
                                        return (
                                            <div 
                                                key={`${suggestion.type}-${index}`} 
                                                className={styles.suggestionItem}
                                                onClick={() => {
                                                    if (suggestion.type === 'topic') {
                                                        const element = document.getElementById((suggestion.item as TopicData).slug);
                                                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                                                    } else {
                                                        window.open((suggestion.item as Playlist).url, '_blank');
                                                    }
                                                    setSearchQuery(title);
                                                    setShowSuggestions(false);
                                                }}
                                            >
                                                <span className={styles.suggestionIcon}>{suggestion.icon}</span>
                                                <div className={styles.suggestionContent}>
                                                    <span className={styles.suggestionTitle}>{title}</span>
                                                    <span className={styles.suggestionMeta}>{subtitle}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {suggestions.length === 0 && (
                                        <div className={styles.suggestionItem} style={{ cursor: 'default' }}>
                                            <span className={styles.suggestionIcon}>🚫</span>
                                            <span className={styles.suggestionTitle}>No results found</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.cardsGrid}>
                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
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
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p>No tutorials found matching &quot;{searchQuery}&quot;</p>
                        </div>
                    )}
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
