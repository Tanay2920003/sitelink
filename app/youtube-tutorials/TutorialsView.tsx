'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar/Sidebar';
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
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Refs for horizontal scroll containers
    const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const scroll = (slug: string, direction: 'left' | 'right') => {
        const container = scrollRefs.current[slug];
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setActiveSuggestionIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle auto-scroll to category on mount or hash change
    useEffect(() => {
        const handleHashScroll = () => {
            const hash = window.location.hash;
            if (hash) {
                const targetId = hash.replace('#', '');
                const element = document.getElementById(targetId);
                if (element) {
                    // Small timeout to ensure everything is rendered
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }
        };

        handleHashScroll();
        window.addEventListener('hashchange', handleHashScroll);
        return () => window.removeEventListener('hashchange', handleHashScroll);
    }, []);

    // Generate suggestions
    const suggestions = useMemo(() => {
        if (searchQuery.length === 0) return [];
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
                    allSuggestions.push({ type: 'playlist', item: playlist, icon: 'https://img.icons8.com/fluency/48/play-button-circled.png' });
                }
            });
        });
        return allSuggestions.slice(0, 5);
    }, [searchQuery, topics]);

    const renderIcon = (icon: string) => {
        if (icon?.startsWith('http')) {
            return <Image src={icon} alt="" width={24} height={24} style={{ objectFit: 'contain' }} unoptimized />;
        }
        return icon;
    };

    const handleSuggestionClick = (suggestion: { type: 'topic' | 'playlist', item: TopicData | Playlist }) => {
        const title = suggestion.type === 'topic'
            ? (suggestion.item as TopicData).name
            : (suggestion.item as Playlist).title;

        if (suggestion.type === 'topic') {
            const element = document.getElementById((suggestion.item as TopicData).slug);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.open((suggestion.item as Playlist).url, '_blank');
        }
        setSearchQuery(title);
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
    };

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
            <Sidebar
                navigationLinks={[
                    { name: 'All Categories', url: '/', icon: '📁' },
                    { name: 'YouTube Tutorials', url: '/youtube-tutorials', icon: 'https://img.icons8.com/fluency/48/play-button-circled.png' },
                    { name: 'Game Development', url: '/game-development', icon: 'https://img.icons8.com/fluency/48/controller.png' },
                    { name: 'Contribute', url: '/contributors', icon: 'https://img.icons8.com/fluency/48/handshake.png' },
                    { name: 'Open Source', url: 'https://github.com/Tanay2920003/Learning-hub', icon: 'https://img.icons8.com/fluency/48/github.png' },
                ]}
                categories={topics.map(topic => ({
                    name: topic.name,
                    icon: topic.icon,
                    slug: topic.slug
                }))}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                currentPage="YouTube Tutorials"
                onAction={() => setSearchQuery('')}
            />

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        {/* Breadcrumb Navigation */}
                        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                            <Link href="/" className={styles.breadcrumbItem}>
                                <span className={styles.breadcrumbIcon}>
                                    <Image src="https://img.icons8.com/fluency/48/home.png" alt="" width={16} height={16} unoptimized />
                                </span>
                                <span>Home</span>
                            </Link>
                            <span className={styles.breadcrumbSeparator}>›</span>
                            <div className={`${styles.breadcrumbItem} ${styles.breadcrumbActive}`}>
                                <span className={styles.breadcrumbIcon}>
                                    <Image src="https://img.icons8.com/fluency/48/play-button-circled.png" alt="" width={16} height={16} unoptimized />
                                </span>
                                <span>YouTube Tutorials</span>
                            </div>
                        </nav>

                        <h2>YouTube Tutorials</h2>
                        <p>Curated video playlists for every developer skill level</p>

                        {/* Search Bar */}
                        <div className={styles.searchContainer} ref={searchContainerRef}>
                            <input
                                type="text"
                                role="combobox"
                                placeholder="Search tutorials, creators, or topics..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                    setActiveSuggestionIndex(-1);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        setActiveSuggestionIndex(prev =>
                                            prev < suggestions.length - 1 ? prev + 1 : prev
                                        );
                                    } else if (e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                                    } else if (e.key === 'Enter') {
                                        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                                            handleSuggestionClick(suggestions[activeSuggestionIndex]);
                                        }
                                    } else if (e.key === 'Escape') {
                                        setShowSuggestions(false);
                                        setActiveSuggestionIndex(-1);
                                    }
                                }}
                                className={styles.searchInput}
                                aria-label="Search tutorials"
                                aria-expanded={showSuggestions && suggestions.length > 0}
                                aria-controls="tutorial-search-results"
                                aria-autocomplete="list"
                            />
                            <span className={styles.searchIcon}>🔍</span>

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && searchQuery.length > 0 && (
                                <div className={styles.suggestionsDropdown} id="tutorial-search-results" role="listbox">
                                    {suggestions.map((suggestion, index) => {
                                        const title = suggestion.type === 'topic'
                                            ? (suggestion.item as TopicData).name
                                            : (suggestion.item as Playlist).title;
                                        const subtitle = suggestion.type === 'topic'
                                            ? 'Topic'
                                            : `Playlist • ${(suggestion.item as Playlist).creator}`;

                                        const key = suggestion.type === 'topic'
                                            ? (suggestion.item as TopicData).slug
                                            : `${suggestion.type}-${(suggestion.item as Playlist).url}`;

                                        return (
                                            <div
                                                key={key}
                                                className={`${styles.suggestionItem} ${index === activeSuggestionIndex ? styles.activeSuggestion : ''}`}
                                                role="option"
                                                aria-selected={index === activeSuggestionIndex}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                <span className={styles.suggestionIcon}>{renderIcon(suggestion.icon || '')}</span>
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
                                    <div className={styles.categoryInfo}>
                                        <span className={styles.categoryIcon}>{topic.icon}</span>
                                        <div className={styles.categoryTitles}>
                                            <h2 className={styles.categoryTitle}>{topic.name}</h2>
                                            <p className={styles.categoryDescription}>{topic.description}</p>
                                        </div>
                                    </div>
                                    <div className={styles.scrollButtons}>
                                        <button
                                            className={styles.scrollButton}
                                            onClick={() => scroll(topic.slug, 'left')}
                                            aria-label="Scroll left"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            className={styles.scrollButton}
                                            onClick={() => scroll(topic.slug, 'right')}
                                            aria-label="Scroll right"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className={styles.grid}
                                    ref={el => { scrollRefs.current[topic.slug] = el; }}
                                >
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
                                                        <Image src="https://img.icons8.com/fluency/48/play-button-circled.png" alt="" width={16} height={16} style={{ marginRight: '4px' }} unoptimized />
                                                        {playlist.videoCount} videos
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
