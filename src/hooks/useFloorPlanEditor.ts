import { useState, useCallback, useEffect } from 'react';
import { FloorPlan, FloorPlanState, Room, Point, Dimensions } from '@/types/floorPlan';
import { AutoSave } from '@/lib/floorPlanDatabase';
import { validateRoomPlacement, snapPointToGrid, WALL_THICKNESS } from '@/utils/floorPlanUtils';

const MAX_HISTORY = 50;

export function useFloorPlanEditor() {
  const [state, setState] = useState<FloorPlanState>({
    floorPlan: null,
    selectedRoom: null,
    zoom: 1,
    offset: { x: 0, y: 0 },
    isEditing: false,
    history: [],
    historyIndex: -1
  });

  const autoSave = AutoSave.getInstance();

  // Auto-save when floor plan changes
  useEffect(() => {
    if (state.floorPlan) {
      autoSave.scheduleAutoSave(state.floorPlan);
    }
  }, [state.floorPlan, autoSave]);

  const addToHistory = useCallback((floorPlan: FloorPlan) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(floorPlan)));
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const setFloorPlan = useCallback((floorPlan: FloorPlan | null) => {
    setState(prev => ({
      ...prev,
      floorPlan,
      selectedRoom: null
    }));

    if (floorPlan) {
      addToHistory(floorPlan);
    }
  }, [addToHistory]);

  const updateFloorPlan = useCallback((updater: (prev: FloorPlan) => FloorPlan) => {
    setState(prev => {
      if (!prev.floorPlan) return prev;
      
      const updated = updater(prev.floorPlan);
      addToHistory(updated);
      
      return {
        ...prev,
        floorPlan: updated
      };
    });
  }, [addToHistory]);

  const addRoom = useCallback((room: Room) => {
    updateFloorPlan(prev => {
      const currentFloor = prev.floors[prev.currentFloor];
      const validation = validateRoomPlacement(room, currentFloor.rooms, prev.propertyDimensions);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const updatedFloors = [...prev.floors];
      updatedFloors[prev.currentFloor] = {
        ...currentFloor,
        rooms: [...currentFloor.rooms, room]
      };

      return {
        ...prev,
        floors: updatedFloors
      };
    });
  }, [updateFloorPlan]);

  const updateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    updateFloorPlan(prev => {
      const currentFloor = prev.floors[prev.currentFloor];
      const roomIndex = currentFloor.rooms.findIndex(r => r.id === roomId);
      
      if (roomIndex === -1) return prev;

      const updatedRoom = { ...currentFloor.rooms[roomIndex], ...updates };
      const otherRooms = currentFloor.rooms.filter(r => r.id !== roomId);
      const validation = validateRoomPlacement(updatedRoom, otherRooms, prev.propertyDimensions);
      
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const updatedRooms = [...currentFloor.rooms];
      updatedRooms[roomIndex] = updatedRoom;

      const updatedFloors = [...prev.floors];
      updatedFloors[prev.currentFloor] = {
        ...currentFloor,
        rooms: updatedRooms
      };

      return {
        ...prev,
        floors: updatedFloors
      };
    });
  }, [updateFloorPlan]);

  const deleteRoom = useCallback((roomId: string) => {
    updateFloorPlan(prev => {
      const currentFloor = prev.floors[prev.currentFloor];
      const updatedRooms = currentFloor.rooms.filter(r => r.id !== roomId);

      const updatedFloors = [...prev.floors];
      updatedFloors[prev.currentFloor] = {
        ...currentFloor,
        rooms: updatedRooms
      };

      return {
        ...prev,
        floors: updatedFloors
      };
    });

    setState(prev => ({
      ...prev,
      selectedRoom: prev.selectedRoom === roomId ? null : prev.selectedRoom
    }));
  }, [updateFloorPlan]);

  const moveRoom = useCallback((roomId: string, newPosition: Point) => {
    const snappedPosition = snapPointToGrid(newPosition);
    updateRoom(roomId, { position: snappedPosition });
  }, [updateRoom]);

  const resizeRoom = useCallback((roomId: string, newDimensions: Dimensions) => {
    updateRoom(roomId, { dimensions: newDimensions });
  }, [updateRoom]);

  const selectRoom = useCallback((roomId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedRoom: roomId
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.max(0.5, Math.min(2, zoom));
    setState(prev => ({
      ...prev,
      zoom: clampedZoom
    }));
  }, []);

  const setOffset = useCallback((offset: Point) => {
    setState(prev => ({
      ...prev,
      offset
    }));
  }, []);

  const switchFloor = useCallback((floorIndex: number) => {
    updateFloorPlan(prev => ({
      ...prev,
      currentFloor: Math.max(0, Math.min(prev.floors.length - 1, floorIndex))
    }));
  }, [updateFloorPlan]);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        return {
          ...prev,
          floorPlan: prev.history[prev.historyIndex - 1],
          historyIndex: prev.historyIndex - 1
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        return {
          ...prev,
          floorPlan: prev.history[prev.historyIndex + 1],
          historyIndex: prev.historyIndex + 1
        };
      }
      return prev;
    });
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return {
    ...state,
    setFloorPlan,
    addRoom,
    updateRoom,
    deleteRoom,
    moveRoom,
    resizeRoom,
    selectRoom,
    setZoom,
    setOffset,
    switchFloor,
    undo,
    redo,
    canUndo,
    canRedo
  };
}