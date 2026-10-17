import { useEffect, useState, useRef } from 'react';
import useStore from '../store/useStore';
import { redrawCanvas, drawElement } from '../utils/drawing';
import { getElementAtPosition, getResizeHandle, getBoundingBox } from '../utils/math';

export const useCanvas = (canvasRef, onCursorMove) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);

  const {
    activeTool,
    strokeColor,
    strokeWidth,
    strokeStyle,
    fillColor,
    tableRows,
    tableCols,
    elements,
    addElement,
    pushToHistory,
    selectedElement,
    setSelectedElement,
  } = useStore();

  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Redraw canvas whenever elements, currentElement, or selectedElement changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    redrawCanvas(canvas, ctx, elements);

    // Render shape currently being actively drawn
    if (currentElement) {
      drawElement(ctx, currentElement);
    }

    // Render selection bounding box and corner handles
    if (selectedElement && (!isDrawing || activeTool === 'select')) {
      const el = elements.find((e) => e.id === selectedElement.id);
      if (el) {
        const box = getBoundingBox(el);
        if (box) {
          ctx.save();
          ctx.strokeStyle = '#4f46e5';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);

          const padding = 6;
          const x = box.minX - padding;
          const y = box.minY - padding;
          const w = box.maxX - box.minX + padding * 2;
          const h = box.maxY - box.minY + padding * 2;

          ctx.strokeRect(x, y, w, h);

          // Render 4 corner handles
          if (['rectangle', 'circle', 'line', 'table'].includes(el.type)) {
            const hs = 8;
            const hhs = hs / 2;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#4f46e5';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]);

            const drawHandle = (hx, hy) => {
              ctx.fillRect(hx - hhs, hy - hhs, hs, hs);
              ctx.strokeRect(hx - hhs, hy - hhs, hs, hs);
            };

            drawHandle(box.minX, box.minY); // tl
            drawHandle(box.maxX, box.minY); // tr
            drawHandle(box.minX, box.maxY); // bl
            drawHandle(box.maxX, box.maxY); // br
          }
          ctx.restore();
        }
      }
    }
  }, [elements, currentElement, selectedElement, isDrawing, activeTool, canvasRef]);

  const getCanvasPoint = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasPoint(e);
    setIsDrawing(true);

    // Check if user clicked on a resize handle first
    if (selectedElement) {
      const handle = getResizeHandle(x, y, selectedElement);
      if (handle) {
        setResizeHandle(handle);
        setDragOffset({ x, y });
        useStore.getState().setActiveTool('select');
        return;
      }
    }

    if (activeTool === 'select') {
      const element = getElementAtPosition(x, y, elements);
      if (element) {
        setSelectedElement(element);
        setDragOffset({ x, y });
      } else {
        setSelectedElement(null);
      }
      return;
    }

    // Reset selection when starting to draw a new shape
    setSelectedElement(null);

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      setCurrentElement({
        id: generateId(),
        type: activeTool,
        color: strokeColor,
        strokeWidth,
        strokeStyle: activeTool === 'eraser' ? 'solid' : strokeStyle,
        points: [{ x, y }],
      });
    } else if (['line', 'rectangle', 'circle', 'table'].includes(activeTool)) {
      setCurrentElement({
        id: generateId(),
        type: activeTool,
        x,
        y,
        width: 0,
        height: 0,
        color: strokeColor,
        fillColor,
        strokeWidth,
        strokeStyle,
        borderRadius: 0,
        rows: activeTool === 'table' ? tableRows : undefined,
        cols: activeTool === 'table' ? tableCols : undefined,
      });
    } else if (activeTool === 'text') {
      const text = window.prompt('Enter note text:');
      if (text && text.trim()) {
        const newElement = {
          id: generateId(),
          type: 'text',
          x,
          y,
          text: text.trim(),
          color: strokeColor,
          strokeWidth,
        };
        addElement(newElement);
        pushToHistory([...elements, newElement]);
        setSelectedElement(newElement);
      }
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = getCanvasPoint(e);

    // Notify cursor movement for collaborative view
    if (onCursorMove) {
      onCursorMove({ x, y });
    }

    if (!isDrawing) return;

    if (activeTool === 'select' && selectedElement) {
      const dx = x - dragOffset.x;
      const dy = y - dragOffset.y;

      if (resizeHandle) {
        const updatedElements = elements.map((el) => {
          if (el.id === selectedElement.id) {
            const newEl = { ...el };
            if (resizeHandle === 'tl') {
              newEl.x = el.x + dx;
              newEl.y = el.y + dy;
              newEl.width = (el.width || 0) - dx;
              newEl.height = (el.height || 0) - dy;
            } else if (resizeHandle === 'tr') {
              newEl.y = el.y + dy;
              newEl.width = (el.width || 0) + dx;
              newEl.height = (el.height || 0) - dy;
            } else if (resizeHandle === 'bl') {
              newEl.x = el.x + dx;
              newEl.width = (el.width || 0) - dx;
              newEl.height = (el.height || 0) + dy;
            } else if (resizeHandle === 'br') {
              newEl.width = (el.width || 0) + dx;
              newEl.height = (el.height || 0) + dy;
            }
            return newEl;
          }
          return el;
        });

        setDragOffset({ x, y });
        useStore.getState().setElements(updatedElements);
        return;
      }

      // Move element
      const updatedElements = elements.map((el) => {
        if (el.id === selectedElement.id) {
          if (el.type === 'pencil' || el.type === 'eraser') {
            const newPoints = (el.points || []).map((p) => ({
              x: p.x + dx,
              y: p.y + dy,
            }));
            return { ...el, points: newPoints };
          }
          return {
            ...el,
            x: (el.x || 0) + dx,
            y: (el.y || 0) + dy,
          };
        }
        return el;
      });

      setDragOffset({ x, y });
      useStore.getState().setElements(updatedElements);
      return;
    }

    if (!currentElement) return;

    if (activeTool === 'pencil' || activeTool === 'eraser') {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, { x, y }],
      });
    } else if (['line', 'rectangle', 'circle', 'table'].includes(activeTool)) {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x,
        height: y - currentElement.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    if (activeTool === 'select' && selectedElement) {
      pushToHistory(elements);
      setResizeHandle(null);
    } else if (currentElement) {
      // Minimum dimension check for shape creation to prevent accidental clicks
      const minDimension =
        currentElement.type === 'pencil' || currentElement.type === 'eraser'
          ? currentElement.points.length > 1
          : Math.abs(currentElement.width || 0) > 3 || Math.abs(currentElement.height || 0) > 3;

      if (minDimension) {
        addElement(currentElement);
        pushToHistory([...elements, currentElement]);

        if (['rectangle', 'circle', 'line', 'table'].includes(currentElement.type)) {
          setSelectedElement(currentElement);
        }
      }
      setCurrentElement(null);
    }

    setIsDrawing(false);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
