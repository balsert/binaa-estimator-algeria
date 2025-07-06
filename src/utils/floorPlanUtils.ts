import { Room, RoomType, RoomTemplate, Dimensions, Point, FloorPlan, Floor } from '@/types/floorPlan';

export const ROOM_TEMPLATES: Record<RoomType, RoomTemplate> = {
  bedroom: {
    type: 'bedroom',
    name: 'غرفة نوم',
    icon: '🛏️',
    color: '#E3F2FD',
    minDimensions: { width: 2.5, height: 3 },
    defaultDimensions: { width: 3.5, height: 4 }
  },
  bathroom: {
    type: 'bathroom',
    name: 'حمام',
    icon: '🚿',
    color: '#F3E5F5',
    minDimensions: { width: 1.5, height: 2 },
    defaultDimensions: { width: 2, height: 2.5 }
  },
  kitchen: {
    type: 'kitchen',
    name: 'مطبخ',
    icon: '🍳',
    color: '#FFF3E0',
    minDimensions: { width: 2, height: 2.5 },
    defaultDimensions: { width: 3, height: 4 }
  },
  living: {
    type: 'living',
    name: 'صالة معيشة',
    icon: '🛋️',
    color: '#E8F5E8',
    minDimensions: { width: 3, height: 3 },
    defaultDimensions: { width: 5, height: 6 }
  },
  dining: {
    type: 'dining',
    name: 'غرفة طعام',
    icon: '🍽️',
    color: '#FFF8E1',
    minDimensions: { width: 2.5, height: 3 },
    defaultDimensions: { width: 3.5, height: 4 }
  },
  office: {
    type: 'office',
    name: 'مكتب',
    icon: '💼',
    color: '#F1F8E9',
    minDimensions: { width: 2, height: 2.5 },
    defaultDimensions: { width: 3, height: 3.5 }
  },
  storage: {
    type: 'storage',
    name: 'مخزن',
    icon: '📦',
    color: '#FAFAFA',
    minDimensions: { width: 1.5, height: 1.5 },
    defaultDimensions: { width: 2, height: 2 }
  },
  hallway: {
    type: 'hallway',
    name: 'ممر',
    icon: '🚪',
    color: '#F5F5F5',
    minDimensions: { width: 1, height: 2 },
    defaultDimensions: { width: 1.5, height: 4 }
  },
  balcony: {
    type: 'balcony',
    name: 'شرفة',
    icon: '🌿',
    color: '#E0F2F1',
    minDimensions: { width: 1.5, height: 2 },
    defaultDimensions: { width: 2.5, height: 3 }
  },
  garage: {
    type: 'garage',
    name: 'مرآب',
    icon: '🚗',
    color: '#ECEFF1',
    minDimensions: { width: 3, height: 5 },
    defaultDimensions: { width: 4, height: 6 }
  }
};

export const WALL_THICKNESS = 0.2; // 20cm
export const GRID_SIZE = 0.5; // 50cm intervals
export const MIN_ROOM_SIZE = 2; // 2x2 meters minimum
export const MAX_ROOMS_PER_FLOOR = 20;

export function createNewFloorPlan(
  name: string,
  propertyDimensions: Dimensions,
  numberOfFloors: number
): FloorPlan {
  const floors: Floor[] = [];
  
  for (let i = 0; i < numberOfFloors; i++) {
    floors.push({
      id: `floor-${i + 1}`,
      level: i + 1,
      rooms: [],
      stairs: i > 0 ? { x: 1, y: 1 } : undefined
    });
  }

  return {
    id: `fp-${Date.now()}`,
    name,
    propertyDimensions,
    floors,
    currentFloor: 0,
    gridSize: GRID_SIZE,
    wallThickness: WALL_THICKNESS,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export function createRoom(
  type: RoomType,
  position: Point,
  customDimensions?: Dimensions
): Room {
  const template = ROOM_TEMPLATES[type];
  const dimensions = customDimensions || template.defaultDimensions;

  return {
    id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: template.name,
    type,
    position,
    dimensions,
    rotation: 0,
    color: template.color,
    doors: [],
    windows: []
  };
}

export function snapToGrid(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapPointToGrid(point: Point, gridSize: number = GRID_SIZE): Point {
  return {
    x: snapToGrid(point.x, gridSize),
    y: snapToGrid(point.y, gridSize)
  };
}

export function calculateRoomArea(room: Room): number {
  return room.dimensions.width * room.dimensions.height;
}

export function calculateTotalFloorArea(floor: Floor): number {
  return floor.rooms.reduce((total, room) => total + calculateRoomArea(room), 0);
}

export function validateRoomPlacement(
  room: Room,
  existingRooms: Room[],
  propertyDimensions: Dimensions
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check minimum size
  if (room.dimensions.width < MIN_ROOM_SIZE || room.dimensions.height < MIN_ROOM_SIZE) {
    errors.push(`الحد الأدنى لحجم الغرفة هو ${MIN_ROOM_SIZE}×${MIN_ROOM_SIZE} متر`);
  }

  // Check property boundaries
  if (room.position.x < 0 || room.position.y < 0) {
    errors.push('الغرفة خارج حدود العقار');
  }

  if (room.position.x + room.dimensions.width > propertyDimensions.width ||
      room.position.y + room.dimensions.height > propertyDimensions.height) {
    errors.push('الغرفة تتجاوز حدود العقار');
  }

  // Check overlap with existing rooms
  for (const existingRoom of existingRooms) {
    if (existingRoom.id === room.id) continue;

    if (roomsOverlap(room, existingRoom)) {
      errors.push(`تداخل مع غرفة ${existingRoom.name}`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function roomsOverlap(room1: Room, room2: Room): boolean {
  const r1 = {
    left: room1.position.x,
    right: room1.position.x + room1.dimensions.width,
    top: room1.position.y,
    bottom: room1.position.y + room1.dimensions.height
  };

  const r2 = {
    left: room2.position.x,
    right: room2.position.x + room2.dimensions.width,
    top: room2.position.y,
    bottom: room2.position.y + room2.dimensions.height
  };

  return !(r1.right <= r2.left || 
           r1.left >= r2.right || 
           r1.bottom <= r2.top || 
           r1.top >= r2.bottom);
}

export function optimizeRoomArrangement(rooms: Room[], propertyDimensions: Dimensions): Room[] {
  // Simple optimization algorithm - arrange rooms in a grid pattern
  const optimizedRooms = [...rooms];
  const sortedRooms = optimizedRooms.sort((a, b) => {
    const aArea = calculateRoomArea(a);
    const bArea = calculateRoomArea(b);
    return bArea - aArea; // Largest rooms first
  });

  let currentX = WALL_THICKNESS;
  let currentY = WALL_THICKNESS;
  let rowHeight = 0;

  for (const room of sortedRooms) {
    // Check if room fits in current row
    if (currentX + room.dimensions.width + WALL_THICKNESS > propertyDimensions.width) {
      // Move to next row
      currentX = WALL_THICKNESS;
      currentY += rowHeight + WALL_THICKNESS;
      rowHeight = 0;
    }

    // Check if room fits vertically
    if (currentY + room.dimensions.height + WALL_THICKNESS <= propertyDimensions.height) {
      room.position = { x: currentX, y: currentY };
      currentX += room.dimensions.width + WALL_THICKNESS;
      rowHeight = Math.max(rowHeight, room.dimensions.height);
    }
  }

  return optimizedRooms;
}

export function exportFloorPlanToPNG(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

export function formatArea(area: number): string {
  return `${area.toFixed(1)} م²`;
}

export function formatDimensions(dimensions: Dimensions): string {
  return `${dimensions.width.toFixed(1)}×${dimensions.height.toFixed(1)} م`;
}