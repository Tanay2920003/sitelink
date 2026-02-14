'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { getAllCategories, TopicData } from './actions/get-data';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './page.module.css';

interface LearningResource {
  id: string;
  name: string;
  url?: string; // Single URL (optional if urls is provided)
  urls?: { label: string; url: string }[]; // Multiple URLs with labels
  description: string;
  icon: string;
  color: string;
  category: string;
}

const resources: LearningResource[] = [
  {
    id: 'roadmap',
    name: 'Roadmap.sh',
    url: 'https://roadmap.sh/',
    description: 'Interactive developer roadmaps, guides and educational content',
    icon: 'https://img.icons8.com/fluency/48/map.png',
    color: '#667eea',
    category: 'Career Planning',
  },
  {
    id: 'dsa-tutorials',
    name: 'Data Structures & Algorithms',
    url: '/youtube-tutorials#dsa',
    description: 'Master DSA with curated high-quality video playlists covering fundamentals to advanced topics',
    icon: 'https://img.icons8.com/fluency/48/tree-structure.png',
    color: '#FF0000',
    category: 'YouTube Tutorials',
  },
  {
    id: 'dbms-tutorials',
    name: 'Database Management',
    url: '/youtube-tutorials#dbms',
    description: 'Comprehensive guides on SQL, NoSQL, and database architecture',
    icon: 'https://img.icons8.com/fluency/48/database.png',
    color: '#FF0000',
    category: 'YouTube Tutorials',
  },
  {
    id: 'ml-tutorials',
    name: 'Machine Learning',
    url: '/youtube-tutorials#ml',
    description: 'Learn ML foundations, deep learning, and practical applications',
    icon: 'https://img.icons8.com/fluency/48/robot.png',
    color: '#FF0000',
    category: 'YouTube Tutorials',
  },
  {
    id: 'os-tutorials',
    name: 'Operating Systems',
    url: '/youtube-tutorials#os',
    description: 'Understanding memory management, processes, and kernel architecture',
    icon: 'https://img.icons8.com/fluency/48/monitor.png',
    color: '#FF0000',
    category: 'YouTube Tutorials',
  },
  {
    id: 'python-tutorials',
    name: 'Python',
    url: '/youtube-tutorials#python',
    description: 'From syntax basics to advanced scripting and automation with Python',
    icon: 'https://img.icons8.com/fluency/48/python.png',
    color: '#FF0000',
    category: 'YouTube Tutorials',
  },
  {
    id: 'system-design-tutorials',
    name: 'System Design',
    url: '/youtube-tutorials#system-design',
    description: 'Build scalable systems with in-depth high-level and low-level design tutorials',
    icon: 'https://img.icons8.com/fluency/48/crane.png',
    color: '#FF0000',
    category: 'YouTube Tutorials',
  },
  {
    id: 'webdev-tutorials',
    name: 'Web Development',
    url: '/youtube-tutorials#webdev',
    description: 'Complete roadmaps and tutorials for modern frontend and backend stacks',
    icon: 'https://img.icons8.com/fluency/48/globe.png',
    color: '#FF0000',
    category: 'Video Courses',
  },
  {
    id: 'w3schools',
    name: 'W3Schools',
    url: 'https://www.w3schools.com/',
    description: 'Web development tutorials, references, and exercises',
    icon: 'https://img.icons8.com/fluency/48/books.png',
    color: '#04AA6D',
    category: 'Tutorials',
  },
  {
    id: 'webdev',
    name: 'Web.dev Learn',
    url: 'https://web.dev/learn',
    description: "Google's comprehensive web development courses and best practices",
    icon: 'https://img.icons8.com/fluency/48/graduation-cap.png',
    color: '#4facfe',
    category: 'Web Development',
  },
  {
    id: 'dotnet',
    name: 'Microsoft Learn - .NET',
    url: 'https://learn.microsoft.com/en-us/training/paths/build-dotnet-applications-csharp/?ns-enrollment-type=Collection&ns-enrollment-id=2md8ip7z51wd47',
    description: 'Build modern .NET applications with C# - Complete learning path',
    icon: 'https://img.icons8.com/fluency/48/monitor.png',
    color: '#512BD4',
    category: 'Backend Development',
  },
  {
    id: 'mslearn',
    name: 'Microsoft Learn - Browse',
    url: 'https://learn.microsoft.com/en-us/training/browse/?resource_type=learning%20path',
    description: 'Explore thousands of Microsoft learning paths and modules',
    icon: 'https://img.icons8.com/fluency/48/search.png',
    color: '#0078D4',
    category: 'Learning Paths',
  },
  {
    id: 'dsa-algorithm-visualizer',
    name: 'DSA Algorithm Visualizer',
    url: 'https://visualgo.net/en',
    description: 'Interactive visualizations for data structures and algorithms to help you understand complex concepts visually.',
    icon: 'https://img.icons8.com/fluency/48/bar-chart.png',
    color: '#0ea5e9',
    category: 'Visualizer',
  },
  {
    id: 'unity',
    name: 'Unity Learn',
    url: 'https://unity.com/learn',
    description: 'Master real-time 3D development with Unity tutorials and courses',
    icon: 'https://img.icons8.com/fluency/48/controller.png',
    color: '#6366f1',
    category: 'Game Development',
  },
  {
    id: 'unreal',
    name: 'Unreal Engine',
    url: 'https://www.unrealengine.com/en-US/learn',
    description: 'Learn to create stunning 3D experiences with Unreal Engine',
    icon: 'https://img.icons8.com/fluency/48/controller.png',
    color: '#6366f1',
    category: 'Game Development',
  },
  {
    id: 'github-visualizer',
    name: 'GitHub Visualizer',
    url: 'https://github-visualizer-olive.vercel.app',
    description: 'Beautifully visualize your GitHub contributions and activity',
    icon: 'https://img.icons8.com/fluency/48/bar-chart.png',
    color: '#24292e',
    category: 'Visualization',
  },
  {
    id: 'cyfrin-updraft',
    name: 'Cyfrin Updraft',
    url: 'https://updraft.cyfrin.io/',
    description: 'Learn blockchain and Web3 development with comprehensive courses on Solidity, smart contracts, and decentralized applications',
    icon: 'https://img.icons8.com/fluency/48/blockchain.png',
    color: '#8B5CF6',
    category: 'Blockchain & Web3',
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    url: 'https://leetcode.com/',
    description: 'The world\'s most popular coding platform for technical interviews and algorithmic challenges.',
    icon: 'https://img.icons8.com/fluency/48/brain.png',
    color: '#FFA116',
    category: 'Competitive Programming',
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    url: 'https://codeforces.com/',
    description: 'Participate in short programming contests and solve problems from a vast archive.',
    icon: 'https://img.icons8.com/fluency/48/winner.png',
    color: '#1F8ACB',
    category: 'Competitive Programming',
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/',
    description: 'A comprehensive computer science portal with tutorials, courses, and coding problems.',
    icon: 'https://img.icons8.com/fluency/48/console.png',
    color: '#2F8D46',
    category: 'Competitive Programming',
  },
];

const navigationLinks = [
  { name: 'All Categories', url: '/', icon: '📁' },
  { name: 'YouTube Tutorials', url: '/youtube-tutorials', icon: 'https://img.icons8.com/fluency/48/play-button-circled.png' },
  { name: 'Game Development', url: '/game-development', icon: 'https://img.icons8.com/fluency/48/controller.png' },
  { name: 'Contribute', url: '/contributors', icon: 'https://img.icons8.com/fluency/48/handshake.png' },
  { name: 'Open Source', url: 'https://github.com/Tanay2920003/Learning-hub', icon: 'https://img.icons8.com/fluency/48/github.png' },
];

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [dynamicCategories, setDynamicCategories] = useState<TopicData[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllCategories();
      setDynamicCategories(data);
    }
    fetchData();
  }, []);

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

  const handleSuggestionClick = (resource: LearningResource) => {
    const element = document.getElementById(resource.id.startsWith('http') ? '' : resource.category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (resource.url) {
      window.open(resource.url, resource.url.startsWith('/') ? '_self' : '_blank');
    } else if (resource.urls && resource.urls.length > 0) {
      window.open(resource.urls[0].url, '_blank');
    }
    setSearchQuery(resource.name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  // Combined resources: static + dynamic
  const allResources = useMemo(() => {
    const dynamicResources: LearningResource[] = [];
    dynamicCategories.forEach(cat => {
      cat.playlists.forEach((pl, idx) => {
        dynamicResources.push({
          id: `${cat.slug}-${idx}-${pl.url}`,
          name: pl.title,
          url: pl.url,
          description: pl.description,
          icon: 'https://img.icons8.com/fluency/48/video.png',
          color: '#FF0000',
          category: cat.name
        });
      });
    });
    return [...resources, ...dynamicResources];
  }, [dynamicCategories]);

  // Filter resources based on search query
  const filteredResources = useMemo(() => allResources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  ), [searchQuery, allResources]);

  const categories = useMemo(() => {
    const categoryNames = dynamicCategories.map(c => c.name);
    if (searchQuery.length > 0) {
      // logic to filter based on search
      // For now, just return all or filter names
      return categoryNames.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return categoryNames;
  }, [dynamicCategories, searchQuery]);

  // Group resources by category
  const groupedResources = useMemo(() => {
    const grouped: Record<string, LearningResource[]> = {};

    // Add dynamic categories
    dynamicCategories.forEach(cat => {
      grouped[cat.name] = cat.playlists.map((pl, idx) => ({
        id: `${cat.slug}-${idx}-${pl.url}`,
        name: pl.title,
        url: pl.url,
        description: pl.description,
        icon: 'https://img.icons8.com/fluency/48/video.png',
        color: '#FF0000',
        category: cat.name
      }));
    });

    // Add static resources (optional, if we want to keep them)
    resources.forEach(res => {
      if (!grouped[res.category]) {
        grouped[res.category] = [];
      }
      grouped[res.category].push(res);
    });

    return grouped;
  }, [dynamicCategories]);

  // Helper to get an icon for the category
  const getCategoryIcon = (categoryName: string) => {
    const cat = dynamicCategories.find(c => c.name === categoryName);
    return cat ? cat.icon : '📁';
  };

  const renderIcon = (icon: string) => {
    if (icon.startsWith('http')) {
      return (
        <Image
          src={icon}
          alt=""
          width={24}
          height={24}
          style={{ objectFit: 'contain' }}
          unoptimized={icon.startsWith('http')}
        />
      );
    }
    return icon;
  };

  // Refs for horizontal scroll containers
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scroll = (category: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
        navigationLinks={navigationLinks}
        categories={categories.map(cat => ({
          name: cat,
          icon: getCategoryIcon(cat),
          slug: cat
        }))}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentPage="All Categories"
        onAction={() => setSearchQuery('')}
      />

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.pill}>Premium Resources</span>
            <h2>Explore Learning Resources</h2>
            <p>Choose a platform to start your learning journey</p>

            {/* Search Bar */}
            <div className={styles.searchContainer} ref={searchContainerRef}>
              <input
                type="text"
                role="combobox"
                placeholder="Search resources, categories, or descriptions..."
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
                      prev < Math.min(filteredResources.length, 5) - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                  } else if (e.key === 'Enter') {
                    if (activeSuggestionIndex >= 0 && activeSuggestionIndex < Math.min(filteredResources.length, 5)) {
                      const resource = filteredResources[activeSuggestionIndex];
                      handleSuggestionClick(resource);
                    }
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                    setActiveSuggestionIndex(-1);
                  }
                }}
                className={styles.searchInput}
                aria-label="Search resources"
                aria-expanded={showSuggestions && filteredResources.length > 0}
                aria-controls="search-results"
                aria-autocomplete="list"
              />
              <span className={styles.searchIcon}>🔍</span>

              {/* Autocomplete Dropdown */}
              {showSuggestions && searchQuery.length > 0 && (
                <div className={styles.suggestionsDropdown} id="search-results" role="listbox">
                  {filteredResources.slice(0, 5).map((resource, index) => (
                    <div
                      key={resource.id}
                      className={`${styles.suggestionItem} ${index === activeSuggestionIndex ? styles.activeSuggestion : ''}`}
                      role="option"
                      aria-selected={index === activeSuggestionIndex}
                      onClick={() => handleSuggestionClick(resource)}
                    >
                      <span className={styles.suggestionIcon}>{renderIcon(resource.icon)}</span>
                      <div className={styles.suggestionContent}>
                        <span className={styles.suggestionTitle}>{resource.name}</span>
                        <span className={styles.suggestionCategory}>{resource.category}</span>
                      </div>
                    </div>
                  ))}
                  {filteredResources.length === 0 && (
                    <div className={styles.suggestionItem} style={{ cursor: 'default' }}>
                      <span className={styles.suggestionIcon}>
                        <Image src="https://img.icons8.com/fluency/48/cancel.png" alt="" width={20} height={20} unoptimized />
                      </span>
                      <span className={styles.suggestionTitle}>No results found</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.cardsGrid} id="Categories">
          {categories.length > 0 ? (
            categories.map((category) => (
              <section key={category} id={category} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryIcon}>{renderIcon(getCategoryIcon(category))}</span>
                    <h2 className={styles.categoryTitle}>{category}</h2>
                  </div>
                  <div className={styles.scrollButtons}>
                    <button
                      className={styles.scrollButton}
                      onClick={() => scroll(category, 'left')}
                      aria-label="Scroll left"
                    >
                      ‹
                    </button>
                    <button
                      className={styles.scrollButton}
                      onClick={() => scroll(category, 'right')}
                      aria-label="Scroll right"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div
                  className={styles.grid}
                  ref={el => { scrollRefs.current[category] = el; }}
                >
                  {groupedResources[category]?.length > 0 ? (
                    groupedResources[category].map((resource) => {
                      const hasMultipleUrls = resource.urls && resource.urls.length > 0;
                      const singleUrl = resource.url || '';
                      const isInternal = singleUrl.startsWith('/');

                      const CardWrapper = hasMultipleUrls ? 'div' : 'a';
                      const cardProps = hasMultipleUrls
                        ? {}
                        : {
                          href: singleUrl,
                          target: isInternal ? '_self' : '_blank',
                          rel: isInternal ? undefined : 'noopener noreferrer',
                        };

                      return (
                        <CardWrapper
                          key={resource.id}
                          className={`${styles.card} ${resource.category === 'Video Courses' ? styles.videoCard : ''}`}
                          {...cardProps}
                        >
                          <div className={styles.cardHeader}>
                            <span
                              className={styles.difficultyBadge}
                              style={{
                                borderColor: resource.color,
                                color: '#e4e4e7',
                                background: `${resource.color}25`,
                              }}
                            >
                              {resource.category}
                            </span>
                            <span
                              className={styles.languageBadge}
                              style={{ fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {renderIcon(resource.icon)}
                            </span>
                          </div>
                          <h3 className={styles.cardTitle}>{resource.name}</h3>
                          <p className={styles.cardDescription}>{resource.description}</p>
                          <div className={styles.cardFooter}>
                            <div className={styles.stats}></div>
                            {hasMultipleUrls ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                                {resource.urls!.map((urlItem) => {
                                  const platformColors: Record<string, string> = {
                                    'LeetCode': '#FFA116',
                                    'Codeforces': '#1F8ACB',
                                    'GeeksforGeeks': '#2F8D46',
                                  };
                                  const buttonColor = platformColors[urlItem.label] || resource.color;
                                  return (
                                    <a
                                      key={urlItem.url}
                                      href={urlItem.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles.watchButton}
                                      style={{
                                        backgroundColor: buttonColor,
                                        boxShadow: `0 6px 20px ${buttonColor}50`,
                                        width: '100%',
                                        justifyContent: 'center',
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                      }}
                                    >
                                      {urlItem.label}
                                    </a>
                                  );
                                })}
                              </div>
                            ) : (
                              <span
                                className={styles.watchButton}
                                style={{
                                  backgroundColor: resource.color,
                                  boxShadow: `0 4px 12px ${resource.color}40`,
                                }}
                              >
                                Open Resource
                              </span>
                            )}
                          </div>
                        </CardWrapper>
                      );
                    })
                  ) : (
                    <div className={`${styles.card} ${styles.contributeCard}`}>
                      <div className={styles.cardHeader}>
                        <span className={styles.difficultyBadge} style={{ borderColor: '#6366f1', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)' }}>
                          CONTRIBUTE
                        </span>
                        <span className={styles.languageBadge} style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image src="https://img.icons8.com/fluency/48/handshake.png" alt="" width={24} height={24} unoptimized />
                        </span>
                      </div>
                      <h3 className={styles.cardTitle}>Add Resources</h3>
                      <p className={styles.cardDescription}>
                        This category is looking for high-quality resources. Help the community by contributing your favorites!
                      </p>
                      <div className={styles.cardFooter}>
                        <div className={styles.stats}></div>
                        <a
                          href="https://github.com/Tanay2920003/Learning-hub"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.watchButton}
                          style={{
                            backgroundColor: '#6366f1',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                            width: '100%',
                            justifyContent: 'center'
                          }}
                        >
                          Add on GitHub
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No resources found matching &quot;{searchQuery}&quot;</p>
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
