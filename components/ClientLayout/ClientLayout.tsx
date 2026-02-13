'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import BookLoader from '../BookLoader/BookLoader';

interface ClientLayoutProps {
     children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
     const pathname = usePathname();
     const isTutorialsPage = pathname?.startsWith('/youtube-tutorials');

     // Skip loading for tutorials page, otherwise default to true
     const [isLoading, setIsLoading] = useState(!isTutorialsPage);
     const [fade, setFade] = useState(false);

     useEffect(() => {
          if (isTutorialsPage) return;

          // Simulate loading time for splash effect
          const timer = setTimeout(() => {
               setFade(true); // Start fade out
               setTimeout(() => {
                    setIsLoading(false); // Remove loader
               }, 500); // 500ms transition duration
          }, 2200); // 2.2s loading duration

          return () => clearTimeout(timer);
     }, [isTutorialsPage]);

     return (
          <>
               {isLoading && (
                    <div
                         style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: '#020617', // Match bg-darker
                              zIndex: 9999,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'opacity 0.5s ease-in-out',
                              opacity: fade ? 0 : 1,
                              pointerEvents: fade ? 'none' : 'auto'
                         }}
                    >
                         <BookLoader />
                    </div>
               )}
               <div
                    style={{
                         opacity: isLoading ? 0 : 1,
                         transition: 'opacity 0.5s ease-in-out',
                    }}
               >
                    {children}
               </div>
          </>
     );
};

export default ClientLayout;
