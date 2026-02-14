'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './page.module.css';

interface Contributor {
     login: string;
     avatar_url: string;
     html_url: string;
     contributions: number;
     type: string;
     isNew?: boolean;
}

const REPO_OWNER = 'Tanay2920003';
const REPO_NAME = 'Learning-hub';

export default function ContributorsPage() {
     const [contributors, setContributors] = useState<Contributor[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);

     // Search, Filter, Pagination State
     const [searchQuery, setSearchQuery] = useState('');
     const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'owner' | 'top'>('all');
     const [visibleCount, setVisibleCount] = useState(10);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const [contributorsRes, commitsRes] = await Promise.all([
                         fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`),
                         fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=100`)
                    ]);

                    if (!contributorsRes.ok) {
                         throw new Error('Failed to fetch contributors');
                    }

                    const contributorsData = await contributorsRes.json();
                    const commitsData = await commitsRes.json();

                    // Extract (recent) authors from commits
                    const recentAuthors = new Set<string>();
                    if (Array.isArray(commitsData)) {
                         for (const commit of commitsData) {
                              if (commit.author && commit.author.login) {
                                   recentAuthors.add(commit.author.login);
                              }
                         }
                    }

                    // Process contributors
                    const processedContributors = contributorsData.map((contributor: Contributor) => {
                         const isRecent = recentAuthors.has(contributor.login);
                         const isLowCommit = contributor.contributions <= 5;
                         return {
                              ...contributor,
                              isNew: isRecent && isLowCommit
                         };
                    });

                    // Sort by contributions (Highest -> Lowest)
                    const sortedData = processedContributors.sort((a: Contributor, b: Contributor) => b.contributions - a.contributions);

                    setContributors(sortedData);
               } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Failed to load contributors. Please try again later.');
               } finally {
                    setLoading(false);
               }
          };

          fetchData();
     }, []);

     // Filter Logic
     const getFilteredContributors = () => {
          let filtered = contributors;

          // 1. Apply Search (match login OR role)
          if (searchQuery) {
               const query = searchQuery.toLowerCase();
               filtered = filtered.filter(c => {
                    const matchesName = c.login.toLowerCase().includes(query);

                    // Role matching logic
                    let role = 'collaborator';
                    if (c.login === REPO_OWNER) role = 'owner';
                    else if (c.isNew) role = 'new';

                    const matchesRole = role.includes(query);

                    return matchesName || matchesRole;
               });
          }

          // 2. Apply Tag Filter
          if (activeFilter === 'new') {
               filtered = filtered.filter(c => c.isNew);
          } else if (activeFilter === 'owner') {
               filtered = filtered.filter(c => c.login === REPO_OWNER);
          } else if (activeFilter === 'top') {
               filtered = filtered.slice(0, 3);
          } else if (activeFilter === 'all' && !searchQuery) {
               // In 'all' mode without search, we exclude the owner from the main grid
               // because they are shown at the bottom.
               filtered = filtered.filter(c => c.login !== REPO_OWNER);
          }

          return filtered;
     };

     const filteredContributors = getFilteredContributors();
     const visibleContributors = filteredContributors.slice(0, visibleCount);
     const showLoadMore = visibleContributors.length < filteredContributors.length;

     // Reset pagination when filter/search changes
     useEffect(() => {
          setVisibleCount(10);
     }, [searchQuery, activeFilter]);

     const navigationLinks = [
          { name: 'All Categories', url: '/', icon: '📁' },
          { name: 'YouTube Tutorials', url: '/youtube-tutorials', icon: 'https://img.icons8.com/fluency/48/play-button-circled.png' },
          { name: 'Game Development', url: '/game-development', icon: 'https://img.icons8.com/fluency/48/controller.png' },
          { name: 'Contribute', url: '/contributors', icon: 'https://img.icons8.com/fluency/48/handshake.png' },
          { name: 'Open Source', url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`, icon: 'https://img.icons8.com/fluency/48/github.png' },
     ];

     // Reusable Card Component to reduce code duplication
     const ContributorCard = ({ contributor }: { contributor: Contributor }) => {
          let role = 'Contributor';
          let roleClass = styles.roleContributor; // Default style

          if (contributor.login === REPO_OWNER) {
               role = 'Owner';
               roleClass = styles.roleOwner;
          } else if (contributor.isNew) {
               role = 'New';
               roleClass = styles.roleNew;
          } else {
               role = 'Collaborator'; // Everyone else is a collaborator
               roleClass = styles.roleCollaborator;
          }

          return (
               <div className={`${styles.cardContainer} ${contributor.isNew ? styles.newContributor : ''}`}>
                    <div className={styles.cardEffect}>
                         <div className={styles.cardInner}>
                              <div className={styles.cardLiquid}></div>
                              <div className={styles.cardShine}></div>
                              <div className={styles.cardGlow}></div>

                              <div className={styles.cardContent}>
                                   {/* Unified Badge Logic */}
                                   <div className={`${styles.cardBadge} ${roleClass}`}>
                                        {role} {role === 'Owner' ? '' : role === 'New' ? '🚀' : '💻'}
                                   </div>

                                   <div className={styles.cardImage}>
                                        <Image
                                             src={contributor.avatar_url}
                                             alt={contributor.login}
                                             width={200}
                                             height={200}
                                             className={styles.avatarImg}
                                        />
                                   </div>

                                   <div className={styles.cardText}>
                                        <p className={styles.cardTitle}>{contributor.login}</p>
                                        <p className={styles.cardDescription}>
                                             {contributor.contributions} {contributor.contributions === 1 ? 'Commit' : 'Commits'}
                                        </p>
                                   </div>

                                   <div className={styles.cardFooter}>
                                        <div className={styles.cardPrice}>
                                             {/* Optional footer text or stats */}
                                        </div>
                                        <a
                                             href={contributor.html_url}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className={styles.cardButton}
                                             aria-label="View Profile"
                                        >
                                             <Image src="https://img.icons8.com/fluency/48/github.png" width={20} height={20} alt="GitHub" unoptimized />
                                        </a>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          );
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

               <Sidebar
                    navigationLinks={navigationLinks}
                    categories={[]}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    currentPage="Contribute"
               />

               <main className={styles.main}>
                    <div className={styles.header}>
                         <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                              <Link href="/" className={styles.breadcrumbItem}>
                                   Home
                              </Link>
                              <span className={styles.breadcrumbSeparator}>›</span>
                              <span className={styles.breadcrumbActive}>Contributors</span>
                         </nav>

                         <h2>Open Source Contributors</h2>
                         <p>
                              Meet the amazing people who have contributed to this Open Source Learning Hub.
                              Join us in building the best resource for developers!
                         </p>
                         <a
                              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.repoButton}
                         >
                              <Image src="https://img.icons8.com/fluency/48/github.png" alt="" width={24} height={24} unoptimized />
                              Want to contribute click here
                         </a>
                    </div>

                    {/* Search & Filters */}
                    {!loading && !error && (
                         <div className={styles.controlsContainer}>
                              <div className={styles.searchContainer}>
                                   <span className={styles.searchIcon}>🔍</span>
                                   <input
                                        type="text"
                                        placeholder="Search contributors (e.g. 'Owner', 'New')..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={styles.searchInput}
                                   />
                                   <p className={styles.searchHelper} style={{ display: 'none' }}>
                                        {/* Helper text hidden as requested */}
                                   </p>
                              </div>

                              <div className={styles.filterTags}>
                                   {(['all', 'new', 'top', 'owner'] as const).map((filter) => (
                                        <button
                                             key={filter}
                                             className={`${styles.filterTag} ${activeFilter === filter ? styles.activeTag : ''}`}
                                             onClick={() => setActiveFilter(filter)}
                                        >
                                             {filter === 'all' && 'All'}
                                             {filter === 'new' && 'New 🚀'}
                                             {filter === 'owner' && 'Owner'}
                                             {filter === 'top' && 'Top Contributors 🏆'}
                                        </button>
                                   ))}
                              </div>
                         </div>
                    )}

                    {loading ? (
                         <div className={styles.loadingContainer}>
                              <p>Loading contributors...</p>
                         </div>
                    ) : error ? (
                         <div className={styles.errorContainer}>
                              <p>{error}</p>
                         </div>
                    ) : (
                         <>
                              <div className={styles.grid}>
                                   {visibleContributors.map((contributor) => (
                                        <ContributorCard key={contributor.login} contributor={contributor} />
                                   ))}
                              </div>

                              {showLoadMore && (
                                   <div className={styles.loadMoreContainer}>
                                        <button
                                             className={styles.loadMoreButton}
                                             onClick={() => setVisibleCount(prev => prev + 10)}
                                        >
                                             View More ({filteredContributors.length - visibleContributors.length} remaining)
                                        </button>
                                   </div>
                              )}

                              {/* Only show separate owner section if showing ALL and NO search query */}
                              {activeFilter === 'all' && !searchQuery && contributors.find(c => c.login === REPO_OWNER) && (
                                   <div className={styles.ownerSection}>
                                        {contributors.filter(c => c.login === REPO_OWNER).map((owner) => (
                                             <ContributorCard key={owner.login} contributor={owner} />
                                        ))}
                                   </div>
                              )}
                         </>
                    )}
               </main>

               {/* Overlay for mobile */}
               {isSidebarOpen && (
                    <div
                         className={styles.overlay}
                         onClick={() => setIsSidebarOpen(false)}
                         style={{
                              position: 'fixed',
                              inset: 0,
                              background: 'rgba(0,0,0,0.5)',
                              zIndex: 90,
                              backdropFilter: 'blur(4px)'
                         }}
                    />
               )}
          </div>
     );
}
