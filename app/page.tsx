'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface LearningResource {
  id: string;
  name: string;
  url: string;
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
];

export default function Home() {
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
          <h1>Learning Hub</h1>
          <p>Premium Resources</p>
        </div>

        <div className={styles.sidebarContent}>
          <p className={styles.sidebarDescription}>
            Curated collection of the best learning resources for developers. Click any card to start learning!
          </p>
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
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resourceCard}
              style={{
                '--card-color': resource.color,
              } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{resource.icon}</span>
                <span className={styles.cardCategory}>{resource.category}</span>
              </div>
              <h3 className={styles.cardTitle}>{resource.name}</h3>
              <p className={styles.cardDescription}>{resource.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardLink}>
                  Open Resource
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
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
