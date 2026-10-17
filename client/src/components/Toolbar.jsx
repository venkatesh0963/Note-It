import React from 'react';
import {
  MousePointer2,
  Pencil,
  Square,
  Circle,
  Minus,
  Table as TableIcon,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Download,
  Save,
} from 'lucide-react';
import useStore from '../store/useStore';

const COLOR_PRESETS = [
  '#000000',
  '#4f46e5',
  '#0284c7',
  '#059669',
  '#d97706',
  '#dc2626',
  '#9333ea',
];

const Toolbar = ({ onSave }) => {
  const {
    activeTool,
    setActiveTool,
    strokeColor,
    setStrokeColor,
    fillColor,
    setFillColor,
    strokeWidth,
    setStrokeWidth,
    strokeStyle,
    setStrokeStyle,
    tableRows,
    setTableRows,
    tableCols,
    setTableCols,
    undo,
    redo,
    historyIndex,
    history,
  } = useStore();

  const tools = [
    { id: 'select', icon: <MousePointer2 size={18} />, title: 'Select & Move (V)' },
    { id: 'pencil', icon: <Pencil size={18} />, title: 'Pencil (P)' },
    { id: 'rectangle', icon: <Square size={18} />, title: 'Rectangle (R)' },
    { id: 'circle', icon: <Circle size={18} />, title: 'Circle (C)' },
    { id: 'line', icon: <Minus size={18} />, title: 'Line (L)' },
    { id: 'table', icon: <TableIcon size={18} />, title: 'Table Grid (T)' },
    { id: 'text', icon: <Type size={18} />, title: 'Text Box' },
    { id: 'eraser', icon: <Eraser size={18} />, title: 'Eraser (E)' },
  ];

  const handleExportPNG = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `note-it-whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <aside className="w-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col items-center py-3 shadow-sm z-20 overflow-y-auto">
      {/* Primary Drawing Tools */}
      <div className="space-y-1.5 w-full flex flex-col items-center px-2">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-2 rounded-lg transition-all w-11 h-11 flex items-center justify-center relative group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={tool.title}
            >
              {tool.icon}
            </button>
          );
        })}
      </div>

      <div className="w-8 h-px bg-slate-200 dark:bg-slate-700 my-3"></div>

      {/* Stroke Color & Presets */}
      <div className="flex flex-col items-center space-y-3 w-full px-2">
        <div className="relative group flex flex-col items-center">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer border-2 border-slate-200 dark:border-slate-600 p-0 overflow-hidden"
            title="Stroke Color"
          />
        </div>

        {/* Preset Palette */}
        <div className="grid grid-cols-2 gap-1.5">
          {COLOR_PRESETS.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setStrokeColor(c)}
              className={`w-4 h-4 rounded-full border ${
                strokeColor === c ? 'ring-2 ring-indigo-500 scale-110' : 'border-slate-300'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Stroke Width */}
        <div className="w-full flex flex-col items-center gap-1" title="Stroke Width">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Size</span>
          <select
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-full text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded p-1 text-center outline-none"
          >
            <option value={1}>1px</option>
            <option value={2}>2px</option>
            <option value={4}>4px</option>
            <option value={8}>8px</option>
            <option value={12}>12px</option>
          </select>
        </div>

        {/* Stroke Style */}
        <div className="w-full flex flex-col items-center gap-1" title="Stroke Style">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Style</span>
          <select
            value={strokeStyle}
            onChange={(e) => setStrokeStyle(e.target.value)}
            className="w-full text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded p-1 text-center outline-none"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="dash-dot">Dash-Dot</option>
          </select>
        </div>

        {/* Table Rows & Columns (when Table tool selected) */}
        {activeTool === 'table' && (
          <div className="w-full flex flex-col items-center gap-1 pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-[9px] text-indigo-500 font-bold">Rows</span>
            <input
              type="number"
              min="1"
              max="20"
              value={tableRows}
              onChange={(e) => setTableRows(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded p-1 text-center"
            />
            <span className="text-[9px] text-indigo-500 font-bold">Cols</span>
            <input
              type="number"
              min="1"
              max="20"
              value={tableCols}
              onChange={(e) => setTableCols(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white rounded p-1 text-center"
            />
          </div>
        )}
      </div>

      {/* Bottom Actions: Undo, Redo, Save, Export */}
      <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 w-full flex flex-col items-center px-2">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className={`p-2 rounded-lg transition-colors w-11 h-11 flex items-center justify-center ${
            historyIndex > 0
              ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} />
        </button>

        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className={`p-2 rounded-lg transition-colors w-11 h-11 flex items-center justify-center ${
            historyIndex < history.length - 1
              ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} />
        </button>

        <button
          onClick={onSave}
          className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors w-11 h-11 flex items-center justify-center"
          title="Save Board (Ctrl+S)"
        >
          <Save size={18} />
        </button>

        <button
          onClick={handleExportPNG}
          className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors w-11 h-11 flex items-center justify-center"
          title="Export PNG Image"
        >
          <Download size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Toolbar;
