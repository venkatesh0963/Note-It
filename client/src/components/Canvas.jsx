import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import useStore from '../store/useStore';

const Canvas = ({ onCursorMove, remoteCursors = {} }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvas(canvasRef, onCursorMove);
  const { activeTool } = useStore();

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        // Set canvas resolution to container dimensions
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        // Trigger store element redraw by dispatching resize
        useStore.getState().setElements([...useStore.getState().elements]);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCursorClass = () => {
    switch (activeTool) {
      case 'select':
        return 'cursor-default';
      case 'text':
        return 'cursor-text';
      case 'eraser':
        return 'cursor-crosshair';
      case 'pencil':
      case 'line':
      case 'rectangle':
      case 'circle':
      case 'table':
        return 'cursor-crosshair';
      default:
        return 'cursor-default';
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 h-full w-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative select-none touch-none"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className={`bg-white shadow-inner block w-full h-full ${getCursorClass()}`}
      />

      {/* Collaborative Remote Cursors Overlay */}
      {Object.entries(remoteCursors).map(([socketId, cursor]) => {
        if (!cursor || cursor.x === undefined || cursor.y === undefined) return null;
        return (
          <div
            key={socketId}
            className="absolute pointer-events-none transition-all duration-75 flex items-center gap-1.5 z-30"
            style={{
              left: `${cursor.x}px`,
              top: `${cursor.y}px`,
              transform: 'translate(0, 0)',
            }}
          >
            <svg
              className="w-4 h-4 text-indigo-500 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.94c.45 0 .67-.54.35-.85L5.85 2.85a.5.5 0 0 0-.35.36z" />
            </svg>
            <span className="text-[11px] font-medium bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow">
              {cursor.userName || 'Peer'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
