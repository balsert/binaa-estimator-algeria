export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  type: 'exterior' | 'interior' | 'load-bearing';
  material: string;
}

export interface Door {
  id: string;
  position: Point;
  width: number;
  height: number;
  wallId: string;
  type: 'single' | 'double' | 'sliding' | 'french';
  openDirection: 'left' | 'right' | 'inward' | 'outward';
}

export interface Window {
  id: string;
  position: Point;
  width: number;
  height: number;
  wallId: string;
  type: 'single' | 'double' | 'bay' | 'casement';
  sillHeight: number;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  walls: string[];
  area: number;
  color: string;
  furniture: Furniture[];
}

export interface Furniture {
  id: string;
  name: string;
  type: FurnitureType;
  position: Point;
  dimensions: Dimensions;
  rotation: number;
  color: string;
}

export interface FloorPlan {
  id: string;
  name: string;
  dimensions: Dimensions;
  scale: number;
  units: 'metric' | 'imperial';
  gridSize: number;
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  rooms: Room[];
  furniture: Furniture[];
  layers: Layer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  elements: string[];
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
  | 'garage'
  | 'utility';

export type FurnitureType =
  | 'bed'
  | 'sofa'
  | 'table'
  | 'chair'
  | 'cabinet'
  | 'appliance'
  | 'fixture';

export interface DesignTool {
  id: string;
  name: string;
  icon: string;
  cursor: string;
  active: boolean;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  validate: (floorPlan: FloorPlan) => ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface HistoryAction {
  id: string;
  type: 'add' | 'remove' | 'modify' | 'move';
  elementType: 'wall' | 'door' | 'window' | 'room' | 'furniture';
  elementId: string;
  previousState?: any;
  newState?: any;
  timestamp: Date;
}