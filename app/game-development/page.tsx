'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './page.module.css';

const gameResources = [
     {
          id: 'unity',
          name: 'Unity Learn',
          url: 'https://unity.com/learn',
          description: 'Master real-time 3D development with Unity tutorials and courses',
          icon: '🎮',
          color: '#6366f1',
          category: 'Game Engine',
     },
     {
          id: 'unreal',
          name: 'Unreal Engine',
          url: 'https://www.unrealengine.com/en-US/learn',
          description: 'Learn to create stunning 3D experiences with Unreal Engine',
          icon: '🎲',
          color: '#6366f1',
          category: 'Game Engine',
     },
];

export default function GameDevelopment() {
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

               <Sidebar
                    navigationLinks={[
                         { name: 'All Categories', url: '/', icon: '📁' },
                         { name: 'YouTube Tutorials', url: '/youtube-tutorials', icon: 'https://img.icons8.com/fluency/48/play-button-circled.png' },
                         { name: 'Game Development', url: '/game-development', icon: 'https://img.icons8.com/fluency/48/controller.png' },
                         { name: 'GitHub Repository', url: 'https://github.com/Tanay2920003/Learning-hub', icon: 'https://img.icons8.com/fluency/48/folder-invoices.png' },
                         { name: 'Contribute', url: 'https://github.com/Tanay2920003/Learning-hub/blob/main/CONTRIBUTING.md', icon: 'https://img.icons8.com/fluency/48/handshake.png' },
                    ]}
                    categories={[
                         { name: 'Game Engines', icon: '⚙️', slug: 'engines' }
                    ]}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    currentPage="Game Development"
               />

               <main className={styles.main}>
                    <div className={styles.header}>
                         <div className={styles.headerContent}>
                              {/* Breadcrumb Navigation */}
                              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                                   <Link href="/" className={styles.breadcrumbItem}>
                                        <span className={styles.breadcrumbIcon}>📁</span>
                                        <span>Home</span>
                                   </Link>
                                   <span className={styles.breadcrumbSeparator}>›</span>
                                   <div className={`${styles.breadcrumbItem} ${styles.breadcrumbActive}`}>
                                        <span className={styles.breadcrumbIcon}>🎮</span>
                                        <span>Game Development</span>
                                   </div>
                              </nav>

                              <h2>Game Development</h2>
                              <p>Master Unity and Unreal Engine with premium resources</p>
                         </div>
                    </div>

                    <div className={styles.cardsGrid}>
                         {gameResources.map((resource) => (
                              <a
                                   key={resource.id}
                                   href={resource.url}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className={styles.card}
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
                                        <span className={styles.languageBadge}>
                                             {resource.icon}
                                        </span>
                                   </div>
                                   <h3 className={styles.cardTitle}>{resource.name}</h3>
                                   <p className={styles.cardDescription}>{resource.description}</p>
                                   <div className={styles.cardFooter}>
                                        <span
                                             className={styles.watchButton}
                                             style={{
                                                  backgroundColor: resource.color,
                                                  boxShadow: `0 4px 12px ${resource.color}40`,
                                             }}
                                        >
                                             Open Learning Center
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
