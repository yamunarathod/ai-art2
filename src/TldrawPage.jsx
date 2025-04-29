import React, { useState, useEffect } from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

const TldrawPage = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      width: '100vw', 
      height: '100vh' 
    }}>
      <Tldraw
        autofocus
        showMenu={false}
        showMultiplayerMenu={false}
        showPages={false}
        showTools={true}
        showZoom={true}
        showStyles={true}
        showUI={true}
        components={{
          Scrim: () => null,  // This removes the loading screen
        }}
        {...size}
      />
    </div>
  );
}

export default TldrawPage;