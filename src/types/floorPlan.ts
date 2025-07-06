export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  position: Point;
  dimensions: Dimensions;
  rotation: number;
  color: string;
  doors: Door[];
  windows: Window[];
  isSelected?: boolean;
}

export interface Door {
  id: string;
  position: Point;
  width: number;
  wall: 'north' | 'south' | 'east' | 'west';
  isOpen?: boolean;
}

export interface Window {
  id: string;
  position: Point;
  width: number;
  wall: 'north' | 'south' | 'east' | 'west';
}

export interface FloorPlan {
  id: string;
  name: string;
  propertyDimensions: Dimensions;
  floors: Floor[];
  currentFloor: number;
  gridSize: number;
  wallThickness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Floor {
  id: string;
  level: number;
  rooms: Room[];
  stairs?: Point;
}

export type RoomType = 
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'living'
  | 'dining'
  | 'office'
  | 'storage'
  | 'hallway'
  | 'balcony'
  | 'garage';

export interface FloorPlanState {
  floorPlan: FloorPlan | null;
  selectedRoom: string | null;
  zoom: number;
  offset: Point;
  isEditing: boolean;
  history: FloorPlan[];
  historyIndex: number;
}

export interface RoomTemplate {
  type: RoomType;
  name: string;
  icon: string;
  color: string;
  minDimensions: Dimensions;
  defaultDimensions: Dimensions;
}