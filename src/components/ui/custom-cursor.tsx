"use client"

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input[type="file"], .hover-target')) {
        setIsHovering(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
       if ((e.target as HTMLElement).closest('a, button, input[type="file"], .hover-target')) {
        setIsHovering(false);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const cursorClasses = `custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'clicking' : ''}`;

  return (
    <div className={cursorClasses}>
        <Sparkles
            className="cursor-sparkle"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        />
    </div>
  );
};

export default CustomCursor;
