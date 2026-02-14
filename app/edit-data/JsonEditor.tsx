import React, { useState } from 'react';
import styles from './page.module.css';
import { Playlist } from './schema';

interface JsonEditorProps {
     data: unknown;
     onChange: (newData: unknown) => void;
     depth?: number;
     propertyName?: string; // The key of this data in the parent
}

const PLAYLIST_TEMPLATE = {
     title: "New Playlist",
     creator: "Creator Name",
     url: "https://youtube.com/...",
     language: "English",
     difficulty: "beginner",
     videoCount: 1,
     description: "Description",
     year: new Date().getFullYear()
};

const FIELD_HINTS: Record<string, string> = {
     title: "e.g., 'React 18 Full Course'",
     creator: "Channel or Author Name",
     url: "Full HTTPs URL",
     slug: "kebab-case-identifier",
     icon: "Emoji or Image URL",
     description: "Brief summary of content",
     language: "e.g., English, Hindi, Spanish"
};

// --- Sub-components ---

const FloatingInput = ({ label, value, onChange, hint }: { label: string, value: string, onChange: (val: string) => void, hint?: string }) => {
     return (
          <div className={styles.floatInputGroup}>
               <input
                    className={styles.floatInput}
                    placeholder=" " /* Empty placeholder needed for CSS selector */
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
               />
               <label className={styles.floatLabel}>{label}</label>
               {hint && <span className={styles.inputHint}>{hint}</span>}
          </div>
     );
};

const PlaylistCard = ({ data, onChange, onDelete }: { data: Playlist, onChange: (d: Playlist) => void, onDelete: () => void }) => {
     const [expanded, setExpanded] = useState(false);

     const handleChange = (key: string, val: string | number) => {
          onChange({ ...data, [key]: val } as Playlist);
     };

     return (
          <div className={`${styles.card} ${expanded ? styles.expanded : ''}`}>
               <div className={styles.cardHeader} onClick={() => setExpanded(!expanded)}>
                    <div className={styles.cardHeaderLeft}>
                         <span className={styles.cardTitle}>{data.title || 'Untitled Playlist'}</span>
                         <span className={styles.cardSubtitle}>{data.creator || 'Unknown Creator'}</span>
                         <div className={styles.cardBadges}>
                              <span className={`${styles.badge} ${styles.badgeBlue}`}>{data.language || 'Lang'}</span>
                              <span className={`${styles.badge} ${styles.badgeGreen}`}>{data.difficulty || 'Level'}</span>
                              <span className={`${styles.badge} ${styles.badgePurple}`}>{data.videoCount || 0} Videos</span>
                         </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <button
                              className={styles.deleteBtn}
                              onClick={(e) => { e.stopPropagation(); onDelete(); }}
                              title="Delete Playlist"
                         >
                              ×
                         </button>
                         <button className={styles.expandBtn}>▼</button>
                    </div>
               </div>
               <div className={styles.cardBody}>
                    {/* Fixed fields for Playlist to ensure order and styling */}
                    <FloatingInput label="Title" value={data.title} onChange={(v) => handleChange('title', v)} hint={FIELD_HINTS.title} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                         <FloatingInput label="Creator" value={data.creator} onChange={(v) => handleChange('creator', v)} hint={FIELD_HINTS.creator} />
                         <FloatingInput label="Language" value={data.language} onChange={(v) => handleChange('language', v)} hint={FIELD_HINTS.language} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                         <FloatingInput label="Topic / Difficulty" value={data.difficulty} onChange={(v) => handleChange('difficulty', v)} hint="beginner | intermediate | advanced" />
                         {/* Reuse FloatingInput for number but cast to string/number */}
                         <div className={styles.floatInputGroup} style={{ width: '100px' }}>
                              <input className={styles.floatInput} placeholder=" " type="number" value={data.videoCount} onChange={(e) => handleChange('videoCount', parseInt(e.target.value) || 0)} />
                              <label className={styles.floatLabel}>Count</label>
                         </div>
                         <div className={styles.floatInputGroup} style={{ width: '100px' }}>
                              <input className={styles.floatInput} placeholder=" " type="number" value={data.year} onChange={(e) => handleChange('year', parseInt(e.target.value) || 0)} />
                              <label className={styles.floatLabel}>Year</label>
                         </div>
                    </div>

                    <FloatingInput label="URL" value={data.url} onChange={(v) => handleChange('url', v)} hint={FIELD_HINTS.url} />
                    <FloatingInput label="Description" value={data.description} onChange={(v) => handleChange('description', v)} hint={FIELD_HINTS.description} />
               </div>
          </div>
     );
};

// --- Main Recursive Editor ---

const JsonEditor: React.FC<JsonEditorProps> = ({ data, onChange, depth = 0, propertyName }) => {
     const getType = (val: unknown) => {
          if (Array.isArray(val)) return 'array';
          if (val === null) return 'null';
          return typeof val;
     };

     const handleUpdate = (key: string | number, value: unknown) => {
          const newData = Array.isArray(data) ? [...data] : { ...(data as Record<string, unknown>) };
          (newData as Record<string | number, unknown>)[key] = value;
          onChange(newData);
     };

     const handleDelete = (key: string | number) => {
          if (Array.isArray(data)) {
               const newData = data.filter((_, index) => index !== key);
               onChange(newData);
          }
     };

     const handleAdd = () => {
          if (Array.isArray(data)) {
               if (propertyName === 'playlists') {
                    onChange([...data, { ...PLAYLIST_TEMPLATE }]);
               } else {
                    onChange([...data, '']);
               }
          }
     };

     // Special render for 'playlists' array
     if (propertyName === 'playlists' && Array.isArray(data)) {
          return (
               <div className={styles.cardList}>
                    {data.map((item, index) => (
                         <PlaylistCard
                              key={index}
                              data={item}
                              onChange={(newItem) => handleUpdate(index, newItem)}
                              onDelete={() => handleDelete(index)}
                         />
                    ))}
                    <button onClick={handleAdd} className={styles.addBtn} style={{ padding: '1rem', marginTop: '0', background: 'rgba(255,255,255,0.05)', borderStyle: 'dashed' }}>
                         + Add New Playlist
                    </button>
               </div>
          );
     }

     // Regular Object Rendering (Main Category Fields)
     if (getType(data) === 'object') {
          return (
               <div className={styles.jsonObj} style={{ marginLeft: depth === 0 ? 0 : 10, paddingLeft: depth === 0 ? 0 : '1rem', borderLeft: depth === 0 ? 'none' : undefined }}>
                    {Object.entries(data as Record<string, unknown>).map(([key, value]) => {
                         // For top-level fields (depth 0), show FloatingInputs directly
                         if (depth === 0 && typeof value !== 'object') {
                              return (
                                   <FloatingInput
                                        key={key}
                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                        value={String(value)}
                                        onChange={(val) => handleUpdate(key, val)}
                                        hint={FIELD_HINTS[key]}
                                   />
                              );
                         }

                         // For arrays/objects
                         return (
                              <div key={key} className={styles.jsonRow} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                   <div className={styles.keyContainer} style={{ marginBottom: '0.5rem' }}>
                                        <span className={styles.keyLabel} style={{ color: '#fff', fontSize: '1.1rem' }}>{key}</span>
                                   </div>
                                   <div className={styles.valueContainer}>
                                        <JsonEditor
                                             data={value}
                                             onChange={(val) => handleUpdate(key, val)}
                                             depth={depth + 1}
                                             propertyName={key}
                                        />
                                   </div>
                              </div>
                         );
                    })}
               </div>
          );
     }

     // Regular Array Rendering (Fallback for non-playlist arrays)
     if (getType(data) === 'array') {
          const dataArray = data as unknown[];
          return (
               <div className={styles.jsonArray}>
                    {dataArray.map((value, index) => (
                         <div key={index} className={styles.jsonRow} style={{ alignItems: 'center' }}>
                              <span className={styles.indexLabel}>{index}:</span>
                              <div className={styles.valueContainer}>
                                   {['object', 'array'].includes(getType(value)) ? (
                                        <JsonEditor
                                             data={value}
                                             onChange={(val) => handleUpdate(index, val)}
                                             depth={depth + 1}
                                        />
                                   ) : (
                                        <input
                                             className={styles.floatInput}
                                             value={String(value)}
                                             onChange={(e) => handleUpdate(index, e.target.value)}
                                             style={{ minHeight: '36px', padding: '5px' }}
                                        />
                                   )}
                              </div>
                              <button onClick={() => handleDelete(index)} className={styles.deleteBtn}>×</button>
                         </div>
                    ))}
                    <button onClick={handleAdd} className={styles.addBtn}>+ Add Item</button>
               </div>
          );
     }

     return (
          <input
               // Basic fallback input
               className={styles.floatInput}
               value={String(data)}
               onChange={(e) => onChange(e.target.value)}
          />
     );
};

export default JsonEditor;
