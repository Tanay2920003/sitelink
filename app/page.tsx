'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
    icon: '🗺️',
    color: '#667eea',
    category: 'Career Planning',
  }, {
    id: 'youtube-tutorials',
    name: 'YouTube Tutorials',
    url: '/youtube-tutorials',
    description: 'Curated video playlists for all topics: DSA, System Design, Web Dev, and more',
    icon: '▶️',
    color: '#FF0000',
    category: 'Video Courses',
  },
  {
    id: 'w3schools',
    name: 'W3Schools',
    url: 'https://www.w3schools.com/',
    description: 'Web development tutorials, references, and exercises',
    icon: '📚',
    color: '#04AA6D',
    category: 'Tutorials',
  },
  {
    id: 'webdev',
    name: 'Web.dev Learn',
    url: 'https://web.dev/learn',
    description: "Google's comprehensive web development courses and best practices",
    icon: '🎓',
    color: '#4facfe',
    category: 'Web Development',
  },
  {
    id: 'dotnet',
    name: 'Microsoft Learn - .NET',
    url: 'https://learn.microsoft.com/en-us/training/paths/build-dotnet-applications-csharp/?ns-enrollment-type=Collection&ns-enrollment-id=2md8ip7z51wd47',
    description: 'Build modern .NET applications with C# - Complete learning path',
    icon: '💻',
    color: '#512BD4',
    category: 'Backend Development',
  },
  {
    id: 'mslearn',
    name: 'Microsoft Learn - Browse',
    url: 'https://learn.microsoft.com/en-us/training/browse/?resource_type=learning%20path',
    description: 'Explore thousands of Microsoft learning paths and modules',
    icon: '🔍',
    color: '#0078D4',
    category: 'Learning Paths',
  },
  {
    id: 'unity',
    name: 'Unity Learn',
    url: 'https://unity.com/learn',
    description: 'Master real-time 3D development with Unity tutorials and courses',
    icon: '🎮',
    color: '#000000',
    category: 'Game Development',
  },
  {
    id: 'unreal',
    name: 'Unreal Engine',
    url: 'https://www.unrealengine.com/en-US/learn',
    description: 'Learn to create stunning 3D experiences with Unreal Engine',
    icon: '🎲',
    color: '#0e1128',
    category: 'Game Development',
  },
  {
    id: 'dsa-visualizer',
    name: 'DSA Algorithm Visualizer',
    url: 'https://algovizvps.vercel.app/',
    description: 'Interactive visualizations for data structures and algorithms',
    icon: '🧩',
    color: '#FF5722',
    category: 'Algorithms',
  },
  {
    id: 'github-visualizer',
    name: 'GitHub Visualizer',
    url: 'https://github-visualizer-olive.vercel.app',
    description: 'Beautifully visualize your GitHub contributions and activity',
    icon: '📊',
    color: '#24292e',
    category: 'Visualization',
  },
  {
    id: 'cyfrin-updraft',
    name: 'Cyfrin Updraft',
    url: 'https://updraft.cyfrin.io/',
    description: 'Learn blockchain and Web3 development with comprehensive courses on Solidity, smart contracts, and decentralized applications',
    icon: '⛓️',
    color: '#8B5CF6',
    category: 'Blockchain & Web3',
  },
  {
    id: 'competitive-programming',
    name: 'Competitive Programming',
    urls: [
      { label: 'LeetCode', url: 'https://leetcode.com/' },
      { label: 'Codeforces', url: 'https://codeforces.com/' },
      { label: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/' },
    ],
    description: 'Practice coding problems and improve your algorithmic skills across multiple competitive programming platforms',
    icon: '🏆',
    color: '#FFA116',
    category: 'Competitive Programming',
  },
];

export default function Home() {
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

  // Filter resources based on search query
  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group resources by category
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, LearningResource[]>);

  const categories = Object.keys(groupedResources).sort((a, b) => {
    // "Career Planning" always comes first
    if (a === 'Career Planning') return -1;
    if (b === 'Career Planning') return 1;
    // Sort the rest alphabetically
    return a.localeCompare(b);
  });

  // Helper to get an icon for the category (using the icon of the first resource as a proxy or default)
  const getCategoryIcon = (category: string) => {
    const resource = groupedResources[category][0];
    return resource ? resource.icon : '📂';
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
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <Image src="/logo.svg" alt="Learning Hub Logo" width={32} height={32} className={styles.logo} />
            <h1>Learning Hub</h1>
          </div>
          <p>Premium Resources</p>
        </div>

        <div className={styles.sidebarContent}>
          {categories.map((category) => (
            <a
              key={category}
              href={`#${category}`}
              className={styles.sidebarLink}
              onClick={() => setIsSidebarOpen(false)} // Close on mobile click
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{category}</span>
            </a>
          ))}
        </div>

        <div className={styles.sidebarFooter}>
          <p>✨ Built with Next.js</p>
          <p className={styles.resourceCount}>{resources.length} Resources</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Explore Learning Resources</h2>
            <p>Choose a platform to start your learning journey</p>
            
            {/* Search Bar */}
            {/* Search Bar */}
            <div className={styles.searchContainer} ref={searchContainerRef}>
                <input
                    type="text"
                    placeholder="Search resources, categories, or descriptions..."
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
                    {filteredResources.slice(0, 5).map((resource) => (
                      <div 
                        key={resource.id} 
                        className={styles.suggestionItem}
                        onClick={() => {
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
                        }}
                      >
                        <span className={styles.suggestionIcon}>{resource.icon}</span>
                        <div className={styles.suggestionContent}>
                          <span className={styles.suggestionTitle}>{resource.name}</span>
                          <span className={styles.suggestionCategory}>{resource.category}</span>
                        </div>
                      </div>
                    ))}
                    {filteredResources.length === 0 && (
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
          {categories.length > 0 ? (
            categories.flatMap((category) =>
              groupedResources[category].map((resource, index) => {
              const navId = index === 0 ? category : undefined;
              const hasMultipleUrls = resource.urls && resource.urls.length > 0;
              const singleUrl = resource.url || '';
              const isInternal = singleUrl.startsWith('/');

              // For resources with multiple URLs, render as div instead of anchor
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
                  id={navId}
                  className={styles.card}
                  style={{
                    scrollMarginTop: navId ? '8rem' : undefined,
                  } as React.CSSProperties}
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
                      style={{ fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)' }}
                    >
                      {resource.icon}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{resource.name}</h3>
                  <p className={styles.cardDescription}>{resource.description}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.stats}></div>
                    {hasMultipleUrls ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        {resource.urls!.map((urlItem) => {
                          // Platform-specific solid colors
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
                                transform: 'scale(1)',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = `0 8px 25px ${buttonColor}70`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = `0 6px 20px ${buttonColor}50`;
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
            }))
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
