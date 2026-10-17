import React, { useState } from 'react';
import useStore from '../store/useStore';
import {
  Layers,
  Sliders,
  ChevronUp,
  ChevronDown,
  Trash2,
  Square,
  Circle,
  Minus,
  Table as TableIcon,
  Pencil,
  Type,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const LayersPanel = () => {
  const [activeTab, setActiveTab] = useState('layers'); // 'layers' | 'inspector'
  const [collapsed, setCollapsed] = useState(false);

  const {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    pushToHistory,
    updateElement,
  } = useStore();

  const handlePropChange = (id, key, val) => {
    updateElement(id, { [key]: Number(val) || 0 });
  };

  const handlePropChangeEnd = () => {
    pushToHistory(elements);
  };

  const moveUp = (index) => {
    if (index >= elements.length - 1) return;
    const newElements = [...elements];
    const temp = newElements[index];
    newElements[index] = newElements[index + 1];
    newElements[index + 1] = temp;
    setElements(newElements);
    pushToHistory(newElements);
  };

  const moveDown = (index) => {
    if (index <= 0) return;
    const newElements = [...elements];
    const temp = newElements[index];
    newElements[index] = newElements[index - 1];
    newElements[index - 1] = temp;
    setElements(newElements);
    pushToHistory(newElements);
  };

  const deleteElement = (id) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    pushToHistory(newElements);
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  };

  const getElementIcon = (type) => {
    switch (type) {
      case 'rectangle':
        return <Square size={14} />;
      case 'circle':
        return <Circle size={14} />;
      case 'line':
        return <Minus size={14} />;
      case 'table':
        return <TableIcon size={14} />;
      case 'text':
        return <Type size={14} />;
      default:
        return <Pencil size={14} />;
    }
  };

  if (collapsed) {
    return (
      <div className="bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col items-center py-3 px-1 z-20">
        <button
          onClick={() => setCollapsed(false)}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          title="Expand Panel"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col h-full shadow-sm z-20 transition-all">
      {/* Header & Tabs */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'layers'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Layers size={14} />
            Layers ({elements.length})
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'inspector'
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Sliders size={14} />
            Inspector
          </button>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Collapse Panel"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tab Content: Layers */}
      {activeTab === 'layers' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {elements.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Layers size={28} className="mx-auto mb-2 opacity-40" />
              Canvas is empty. Draw or drop shapes to see layers.
            </div>
          ) : (
            elements
              .slice()
              .reverse()
              .map((element, revIdx) => {
                const originalIndex = elements.length - 1 - revIdx;
                const isSelected = selectedElement?.id === element.id;

                return (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElement(element)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-200 text-indigo-900 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-200 shadow-sm'
                        : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <span className="text-slate-400">{getElementIcon(element.type)}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: element.color || '#000000' }}
                      />
                      <span className="capitalize font-medium truncate">
                        {element.type} {element.text ? `"${element.text.slice(0, 10)}"` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveUp(originalIndex);
                        }}
                        disabled={originalIndex === elements.length - 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                        title="Bring Forward"
                      >
                        <ChevronUp size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveDown(originalIndex);
                        }}
                        disabled={originalIndex === 0}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                        title="Send Backward"
                      >
                        <ChevronDown size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteElement(element.id);
                        }}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded"
                        title="Delete Layer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* Tab Content: Properties Inspector */}
      {activeTab === 'inspector' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedElement ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Sliders size={28} className="mx-auto mb-2 opacity-40" />
              Select any shape or element on the canvas to inspect its exact properties.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-800 dark:text-white capitalize flex items-center gap-1.5">
                  {getElementIcon(selectedElement.type)}
                  {selectedElement.type}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  #{selectedElement.id.slice(0, 6)}
                </span>
              </div>

              {/* Coordinates: X and Y */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-medium block mb-1">X Position</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x || 0)}
                    onChange={(e) => handlePropChange(selectedElement.id, 'x', e.target.value)}
                    onBlur={handlePropChangeEnd}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-medium block mb-1">Y Position</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y || 0)}
                    onChange={(e) => handlePropChange(selectedElement.id, 'y', e.target.value)}
                    onBlur={handlePropChangeEnd}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Dimensions: Width and Height */}
              {['rectangle', 'circle', 'line', 'table'].includes(selectedElement.type) && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">Width</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.width || 0)}
                      onChange={(e) => handlePropChange(selectedElement.id, 'width', e.target.value)}
                      onBlur={handlePropChangeEnd}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">Height</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.height || 0)}
                      onChange={(e) => handlePropChange(selectedElement.id, 'height', e.target.value)}
                      onBlur={handlePropChangeEnd}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Rectangle: Border Radius */}
              {selectedElement.type === 'rectangle' && (
                <div>
                  <label className="text-[10px] text-slate-500 font-medium block mb-1">Corner Radius</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(selectedElement.borderRadius || 0)}
                    onChange={(e) => handlePropChange(selectedElement.id, 'borderRadius', e.target.value)}
                    onBlur={handlePropChangeEnd}
                    className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                  />
                </div>
              )}

              {/* Table: Rows and Columns */}
              {selectedElement.type === 'table' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">Rows</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={selectedElement.rows || 3}
                      onChange={(e) => handlePropChange(selectedElement.id, 'rows', e.target.value)}
                      onBlur={handlePropChangeEnd}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-medium block mb-1">Columns</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={selectedElement.cols || 3}
                      onChange={(e) => handlePropChange(selectedElement.id, 'cols', e.target.value)}
                      onBlur={handlePropChangeEnd}
                      className="w-full px-2 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 rounded text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}

              {/* Stroke & Fill Color Pickers */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Stroke Color</span>
                  <input
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                    onBlur={handlePropChangeEnd}
                    className="w-7 h-7 rounded border border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                </div>

                {['rectangle', 'circle', 'table'].includes(selectedElement.type) && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Fill Color</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const current = selectedElement.fillColor;
                          updateElement(selectedElement.id, {
                            fillColor: current === 'transparent' ? '#e0e7ff' : 'transparent',
                          });
                          pushToHistory(elements);
                        }}
                        className={`text-[10px] px-2 py-1 rounded border ${
                          selectedElement.fillColor === 'transparent'
                            ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 text-slate-600 dark:text-slate-300'
                            : 'border-indigo-500 text-indigo-600'
                        }`}
                      >
                        {selectedElement.fillColor === 'transparent' ? 'None' : 'Solid'}
                      </button>
                      <input
                        type="color"
                        value={
                          selectedElement.fillColor && selectedElement.fillColor !== 'transparent'
                            ? selectedElement.fillColor
                            : '#ffffff'
                        }
                        onChange={(e) => updateElement(selectedElement.id, { fillColor: e.target.value })}
                        onBlur={handlePropChangeEnd}
                        className="w-7 h-7 rounded border border-slate-200 dark:border-slate-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Delete Object Action */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => deleteElement(selectedElement.id)}
                  className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} />
                  Delete Selected Object
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default LayersPanel;
