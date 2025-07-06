import { create } from 'zustand';
import { FloorPlan, Point, Wall, Door, Window, Room, Furniture, HistoryAction } from '@/types/floorPlan';

interface FloorPlanState {
  floorPlan: FloorPlan | null;
  selectedTool: string;
  selectedElement: any;
  selectedElementType: string;
  zoom: number;
  offset: Point;
  history: HistoryAction[];
  historyIndex: number;
  
  // Actions
  setFloorPlan: (floorPlan: FloorPlan) => void;
  setSelectedTool: (tool: string) => void;
  setSelectedElement: (element: any, type: string) => void;
  setZoom: (zoom: number) => void;
  setOffset: (offset: Point) => void;
  
  // Element operations
  addWall: (wall: Wall) => void;
  addDoor: (door: Door) => void;
  addWindow: (window: Window) => void;
  addRoom: (room: Room) => void;
  addFurniture: (furniture: Furniture) => void;
  
  updateElement: (elementId: string, elementType: string, updates: any) => void;
  deleteElement: (elementId: string, elementType: string) => void;
  duplicateElement: (elementId: string, elementType: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  addToHistory: (action: HistoryAction) => void;
}

export const useFloorPlanStore = create<FloorPlanState>((set, get) => ({
  floorPlan: null,
  selectedTool: 'select',
  selectedElement: null,
  selectedElementType: '',
  zoom: 1,
  offset: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,

  setFloorPlan: (floorPlan) => set({ floorPlan }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedElement: (element, type) => set({ 
    selectedElement: element, 
    selectedElementType: type 
  }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  setOffset: (offset) => set({ offset }),

  addWall: (wall) => {
    const { floorPlan } = get();
    if (!floorPlan) return;
    
    const updatedFloorPlan = {
      ...floorPlan,
      walls: [...floorPlan.walls, wall],
      updatedAt: new Date()
    };
    
    set({ floorPlan: updatedFloorPlan });
    get().addToHistory({
      id: Date.now().toString(),
      type: 'add',
      elementType: 'wall',
      elementId: wall.id,
      newState: wall,
      timestamp: new Date()
    });
  },

  addDoor: (door) => {
    const { floorPlan } = get();
    if (!floorPlan) return;
    
    const updatedFloorPlan = {
      ...floorPlan,
      doors: [...floorPlan.doors, door],
      updatedAt: new Date()
    };
    
    set({ floorPlan: updatedFloorPlan });
    get().addToHistory({
      id: Date.now().toString(),
      type: 'add',
      elementType: 'door',
      elementId: door.id,
      newState: door,
      timestamp: new Date()
    });
  },

  addWindow: (window) => {
    const { floorPlan } = get();
    if (!floorPlan) return;
    
    const updatedFloorPlan = {
      ...floorPlan,
      windows: [...floorPlan.windows, window],
      updatedAt: new Date()
    };
    
    set({ floorPlan: updatedFloorPlan });
    get().addToHistory({
      id: Date.now().toString(),
      type: 'add',
      elementType: 'window',
      elementId: window.id,
      newState: window,
      timestamp: new Date()
    });
  },

  addRoom: (room) => {
    const { floorPlan } = get();
    if (!floorPlan) return;
    
    const updatedFloorPlan = {
      ...floorPlan,
      rooms: [...floorPlan.rooms, room],
      updatedAt: new Date()
    };
    
    set({ floorPlan: updatedFloorPlan });
    get().addToHistory({
      id: Date.now().toString(),
      type: 'add',
      elementType: 'room',
      elementId: room.id,
      newState: room,
      timestamp: new Date()
    });
  },

  addFurniture: (furniture) => {
    const { floorPlan } = get();
    if (!floorPlan) return;
    
    const updatedFloorPlan = {
      ...floorPlan,
      furniture: [...floorPlan.furniture, furniture],
      updatedAt: new Date()
    };
    
    set({ floorPlan: updatedFloorPlan });
    get().addToHistory({
      id: Date.now().toString(),
      type: 'add',
      elementType: 'furniture',
      elementId: furniture.id,
      newState: furniture,
      timestamp: new Date()
    });
  },

  updateElement: (elementId, elementType, updates) => {
    const { floorPlan } = get();
    if (!floorPlan) return;

    let updatedFloorPlan = { ...floorPlan };
    let previousState: any;

    switch (elementType) {
      case 'wall':
        const wallIndex = floorPlan.walls.findIndex(w => w.id === elementId);
        if (wallIndex !== -1) {
          previousState = floorPlan.walls[wallIndex];
          updatedFloorPlan.walls = [...floorPlan.walls];
          updatedFloorPlan.walls[wallIndex] = { ...previousState, ...updates };
        }
        break;
      case 'door':
        const doorIndex = floorPlan.doors.findIndex(d => d.id === elementId);
        if (doorIndex !== -1) {
          previousState = floorPlan.doors[doorIndex];
          updatedFloorPlan.doors = [...floorPlan.doors];
          updatedFloorPlan.doors[doorIndex] = { ...previousState, ...updates };
        }
        break;
      case 'window':
        const windowIndex = floorPlan.windows.findIndex(w => w.id === elementId);
        if (windowIndex !== -1) {
          previousState = floorPlan.windows[windowIndex];
          updatedFloorPlan.windows = [...floorPlan.windows];
          updatedFloorPlan.windows[windowIndex] = { ...previousState, ...updates };
        }
        break;
      case 'room':
        const roomIndex = floorPlan.rooms.findIndex(r => r.id === elementId);
        if (roomIndex !== -1) {
          previousState = floorPlan.rooms[roomIndex];
          updatedFloorPlan.rooms = [...floorPlan.rooms];
          updatedFloorPlan.rooms[roomIndex] = { ...previousState, ...updates };
        }
        break;
      case 'furniture':
        const furnitureIndex = floorPlan.furniture.findIndex(f => f.id === elementId);
        if (furnitureIndex !== -1) {
          previousState = floorPlan.furniture[furnitureIndex];
          updatedFloorPlan.furniture = [...floorPlan.furniture];
          updatedFloorPlan.furniture[furnitureIndex] = { ...previousState, ...updates };
        }
        break;
    }

    updatedFloorPlan.updatedAt = new Date();
    set({ floorPlan: updatedFloorPlan });

    if (previousState) {
      get().addToHistory({
        id: Date.now().toString(),
        type: 'modify',
        elementType: elementType as any,
        elementId,
        previousState,
        newState: { ...previousState, ...updates },
        timestamp: new Date()
      });
    }
  },

  deleteElement: (elementId, elementType) => {
    const { floorPlan } = get();
    if (!floorPlan) return;

    let updatedFloorPlan = { ...floorPlan };
    let deletedElement: any;

    switch (elementType) {
      case 'wall':
        deletedElement = floorPlan.walls.find(w => w.id === elementId);
        updatedFloorPlan.walls = floorPlan.walls.filter(w => w.id !== elementId);
        break;
      case 'door':
        deletedElement = floorPlan.doors.find(d => d.id === elementId);
        updatedFloorPlan.doors = floorPlan.doors.filter(d => d.id !== elementId);
        break;
      case 'window':
        deletedElement = floorPlan.windows.find(w => w.id === elementId);
        updatedFloorPlan.windows = floorPlan.windows.filter(w => w.id !== elementId);
        break;
      case 'room':
        deletedElement = floorPlan.rooms.find(r => r.id === elementId);
        updatedFloorPlan.rooms = floorPlan.rooms.filter(r => r.id !== elementId);
        break;
      case 'furniture':
        deletedElement = floorPlan.furniture.find(f => f.id === elementId);
        updatedFloorPlan.furniture = floorPlan.furniture.filter(f => f.id !== elementId);
        break;
    }

    updatedFloorPlan.updatedAt = new Date();
    set({ 
      floorPlan: updatedFloorPlan,
      selectedElement: null,
      selectedElementType: ''
    });

    if (deletedElement) {
      get().addToHistory({
        id: Date.now().toString(),
        type: 'remove',
        elementType: elementType as any,
        elementId,
        previousState: deletedElement,
        timestamp: new Date()
      });
    }
  },

  duplicateElement: (elementId, elementType) => {
    const { floorPlan } = get();
    if (!floorPlan) return;

    let elementToDuplicate: any;
    const newId = `${elementType}-${Date.now()}`;

    switch (elementType) {
      case 'wall':
        elementToDuplicate = floorPlan.walls.find(w => w.id === elementId);
        if (elementToDuplicate) {
          const newWall = {
            ...elementToDuplicate,
            id: newId,
            start: { x: elementToDuplicate.start.x + 1, y: elementToDuplicate.start.y + 1 },
            end: { x: elementToDuplicate.end.x + 1, y: elementToDuplicate.end.y + 1 }
          };
          get().addWall(newWall);
        }
        break;
      case 'door':
        elementToDuplicate = floorPlan.doors.find(d => d.id === elementId);
        if (elementToDuplicate) {
          const newDoor = {
            ...elementToDuplicate,
            id: newId,
            position: { x: elementToDuplicate.position.x + 1, y: elementToDuplicate.position.y + 1 }
          };
          get().addDoor(newDoor);
        }
        break;
      case 'window':
        elementToDuplicate = floorPlan.windows.find(w => w.id === elementId);
        if (elementToDuplicate) {
          const newWindow = {
            ...elementToDuplicate,
            id: newId,
            position: { x: elementToDuplicate.position.x + 1, y: elementToDuplicate.position.y + 1 }
          };
          get().addWindow(newWindow);
        }
        break;
      case 'furniture':
        elementToDuplicate = floorPlan.furniture.find(f => f.id === elementId);
        if (elementToDuplicate) {
          const newFurniture = {
            ...elementToDuplicate,
            id: newId,
            position: { x: elementToDuplicate.position.x + 1, y: elementToDuplicate.position.y + 1 }
          };
          get().addFurniture(newFurniture);
        }
        break;
    }
  },

  addToHistory: (action) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    
    // Limit history to 50 actions
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({ 
      history: newHistory, 
      historyIndex: newHistory.length - 1 
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      // Implement undo logic based on action type
      set({ historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const action = history[historyIndex + 1];
      // Implement redo logic based on action type
      set({ historyIndex: historyIndex + 1 });
    }
  }
}));