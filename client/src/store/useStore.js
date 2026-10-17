import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Active tool: 'select', 'pencil', 'line', 'rectangle', 'circle', 'table', 'text', 'eraser'
  activeTool: 'pencil',
  setActiveTool: (tool) => set({ activeTool: tool }),

  // Properties
  strokeColor: '#4f46e5',
  setStrokeColor: (color) => {
    set({ strokeColor: color });
    const { selectedElement, updateElement } = get();
    if (selectedElement) {
      updateElement(selectedElement.id, { color });
    }
  },

  fillColor: 'transparent',
  setFillColor: (color) => {
    set({ fillColor: color });
    const { selectedElement, updateElement } = get();
    if (selectedElement) {
      updateElement(selectedElement.id, { fillColor: color });
    }
  },

  strokeWidth: 2,
  setStrokeWidth: (width) => {
    set({ strokeWidth: width });
    const { selectedElement, updateElement } = get();
    if (selectedElement) {
      updateElement(selectedElement.id, { strokeWidth: width });
    }
  },

  strokeStyle: 'solid', // 'solid', 'dashed', 'dotted', 'dash-dot'
  setStrokeStyle: (style) => {
    set({ strokeStyle: style });
    const { selectedElement, updateElement } = get();
    if (selectedElement) {
      updateElement(selectedElement.id, { strokeStyle: style });
    }
  },

  tableRows: 3,
  setTableRows: (rows) => {
    set({ tableRows: rows });
    const { selectedElement, updateElement } = get();
    if (selectedElement && selectedElement.type === 'table') {
      updateElement(selectedElement.id, { rows });
    }
  },

  tableCols: 3,
  setTableCols: (cols) => {
    set({ tableCols: cols });
    const { selectedElement, updateElement } = get();
    if (selectedElement && selectedElement.type === 'table') {
      updateElement(selectedElement.id, { cols });
    }
  },

  // Elements
  elements: [],
  selectedElement: null,
  setSelectedElement: (element) => set({ selectedElement: element }),
  setElements: (elements) => set({ elements }),
  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
  
  updateElement: (id, updatedProperties) => set((state) => {
    const newElements = state.elements.map((el) =>
      el.id === id ? { ...el, ...updatedProperties } : el
    );
    const updatedSelected = state.selectedElement?.id === id 
      ? { ...state.selectedElement, ...updatedProperties } 
      : state.selectedElement;
    return { elements: newElements, selectedElement: updatedSelected };
  }),

  // History for Undo/Redo
  history: [[]],
  historyIndex: 0,

  pushToHistory: (newElements) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    return {
      history: [...newHistory, newElements],
      historyIndex: newHistory.length,
      elements: newElements,
    };
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      return {
        historyIndex: newIndex,
        elements: state.history[newIndex],
        selectedElement: null,
      };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      return {
        historyIndex: newIndex,
        elements: state.history[newIndex],
        selectedElement: null,
      };
    }
    return state;
  }),

  resetStore: () => set({
    elements: [],
    selectedElement: null,
    history: [[]],
    historyIndex: 0,
    activeTool: 'pencil',
  }),
}));

export default useStore;
