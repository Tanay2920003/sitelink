'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Sidebar.module.css';

export interface NavigationLink {
     name: string;
     url: string;
     icon: string;
}

export interface SidebarCategory {
     name: string;
     icon: string;
     slug?: string;
}

interface SidebarProps {
     navigationLinks: NavigationLink[];
     categories: SidebarCategory[];
     isSidebarOpen: boolean;
     setIsSidebarOpen: (isOpen: boolean) => void;
     currentPage?: string;
     onAction?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
     navigationLinks,
     categories,
     isSidebarOpen,
     setIsSidebarOpen,
     currentPage,
     onAction,
}) => {
     const [activeCategory, setActiveCategory] = React.useState<string>('');

     const handleAction = () => {
          setIsSidebarOpen(false);
          if (onAction) onAction();
     };

     // Scrollspy implementation
     React.useEffect(() => {
          const observerOptions = {
               root: null,
               rootMargin: '-20% 0px -35% 0px',
               threshold: 0.1
          };

          const observerCallback = (entries: IntersectionObserverEntry[]) => {
               entries.forEach(entry => {
                    if (entry.isIntersecting) {
                         setActiveCategory(entry.target.id);
                    }
               });
          };

          const observer = new IntersectionObserver(observerCallback, observerOptions);

          categories.forEach(category => {
               const element = document.getElementById(category.slug || category.name);
               if (element) {
                    observer.observe(element);
               }
          });

          return () => observer.disconnect();
     }, [categories]);

     const renderIcon = (icon: string) => {
          if (icon.startsWith('http')) {
               return <Image src={icon} alt="" width={20} height={20} className={styles.iconImage} style={{ objectFit: 'contain' }} unoptimized />;
          }
          return <span>{icon}</span>;
     };

     const mainLinks = navigationLinks.filter(link => ['Home', 'All Categories'].includes(link.name));
     const exploreLinks = navigationLinks.filter(link => ['YouTube Tutorials', 'Game Development'].includes(link.name));
     const footerLinks = navigationLinks.filter(link => ['GitHub Repository', 'Open Source', 'Contribute'].includes(link.name));

     return (
          <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
               <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.sidebarTitleLink}>
                         <div className={styles.logoContainer}>
                              <Image src="/logo.svg" alt="Learning Hub Logo" width={32} height={32} className={styles.logo} />
                              <h1>Learning Hub</h1>
                         </div>
                    </Link>
                    <p>{currentPage || 'Premium Resources'}</p>
               </div>

               <div className={styles.sidebarContent}>
                    <div className={styles.sidebarNav}>
                         <p className={styles.sidebarSectionTitle}>Quick Access</p>
                         {mainLinks.map((link) => (
                              <Link
                                   key={link.name}
                                   href={link.url}
                                   className={`${styles.sidebarNavLink} ${currentPage === link.name ? styles.active : ''}`}
                                   onClick={handleAction}
                                   target={link.url.startsWith('http') ? '_blank' : '_self'}
                                   rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                              >
                                   <span className={styles.iconWrapper}>{renderIcon(link.icon)}</span>
                                   <span>{link.name}</span>
                              </Link>
                         ))}

                         {exploreLinks.length > 0 && (
                              <>
                                   <p className={styles.sidebarSectionTitle} style={{ marginTop: '1.5rem' }}>Explore Groups</p>
                                   <div className={styles.exploreGroup} style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '16px',
                                        padding: '0.5rem',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                   }}>
                                        {exploreLinks.map((link) => (
                                             <Link
                                                  key={link.name}
                                                  href={link.url}
                                                  className={`${styles.sidebarNavLink} ${currentPage === link.name ? styles.active : ''}`}
                                                  onClick={handleAction}
                                                  style={{ marginBottom: '2px' }}
                                             >
                                                  <span className={styles.iconWrapper}>{renderIcon(link.icon)}</span>
                                                  <span>{link.name}</span>
                                             </Link>
                                        ))}
                                   </div>
                              </>
                         )}
                    </div>

                    <p className={styles.sidebarSectionTitle} style={{ marginTop: '1.5rem' }}>
                         {currentPage === 'YouTube Tutorials' ? 'Youtube Categories' : 'Categories'}
                    </p>
                    {categories.map((category) => {
                         const isActive = activeCategory === (category.slug || category.name);
                         return (
                              <a
                                   key={category.slug || category.name}
                                   href={`#${category.slug || category.name}`}
                                   className={`${styles.sidebarLink} ${isActive ? styles.active : ''}`}
                                   onClick={handleAction}
                              >
                                   <span className={styles.iconWrapper}>{renderIcon(category.icon)}</span>
                                   <span>{category.name}</span>
                              </a>
                         );
                    })}
               </div>

               <div className={styles.sidebarFooter}>
                    <div className={styles.footerLinks}>
                         {process.env.NODE_ENV === 'development' && (
                              <Link
                                   href="/edit-data"
                                   className={styles.sidebarNavLink}
                                   onClick={handleAction}
                                   style={{ marginBottom: '0.5rem' }}
                              >
                                   <span className={styles.iconWrapper}>
                                        <Image src="https://img.icons8.com/fluency/48/edit-property.png" alt="" width={20} height={20} unoptimized />
                                   </span>
                                   <span>Edit Data</span>
                              </Link>
                         )}
                         {footerLinks.map((link) => (
                              <Link
                                   key={link.name}
                                   href={link.url}
                                   className={styles.sidebarNavLink}
                                   onClick={handleAction}
                                   target={link.url.startsWith('http') ? '_blank' : '_self'}
                                   rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                   style={{ marginBottom: '0.5rem' }}
                              >
                                   <span className={styles.iconWrapper}>{renderIcon(link.icon)}</span>
                                   <span>{link.name}</span>
                              </Link>
                         ))}
                    </div>

                    <div className={styles.footerBottom}>
                         <div className={styles.footerInfo}>
                              <span>✨ Built with Next.js</span>
                              <div className={styles.nextLogo}>
                                   <Image src="https://img.icons8.com/fluent-systems-filled/40/ffffff/nextjs.png" alt="Next.js" width={16} height={16} unoptimized />
                              </div>
                         </div>
                         <a href="#Categories" className={styles.resourceCount} onClick={handleAction}>
                              {categories.length} Categories
                         </a>
                    </div>
               </div>
          </aside>
     );
};

export default Sidebar;
