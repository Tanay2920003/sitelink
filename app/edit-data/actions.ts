'use server';

import fs from 'fs/promises';
import path from 'path';
import { validateCategory } from './schema';

const DATA_DIR = path.join(process.cwd(), 'data');

function validateFilename(filename: string): string {
     if (!filename || typeof filename !== 'string') {
          throw new Error('Invalid filename');
     }
     // path.basename removes any directory components, preventing traversal
     const sanitized = path.basename(filename);
     if (sanitized === '.' || sanitized === '..' || sanitized.startsWith('.')) {
          throw new Error('Invalid filename access');
     }
     return sanitized;
}

export async function getFiles() {
     try {
          const files = await fs.readdir(DATA_DIR);
          return files.filter(file => file.endsWith('.json'));
     } catch (error) {
          console.error('Error reading data directory', error);
          return [];
     }
}

export async function getFilesWithMetadata() {
     try {
          const files = await fs.readdir(DATA_DIR);
          const jsonFiles = files.filter(file => file.endsWith('.json'));

          const metadataList = await Promise.all(jsonFiles.map(async (file) => {
               try {
                    const sanitizedFile = validateFilename(file);
                    const content = await fs.readFile(path.join(DATA_DIR, sanitizedFile), 'utf-8');
                    const data = JSON.parse(content);
                    return {
                         filename: sanitizedFile,
                         name: data.name || sanitizedFile.replace('.json', ''),
                         icon: data.icon || '📄'
                    };
               } catch (e) {
                    console.error('Error reading file metadata', { file, error: e });
                    return {
                         filename: file,
                         name: file.replace('.json', ''),
                         icon: '⚠️'
                    };
               }
          }));

          return metadataList.sort((a, b) => a.name.localeCompare(b.name));
     } catch (error) {
          console.error('Error reading data directory with metadata', error);
          return [];
     }
}

export async function getFileContent(filename: string) {
     try {
          const sanitizedFilename = validateFilename(filename);
          const filePath = path.join(DATA_DIR, sanitizedFilename);
          const content = await fs.readFile(filePath, 'utf-8');
          return content;
     } catch (error) {
          console.error('Error reading file content', { filename, error });
          return null;
     }
}

export async function saveFileContent(filename: string, content: string) {
     try {
          const sanitizedFilename = validateFilename(filename);
          const filePath = path.join(DATA_DIR, sanitizedFilename);
          const jsonData = JSON.parse(content);

          const validation = validateCategory(jsonData);
          if (!validation.success) {
               return { success: false, error: `Validation Error: ${validation.error.issues.map(i => i.message).join(', ')}` };
          }

          await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), 'utf-8');
          return { success: true };
     } catch (error) {
          console.error('Error saving file content', { filename, error });
          return { success: false, error: 'Invalid JSON or write error' };
     }
}

export async function createFile(filename: string, content: string) {
     try {
          let sanitizedFilename = validateFilename(filename);
          if (!sanitizedFilename.endsWith('.json')) {
               sanitizedFilename += '.json';
          }
          // Re-validate after adding extension to be safe
          sanitizedFilename = validateFilename(sanitizedFilename);

          const filePath = path.join(DATA_DIR, sanitizedFilename);

          // Check if file exists
          try {
               await fs.access(filePath);
               return { success: false, error: 'File already exists' };
          } catch {
               // File does not exist, proceed
          }

          const jsonData = JSON.parse(content);
          const validation = validateCategory(jsonData);
          if (!validation.success) {
               return { success: false, error: `Validation Error: ${validation.error.issues.map(i => i.message).join(', ')}` };
          }

          await fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), 'utf-8');
          return { success: true };
     } catch (error) {
          console.error('Error creating file', { filename, error });
          return { success: false, error: 'Failed to create file' };
     }
}
