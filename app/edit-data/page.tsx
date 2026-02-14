'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getFilesWithMetadata, getFileContent, saveFileContent, createFile } from './actions';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

import { Playlist } from './schema';

// --- Types ---
interface FileMetadata {
     filename: string;
     name: string;
     icon: string;
}

interface CategoryData {
     name: string;
     slug: string;
     description: string;
     icon: string;
     playlists: Playlist[];
}

const DEFAULT_CATEGORY: CategoryData = {
     name: "New Category",
     slug: "new-category",
     description: "Description",
     icon: "📁",
     playlists: []
};

const PLAYLIST_TEMPLATE: Playlist = {
     title: "New Playlist",
     creator: "Creator",
     url: "",
     language: "English",
     difficulty: "beginner",
     videoCount: 0,
     description: "",
     year: new Date().getFullYear()
};

// --- Sub-Components (Internal for now for cohesion) ---

const FloatingInput = ({ label, value, onChange, hint, type = "text" }: { label: string, value: string | number, onChange: (val: string | number) => void, hint?: string, type?: string }) => (
     <div className={styles.formGroup}>
          <input
               className={styles.inputField}
               placeholder=" "
               value={value}
               type={type}
               onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          />
          <label className={styles.inputLabel}>{label}</label>
          {hint && <div className={styles.inputHint}>{hint}</div>}
     </div>
);

const MetadataPanel = ({ data, onChange }: { data: CategoryData, onChange: (d: CategoryData) => void }) => {
     const handleChange = (field: keyof CategoryData, value: string | Playlist[]) => {
          onChange({ ...data, [field]: value } as CategoryData);
     };

     return (
          <div className={styles.metadataPanel}>
               <div className={styles.panelTitle}>
                    <span>✏️</span> Metadata
               </div>
               <FloatingInput label="Category Name" value={data.name} onChange={(v) => handleChange('name', v as string)} hint="Displayed in Sidebar & Home" />
               <FloatingInput label="Slug (ID)" value={data.slug} onChange={(v) => handleChange('slug', v as string)} hint="URL-friendly ID (e.g., web-dev)" />
               <FloatingInput label="Description" value={data.description} onChange={(v) => handleChange('description', v as string)} />
               <FloatingInput label="Icon (Emoji/URL)" value={data.icon} onChange={(v) => handleChange('icon', v as string)} hint="e.g. ⚛️ or https://..." />
          </div>
     );
};

const PlaylistCard = ({ playlist, onChange, onDelete }: { playlist: Playlist, onChange: (val: Playlist) => void, onDelete: () => void }) => {
     const handleChange = <K extends keyof Playlist>(field: K, value: Playlist[K]) => {
          onChange({ ...playlist, [field]: value });
     };

     return (
          <div className={styles.playlistCard}>
               <div className={styles.cardPreview}>
                    <span className={styles.cardIcon}>🎥</span>
                    <button className={styles.deleteCardBtn} onClick={onDelete} title="Delete Playlist">×</button>
               </div>
               <div className={styles.cardContent}>
                    <input
                         className={styles.cardTitleInput}
                         value={playlist.title}
                         onChange={(e) => handleChange('title', e.target.value)}
                         placeholder="Playlist Title"
                    />
                    <input
                         className={styles.metaInput}
                         style={{ marginBottom: '8px', border: 'none', background: 'transparent', padding: '0', color: '#a1a1aa' }}
                         value={playlist.creator}
                         onChange={(e) => handleChange('creator', e.target.value)}
                         placeholder="Creator Name"
                    />

                    <div className={styles.cardMetaGrid}>
                         <input className={styles.metaInput} value={playlist.language} onChange={(e) => handleChange('language', e.target.value)} placeholder="Lang" />
                         <select
                              className={styles.metaInput}
                              value={playlist.difficulty}
                              onChange={(e) => handleChange('difficulty', e.target.value as Playlist['difficulty'])}
                         >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                         </select>
                         <input className={styles.metaInput} type="number" value={playlist.videoCount} onChange={(e) => handleChange('videoCount', Number(e.target.value))} placeholder="Vids" />
                         <input className={styles.metaInput} type="number" value={playlist.year} onChange={(e) => handleChange('year', Number(e.target.value))} placeholder="Year" />
                    </div>

                    <div style={{ marginTop: '10px' }}>
                         <input className={styles.metaInput} value={playlist.url} onChange={(e) => handleChange('url', e.target.value)} placeholder="Playlist URL..." />
                    </div>
               </div>
          </div>
     );
};

// --- New Polish Components ---

interface Toast {
     id: number;
     text: string;
     type: 'success' | 'error';
}

const Toaster = ({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: number) => void }) => (
     <div className={styles.toastContainer}>
          {toasts.map(toast => (
               <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`} onClick={() => removeToast(toast.id)}>
                    <span>{toast.type === 'success' ? '✅' : '❌'}</span>
                    {toast.text}
               </div>
          ))}
     </div>
);

const GitReminderOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
     if (!isOpen) return null;
     return (
          <div className={styles.gitOverlay} onClick={onClose}>
               <div className={styles.gitCard} onClick={e => e.stopPropagation()}>
                    <div className={styles.gitIcon}>🚀</div>
                    <h2 className={styles.gitTitle}>Changes Saved Successfully!</h2>
                    <div className={styles.gitBody}>
                         <p>Now, to finalize these changes, please:</p>
                         <ul className={styles.gitSteps}>
                              <li>
                                   <span className={styles.stepNum}>1</span>
                                   <span>Create a **git commit** of these changes.</span>
                              </li>
                              <li>
                                   <span className={styles.stepNum}>2</span>
                                   <span>Push and open a **Pull Request** in GitHub.</span>
                              </li>
                         </ul>
                         <div className={styles.gitHint}>
                              You can use VS Code&apos;s Source Control tab or the GitHub Desktop UI.
                         </div>
                    </div>
                    <button className={styles.btnPrimary} onClick={onClose} style={{ width: '100%', marginTop: '1rem' }}>Okay, Understood</button>
               </div>
          </div>
     );
};

const GuideOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
     if (!isOpen) return null;
     return (
          <div className={styles.gitOverlay} onClick={onClose}>
               <div className={styles.gitCard} style={{ width: '600px', textAlign: 'left' }} onClick={e => e.stopPropagation()}>
                    <div className={styles.gitIcon} style={{ textAlign: 'center' }}>📖</div>
                    <h2 className={styles.gitTitle} style={{ textAlign: 'center' }}>How to Contribute Data</h2>

                    <div className={styles.guideSection}>
                         <h3>1. Edit Your Content</h3>
                         <p>Select a category from the sidebar. You can update titles, descriptions, and add or remove playlists directly in the GUI.</p>
                    </div>

                    <div className={styles.guideSection}>
                         <h3>2. Save to Filesystem</h3>
                         <p>Click &quot;Save Changes&quot;. This writes your updates to the local JSON files in the `data/` folder.</p>
                    </div>

                    <div className={styles.guideSection}>
                         <h3>3. The Git Workflow (PR)</h3>
                         <p>To make your changes live on the website, you must:</p>
                         <ul className={styles.gitSteps}>
                              <li><span className={styles.stepNum}>A</span> **Commit** your changes in VS Code or Git.</li>
                              <li><span className={styles.stepNum}>B</span> **Push** to your fork on GitHub.</li>
                              <li><span className={styles.stepNum}>C</span> Open a **Pull Request** to merge into the main branch.</li>
                         </ul>
                    </div>

                    <button className={styles.btnPrimary} onClick={onClose} style={{ width: '100%', marginTop: '1rem' }}>Got it, thanks!</button>
               </div>
          </div>
     );
};

const UnsavedChangesModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) => (
     <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="⚠️ Unsaved Changes"
          footer={
               <>
                    <button className={styles.btnSecondary} onClick={onClose}>Stay and Save</button>
                    <button className={styles.btnPrimary} style={{ background: '#ef4444' }} onClick={onConfirm}>Discard Changes</button>
               </>
          }
     >
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
               You have unsaved changes. If you leave now, these changes will be lost forever.
          </p>
     </Modal>
);

const DiffModal = ({ isOpen, onClose, currentData, initialData }: { isOpen: boolean, onClose: () => void, currentData: CategoryData, initialData: CategoryData | null }) => {
     if (!initialData || !isOpen) return null;

     const metadataDiff: { label: string, old: string | number | Playlist[], new: string | number | Playlist[] }[] = [];
     const fields: (keyof CategoryData)[] = ['name', 'slug', 'description', 'icon'];
     fields.forEach(f => {
          if (currentData[f] !== initialData[f]) {
               metadataDiff.push({ label: f, old: initialData[f], new: currentData[f] });
          }
     });

     // Simple playlist diffing
     const initialPlaylists = initialData.playlists || [];
     const currentPlaylists = currentData.playlists || [];

     const diffView = (
          <div className={styles.diffList}>
               {metadataDiff.length > 0 && (
                    <div>
                         <span className={styles.diffLabel}>Metadata Changes</span>
                         {metadataDiff.map(d => (
                              <div key={d.label} className={styles.diffItem}>
                                   <span className={styles.diffLabel}>{d.label}</span>
                                   <div className={styles.diffValues}>
                                        <span className={styles.diffOld}>{Array.isArray(d.old) ? `${d.old.length} items` : (d.old || '(empty)')}</span>
                                        <span className={styles.diffArrow}>→</span>
                                        <span className={styles.diffNew}>{Array.isArray(d.new) ? `${d.new.length} items` : d.new}</span>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               <div>
                    <span className={styles.diffLabel}>Playlist Changes</span>
                    {currentPlaylists.length > initialPlaylists.length && (
                         <div className={styles.diffItem}>
                              <span className={`${styles.diffTag} ${styles.tagAdd}`}>+ {currentPlaylists.length - initialPlaylists.length} New Playlists Added</span>
                         </div>
                    )}
                    {currentPlaylists.length < initialPlaylists.length && (
                         <div className={styles.diffItem}>
                              <span className={`${styles.diffTag} ${styles.tagRem}`}>- {initialPlaylists.length - currentPlaylists.length} Playlists Removed</span>
                         </div>
                    )}
                    {currentPlaylists.length === initialPlaylists.length && (
                         <div className={styles.diffItem}>
                              <span className={`${styles.diffTag} ${styles.tagMod}`}>Playlists content modified</span>
                         </div>
                    )}
               </div>
          </div>
     );

     return (
          <Modal isOpen={isOpen} onClose={onClose} title="Review Your Changes" footer={<button className={styles.btnPrimary} onClick={onClose}>Close Review</button>}>
               {diffView}
          </Modal>
     );
};

// --- Generic Modal Components ---

const Modal = ({ isOpen, onClose, title, children, footer }: { isOpen: boolean, onClose: () => void, title: React.ReactNode, children: React.ReactNode, footer?: React.ReactNode }) => {
     if (!isOpen) return null;
     return (
          <div className={styles.modalOverlay} onClick={onClose}>
               <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                         <span style={{ fontSize: '1.1rem' }}>{title}</span>
                         <button className={styles.btnSecondary} onClick={onClose} style={{ padding: '4px 8px', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
                    </div>
                    <div className={styles.modalBody} style={{ padding: '1.5rem', background: '#09090b' }}>
                         {children}
                    </div>
                    {footer && (
                         <div className={styles.modalFooter}>
                              {footer}
                         </div>
                    )}
               </div>
          </div>
     );
};

const InputModal = ({ isOpen, onClose, onSubmit, title, placeholder, buttonText = "Create" }: { isOpen: boolean, onClose: () => void, onSubmit: (val: string) => void, title: string, placeholder: string, buttonText?: string }) => {
     const [value, setValue] = useState('');

     const handleSubmit = () => {
          if (value.trim()) {
               onSubmit(value);
               setValue('');
               onClose();
          }
     };

     if (!isOpen) return null;

     return (
          <Modal
               isOpen={isOpen}
               onClose={onClose}
               title={title}
               footer={
                    <>
                         <button className={styles.btnSecondary} onClick={onClose}>Cancel</button>
                         <button className={styles.btnPrimary} onClick={handleSubmit}>{buttonText}</button>
                    </>
               }
          >
               <div className={styles.formGroup}>
                    <input
                         autoFocus
                         className={styles.inputField}
                         placeholder=" "
                         value={value}
                         onChange={(e) => setValue(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <label className={styles.inputLabel}>{placeholder}</label>
               </div>
          </Modal>
     );
};

const JsonModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: CategoryData | null }) => (
     <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Raw JSON Source"
          footer={
               <>
                    <button className={styles.btnSecondary} onClick={() => { navigator.clipboard.writeText(JSON.stringify(data, null, 4)); }}>Copy to Clipboard</button>
                    <button className={styles.btnPrimary} onClick={onClose}>Done</button>
               </>
          }
     >
          <pre className={styles.codeBlock} style={{ padding: 0, height: '100%', maxHeight: '60vh' }}>
               {JSON.stringify(data, null, 4)}
          </pre>
     </Modal>
);

// --- Main Page Component ---

export default function EditDataPage() {
     const [files, setFiles] = useState<FileMetadata[]>([]);
     const [selectedFile, setSelectedFile] = useState<string | null>(null);
     const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
     const [initialData, setInitialData] = useState<CategoryData | null>(null);
     const [sidebarSearch, setSidebarSearch] = useState('');

     // Polish States
     const [toasts, setToasts] = useState<Toast[]>([]);
     const [showJsonModal, setShowJsonModal] = useState(false);
     const [showCreateModal, setShowCreateModal] = useState(false);
     const [showGitOverlay, setShowGitOverlay] = useState(false);
     const [showGuide, setShowGuide] = useState(false);
     const [showDiff, setShowDiff] = useState(false);
     const [showUnsavedModal, setShowUnsavedModal] = useState(false);
     const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

     const isDirty = useMemo(() => {
          if (!categoryData || !initialData) return false;
          return JSON.stringify(categoryData) !== JSON.stringify(initialData);
     }, [categoryData, initialData]);

     const addToast = (text: string, type: 'success' | 'error') => {
          const id = Date.now();
          setToasts(prev => [...prev, { id, text, type }]);
          setTimeout(() => {
               setToasts(prev => prev.filter(t => t.id !== id));
          }, 3000);
     };

     const removeToast = (id: number) => {
          setToasts(prev => prev.filter(t => t.id !== id));
     };

     async function loadFiles() {
          const fileList = await getFilesWithMetadata();
          setFiles(fileList);
     }

     useEffect(() => {
          const init = async () => {
               await loadFiles();
          };
          init();
     }, []);

     const handleFileSelect = async (filename: string) => {
          if (isDirty && selectedFile !== filename) {
               setPendingNavigation(filename);
               setShowUnsavedModal(true);
               return;
          }
          setSelectedFile(filename);
          const content = await getFileContent(filename);
          if (content) {
               try {
                    const parsed = JSON.parse(content);
                    setCategoryData(parsed);
                    setInitialData(parsed);
               } catch (error) {
                    console.error("Failed to parse file", error);
                    addToast("Failed to parse file content", 'error');
               }
          }
     };

     const confirmNavigation = () => {
          if (pendingNavigation) {
               const target = pendingNavigation;
               setPendingNavigation(null);
               setShowUnsavedModal(false);
               setInitialData(null); // Force reset dirty state for next load
               setCategoryData(null);
               handleFileSelect(target);
          }
     };

     const handleCreateCategory = async (name: string) => {
          const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          const newCategory = { ...DEFAULT_CATEGORY, name, slug };

          const result = await createFile(slug, JSON.stringify(newCategory, null, 4));
          if (result.success) {
               await loadFiles();
               handleFileSelect(`${slug}.json`);
               addToast(`Created ${slug}`, 'success');
          } else {
               addToast(result.error || 'Failed to create', 'error');
          }
     };

     const handleSave = async () => {
          if (!selectedFile || !categoryData) return;
          // Optimistic UI could go here, but waiting is safer for backend sync
          const result = await saveFileContent(selectedFile, JSON.stringify(categoryData, null, 4));
          if (result.success) {
               addToast('Saved successfully!', 'success');
               setInitialData(categoryData); // Up-to-date now
               setShowGitOverlay(true);
               loadFiles();
          } else {
               addToast(result.error || 'Save failed', 'error');
          }
     };

     const filteredFiles = useMemo(() => {
          return files.filter(f => f.name.toLowerCase().includes(sidebarSearch.toLowerCase()) || f.filename.includes(sidebarSearch));
     }, [files, sidebarSearch]);

     const handlePlaylistChange = (index: number, newPlaylist: Playlist) => {
          if (!categoryData) return;
          const newPlaylists = [...categoryData.playlists];
          newPlaylists[index] = newPlaylist;
          setCategoryData({ ...categoryData, playlists: newPlaylists });
     };

     const addPlaylist = () => {
          if (!categoryData) return;
          setCategoryData({ ...categoryData, playlists: [...categoryData.playlists, PLAYLIST_TEMPLATE] });
     };

     const deletePlaylist = (index: number) => {
          if (!categoryData) return;
          const newPlaylists = categoryData.playlists.filter((_, i) => i !== index);
          setCategoryData({ ...categoryData, playlists: newPlaylists });
     };

     const renderIcon = (iconStr: string) => {
          if (iconStr?.startsWith('http')) return <Image src={iconStr} alt="" width={18} height={18} objectFit="contain" unoptimized />;
          return iconStr;
     };

     return (
          <div className={styles.container}>
               <Toaster toasts={toasts} removeToast={removeToast} />
               <JsonModal isOpen={showJsonModal} onClose={() => setShowJsonModal(false)} data={categoryData} />
               <GitReminderOverlay isOpen={showGitOverlay} onClose={() => setShowGitOverlay(false)} />
               <GuideOverlay isOpen={showGuide} onClose={() => setShowGuide(false)} />
               <DiffModal isOpen={showDiff} onClose={() => setShowDiff(false)} currentData={categoryData!} initialData={initialData} />
               <UnsavedChangesModal isOpen={showUnsavedModal} onClose={() => setShowUnsavedModal(false)} onConfirm={confirmNavigation} />
               <InputModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateCategory}
                    title="Create New Category"
                    placeholder="Category Name (e.g., Cloud Computing)"
               />

               {/* Sidebar */}
               <div className={styles.sidebar}>
                    <Link href="/" className={styles.backLink}>
                         <span>←</span> Back to Website
                    </Link>
                    <div className={styles.sidebarHeader}>
                         <div className={styles.sidebarTitle}>Data Manager</div>
                         <div className={styles.searchContainer}>
                              <span className={styles.searchIcon}>🔍</span>
                              <input
                                   className={styles.searchInput}
                                   placeholder="Search categories..."
                                   value={sidebarSearch}
                                   onChange={(e) => setSidebarSearch(e.target.value)}
                              />
                         </div>
                    </div>

                    <ul className={styles.fileList}>
                         {filteredFiles.map(file => (
                              <li
                                   key={file.filename}
                                   className={`${styles.fileItem} ${selectedFile === file.filename ? styles.activeFile : ''}`}
                                   onClick={() => handleFileSelect(file.filename)}
                              >
                                   <span className={styles.itemIcon}>{renderIcon(file.icon)}</span>
                                   <span className={styles.itemName}>{file.name}</span>
                              </li>
                         ))}
                    </ul>

                    <button className={styles.addCategoryBtn} onClick={() => setShowCreateModal(true)}>
                         <span>+</span> New Category
                    </button>
               </div>

               {/* Main Editor Area */}
               <div className={styles.editorArea}>
                    {categoryData ? (
                         <>
                              <div className={styles.editorHeader}>
                                   <div>
                                        <div className={styles.headerBreadcrumbs}>Edit Data / {categoryData.name}</div>
                                        <div className={styles.headerTitle}>{categoryData.name}</div>
                                   </div>
                                   <div className={styles.actionButtons}>
                                        <button className={styles.infoBtn} onClick={() => setShowGuide(true)} title="How to use">ⓘ</button>
                                        <button className={styles.btnSecondary} onClick={() => setShowJsonModal(true)}>Raw JSON</button>

                                        <button className={styles.btnPrimary} onClick={handleSave}>Save Changes</button>
                                   </div>
                              </div>

                              <div className={styles.editorContent}>
                                   {/* Left: Metadata */}
                                   <MetadataPanel data={categoryData} onChange={setCategoryData} />

                                   {/* Right: Content (Playlists) */}
                                   <div className={styles.contentPanel}>
                                        <div className={styles.sectionHeader}>
                                             <div className={styles.sectionTitle}>Playlists ({categoryData.playlists?.length || 0})</div>
                                             <button className={styles.btnSecondary} onClick={addPlaylist}>+ Add Playlist</button>
                                        </div>

                                        <div className={styles.playlistGrid}>
                                             {categoryData.playlists?.map((playlist, idx) => (
                                                  <PlaylistCard
                                                       key={idx}
                                                       playlist={playlist}
                                                       onChange={(p) => handlePlaylistChange(idx, p)}
                                                       onDelete={() => deletePlaylist(idx)}
                                                  />
                                             ))}
                                        </div>

                                        {(!categoryData.playlists || categoryData.playlists.length === 0) && (
                                             <div className={styles.emptyState}>
                                                  <span className={styles.emptyIcon}>📭</span>
                                                  <p>No playlists yet.</p>
                                                  <button className={styles.btnSecondary} style={{ marginTop: '1rem' }} onClick={addPlaylist}>Create One</button>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         </>
                    ) : (
                         <div className={styles.emptyState} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <span className={styles.emptyIcon}>👋</span>
                              <h2>Welcome to Data Manager</h2>
                              <p>Select a category from the sidebar to start editing.</p>
                              <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: 'var(--text-tertiary)' }}>
                                   After saving your changes, remember to create a commit and a Pull Request in GitHub or VS Code.
                              </p>
                         </div>
                    )}
               </div>
          </div>
     );
}
