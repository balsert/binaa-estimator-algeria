import { FloorPlan, Wall, Door, Window, Room, Furniture, Point, Dimensions, RoomType } from '@/types/floorPlan';
import { ROOM_TEMPLATES } from '@/utils/floorPlanUtils';

export interface GenerationOptions {
  dimensions: Dimensions;
  bedrooms: number;
  bathrooms: number;
  includeKitchen: boolean;
  includeLiving: boolean;
  includeDining: boolean;
  includeOffice: boolean;
  includeStorage: boolean;
  style: 'modern' | 'traditional' | 'villa' | 'apartment';
}

export function generateProfessionalFloorPlan(options: GenerationOptions): FloorPlan {
  const { dimensions, bedrooms, bathrooms, style } = options;
  
  const floorPlan: FloorPlan = {
    id: `fp-${Date.now()}`,
    name: 'مخطط منزل تلقائي',
    dimensions,
    scale: 1,
    units: 'metric',
    gridSize: 0.5,
    walls: [],
    doors: [],
    windows: [],
    rooms: [],
    furniture: [],
    layers: [
      {
        id: 'walls',
        name: 'الجدران',
        visible: true,
        locked: false,
        opacity: 1,
        elements: []
      },
      {
        id: 'doors-windows',
        name: 'الأبواب والنوافذ',
        visible: true,
        locked: false,
        opacity: 1,
        elements: []
      },
      {
        id: 'furniture',
        name: 'الأثاث',
        visible: true,
        locked: false,
        opacity: 1,
        elements: []
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Generate exterior walls
  generateExteriorWalls(floorPlan, dimensions);
  
  // Generate room layout based on style and requirements
  const roomLayout = generateRoomLayout(options);
  
  // Create interior walls
  generateInteriorWalls(floorPlan, roomLayout, dimensions);
  
  // Create rooms
  generateRooms(floorPlan, roomLayout);
  
  // Add doors and windows
  generateDoorsAndWindows(floorPlan, roomLayout);
  
  // Add furniture
  generateFurniture(floorPlan, roomLayout);

  return floorPlan;
}

function generateExteriorWalls(floorPlan: FloorPlan, dimensions: Dimensions): void {
  const wallThickness = 0.3;
  
  // North wall (top)
  floorPlan.walls.push({
    id: 'wall-north',
    start: { x: 0, y: 0 },
    end: { x: dimensions.width, y: 0 },
    thickness: wallThickness,
    type: 'exterior',
    material: 'concrete'
  });
  
  // East wall (right)
  floorPlan.walls.push({
    id: 'wall-east',
    start: { x: dimensions.width, y: 0 },
    end: { x: dimensions.width, y: dimensions.height },
    thickness: wallThickness,
    type: 'exterior',
    material: 'concrete'
  });
  
  // South wall (bottom)
  floorPlan.walls.push({
    id: 'wall-south',
    start: { x: dimensions.width, y: dimensions.height },
    end: { x: 0, y: dimensions.height },
    thickness: wallThickness,
    type: 'exterior',
    material: 'concrete'
  });
  
  // West wall (left)
  floorPlan.walls.push({
    id: 'wall-west',
    start: { x: 0, y: dimensions.height },
    end: { x: 0, y: 0 },
    thickness: wallThickness,
    type: 'exterior',
    material: 'concrete'
  });
}

interface RoomLayout {
  rooms: Array<{
    id: string;
    type: RoomType;
    name: string;
    bounds: { x: number; y: number; width: number; height: number };
    priority: number;
  }>;
}

function generateRoomLayout(options: GenerationOptions): RoomLayout {
  const { dimensions, bedrooms, bathrooms, style } = options;
  const totalArea = dimensions.width * dimensions.height;
  const layout: RoomLayout = { rooms: [] };
  
  // Define room priorities and size allocations
  const roomAllocations: Array<{
    type: RoomType;
    name: string;
    minArea: number;
    preferredRatio: number;
    priority: number;
    count: number;
  }> = [];

  // Add essential rooms
  if (options.includeLiving) {
    roomAllocations.push({
      type: 'living',
      name: 'صالة المعيشة',
      minArea: Math.max(15, totalArea * 0.25),
      preferredRatio: 1.4,
      priority: 1,
      count: 1
    });
  }

  if (options.includeKitchen) {
    roomAllocations.push({
      type: 'kitchen',
      name: 'المطبخ',
      minArea: Math.max(8, totalArea * 0.12),
      preferredRatio: 1.6,
      priority: 2,
      count: 1
    });
  }

  // Add bedrooms
  for (let i = 0; i < bedrooms; i++) {
    roomAllocations.push({
      type: 'bedroom',
      name: i === 0 ? 'غرفة النوم الرئيسية' : `غرفة النوم ${i + 1}`,
      minArea: i === 0 ? Math.max(12, totalArea * 0.15) : Math.max(10, totalArea * 0.12),
      preferredRatio: 1.2,
      priority: i === 0 ? 3 : 4,
      count: 1
    });
  }

  // Add bathrooms
  for (let i = 0; i < bathrooms; i++) {
    roomAllocations.push({
      type: 'bathroom',
      name: i === 0 ? 'الحمام الرئيسي' : `حمام ${i + 1}`,
      minArea: Math.max(4, totalArea * 0.06),
      preferredRatio: 1.1,
      priority: 5,
      count: 1
    });
  }

  if (options.includeDining) {
    roomAllocations.push({
      type: 'dining',
      name: 'غرفة الطعام',
      minArea: Math.max(8, totalArea * 0.1),
      preferredRatio: 1.3,
      priority: 6,
      count: 1
    });
  }

  if (options.includeOffice) {
    roomAllocations.push({
      type: 'office',
      name: 'المكتب',
      minArea: Math.max(6, totalArea * 0.08),
      preferredRatio: 1.2,
      priority: 7,
      count: 1
    });
  }

  if (options.includeStorage) {
    roomAllocations.push({
      type: 'storage',
      name: 'المخزن',
      minArea: Math.max(3, totalArea * 0.05),
      preferredRatio: 1.0,
      priority: 8,
      count: 1
    });
  }

  // Generate layout based on style
  if (style === 'modern' || style === 'apartment') {
    generateModernLayout(layout, roomAllocations, dimensions);
  } else if (style === 'traditional' || style === 'villa') {
    generateTraditionalLayout(layout, roomAllocations, dimensions);
  }

  return layout;
}

function generateModernLayout(layout: RoomLayout, allocations: any[], dimensions: Dimensions): void {
  const margin = 0.3; // Wall thickness
  const availableWidth = dimensions.width - (2 * margin);
  const availableHeight = dimensions.height - (2 * margin);
  
  // Sort by priority
  allocations.sort((a, b) => a.priority - b.priority);
  
  let currentY = margin;
  let currentRowHeight = 0;
  let remainingWidth = availableWidth;
  let currentX = margin;
  
  allocations.forEach((allocation, index) => {
    const area = allocation.minArea;
    const ratio = allocation.preferredRatio;
    
    // Calculate optimal dimensions
    let width = Math.sqrt(area * ratio);
    let height = area / width;
    
    // Adjust to fit available space
    if (width > remainingWidth) {
      width = remainingWidth;
      height = area / width;
    }
    
    // Check if we need a new row
    if (currentX + width > dimensions.width - margin || remainingWidth < width * 0.7) {
      currentY += currentRowHeight + margin;
      currentX = margin;
      remainingWidth = availableWidth;
      currentRowHeight = 0;
    }
    
    // Ensure room fits in remaining height
    if (currentY + height > dimensions.height - margin) {
      height = (dimensions.height - margin - currentY) * 0.9;
      width = area / height;
    }
    
    layout.rooms.push({
      id: `room-${allocation.type}-${index}`,
      type: allocation.type,
      name: allocation.name,
      bounds: {
        x: currentX,
        y: currentY,
        width: Math.max(width, 2),
        height: Math.max(height, 2)
      },
      priority: allocation.priority
    });
    
    currentX += width + margin;
    remainingWidth -= (width + margin);
    currentRowHeight = Math.max(currentRowHeight, height);
  });
}

function generateTraditionalLayout(layout: RoomLayout, allocations: any[], dimensions: Dimensions): void {
  // Traditional Arabic house layout with central courtyard concept
  const margin = 0.3;
  
  // Create living room in the center-front
  if (allocations.find(a => a.type === 'living')) {
    const livingAllocation = allocations.find(a => a.type === 'living');
    layout.rooms.push({
      id: 'room-living',
      type: 'living',
      name: livingAllocation.name,
      bounds: {
        x: dimensions.width * 0.1,
        y: dimensions.height * 0.1,
        width: dimensions.width * 0.4,
        height: dimensions.height * 0.4
      },
      priority: 1
    });
  }
  
  // Place kitchen adjacent to living
  if (allocations.find(a => a.type === 'kitchen')) {
    const kitchenAllocation = allocations.find(a => a.type === 'kitchen');
    layout.rooms.push({
      id: 'room-kitchen',
      type: 'kitchen',
      name: kitchenAllocation.name,
      bounds: {
        x: dimensions.width * 0.55,
        y: dimensions.height * 0.1,
        width: dimensions.width * 0.35,
        height: dimensions.height * 0.25
      },
      priority: 2
    });
  }
  
  // Place bedrooms in back
  const bedroomAllocations = allocations.filter(a => a.type === 'bedroom');
  bedroomAllocations.forEach((allocation, index) => {
    const roomWidth = dimensions.width / bedroomAllocations.length * 0.8;
    layout.rooms.push({
      id: `room-bedroom-${index}`,
      type: 'bedroom',
      name: allocation.name,
      bounds: {
        x: margin + (index * (roomWidth + margin)),
        y: dimensions.height * 0.6,
        width: roomWidth,
        height: dimensions.height * 0.3
      },
      priority: 3 + index
    });
  });
  
  // Place bathrooms
  const bathroomAllocations = allocations.filter(a => a.type === 'bathroom');
  bathroomAllocations.forEach((allocation, index) => {
    layout.rooms.push({
      id: `room-bathroom-${index}`,
      type: 'bathroom',
      name: allocation.name,
      bounds: {
        x: dimensions.width * 0.75 + (index * 2),
        y: dimensions.height * 0.4,
        width: dimensions.width * 0.15,
        height: dimensions.height * 0.15
      },
      priority: 10 + index
    });
  });
  
  // Add other rooms
  const otherAllocations = allocations.filter(a => 
    !['living', 'kitchen', 'bedroom', 'bathroom'].includes(a.type)
  );
  
  otherAllocations.forEach((allocation, index) => {
    layout.rooms.push({
      id: `room-${allocation.type}-${index}`,
      type: allocation.type,
      name: allocation.name,
      bounds: {
        x: dimensions.width * 0.1 + (index * 3),
        y: dimensions.height * 0.55,
        width: dimensions.width * 0.2,
        height: dimensions.height * 0.2
      },
      priority: 15 + index
    });
  });
}

function generateInteriorWalls(floorPlan: FloorPlan, layout: RoomLayout, dimensions: Dimensions): void {
  const wallThickness = 0.2;
  
  layout.rooms.forEach((room, index) => {
    const { x, y, width, height } = room.bounds;
    
    // Create walls for each room (interior walls)
    // Only create walls that don't overlap with exterior walls
    
    // Top wall (if not touching exterior)
    if (y > 0.5) {
      floorPlan.walls.push({
        id: `wall-${room.id}-top`,
        start: { x, y },
        end: { x: x + width, y },
        thickness: wallThickness,
        type: 'interior',
        material: 'brick'
      });
    }
    
    // Bottom wall (if not touching exterior)
    if (y + height < dimensions.height - 0.5) {
      floorPlan.walls.push({
        id: `wall-${room.id}-bottom`,
        start: { x: x + width, y: y + height },
        end: { x, y: y + height },
        thickness: wallThickness,
        type: 'interior',
        material: 'brick'
      });
    }
    
    // Left wall (if not touching exterior)
    if (x > 0.5) {
      floorPlan.walls.push({
        id: `wall-${room.id}-left`,
        start: { x, y: y + height },
        end: { x, y },
        thickness: wallThickness,
        type: 'interior',
        material: 'brick'
      });
    }
    
    // Right wall (if not touching exterior)
    if (x + width < dimensions.width - 0.5) {
      floorPlan.walls.push({
        id: `wall-${room.id}-right`,
        start: { x: x + width, y },
        end: { x: x + width, y: y + height },
        thickness: wallThickness,
        type: 'interior',
        material: 'brick'
      });
    }
  });
}

function generateRooms(floorPlan: FloorPlan, layout: RoomLayout): void {
  layout.rooms.forEach(roomLayout => {
    const template = ROOM_TEMPLATES[roomLayout.type];
    const area = roomLayout.bounds.width * roomLayout.bounds.height;
    
    floorPlan.rooms.push({
      id: roomLayout.id,
      name: roomLayout.name,
      type: roomLayout.type,
      walls: [], // Will be populated based on surrounding walls
      area,
      color: template.color,
      furniture: []
    });
  });
}

function generateDoorsAndWindows(floorPlan: FloorPlan, layout: RoomLayout): void {
  // Add main entrance door
  floorPlan.doors.push({
    id: 'door-main-entrance',
    position: { x: floorPlan.dimensions.width / 2, y: floorPlan.dimensions.height },
    width: 1.0,
    height: 2.1,
    wallId: 'wall-south',
    type: 'double',
    openDirection: 'inward'
  });
  
  // Add interior doors for each room
  layout.rooms.forEach((room, index) => {
    // Skip bathroom and storage doors on exterior walls
    if (['bathroom', 'storage'].includes(room.type)) {
      // Interior door
      floorPlan.doors.push({
        id: `door-${room.id}`,
        position: { 
          x: room.bounds.x + room.bounds.width / 2, 
          y: room.bounds.y + room.bounds.height 
        },
        width: 0.8,
        height: 2.0,
        wallId: `wall-${room.id}-bottom`,
        type: 'single',
        openDirection: 'inward'
      });
    } else {
      // Regular room door
      floorPlan.doors.push({
        id: `door-${room.id}`,
        position: { 
          x: room.bounds.x + room.bounds.width * 0.8, 
          y: room.bounds.y + room.bounds.height 
        },
        width: 0.9,
        height: 2.1,
        wallId: `wall-${room.id}-bottom`,
        type: 'single',
        openDirection: 'inward'
      });
    }
  });
  
  // Add windows to exterior-facing rooms
  layout.rooms.forEach((room) => {
    const { x, y, width, height } = room.bounds;
    
    // Add windows to rooms touching exterior walls
    if (x < 0.5) { // Touching west wall
      floorPlan.windows.push({
        id: `window-${room.id}-west`,
        position: { x: 0, y: y + height / 2 },
        width: Math.min(1.5, width * 0.4),
        height: 1.2,
        wallId: 'wall-west',
        type: 'single',
        sillHeight: 0.9
      });
    }
    
    if (x + width > floorPlan.dimensions.width - 0.5) { // Touching east wall
      floorPlan.windows.push({
        id: `window-${room.id}-east`,
        position: { x: floorPlan.dimensions.width, y: y + height / 2 },
        width: Math.min(1.5, width * 0.4),
        height: 1.2,
        wallId: 'wall-east',
        type: 'single',
        sillHeight: 0.9
      });
    }
    
    if (y < 0.5) { // Touching north wall
      floorPlan.windows.push({
        id: `window-${room.id}-north`,
        position: { x: x + width / 2, y: 0 },
        width: Math.min(1.5, width * 0.4),
        height: 1.2,
        wallId: 'wall-north',
        type: 'single',
        sillHeight: 0.9
      });
    }
  });
}

function generateFurniture(floorPlan: FloorPlan, layout: RoomLayout): void {
  layout.rooms.forEach((room) => {
    const { x, y, width, height } = room.bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    switch (room.type) {
      case 'bedroom':
        // Bed
        floorPlan.furniture.push({
          id: `furniture-${room.id}-bed`,
          name: 'سرير',
          type: 'bed',
          position: { x: x + 0.5, y: y + 0.5 },
          dimensions: { width: Math.min(2.0, width * 0.6), height: Math.min(1.5, height * 0.4) },
          rotation: 0,
          color: '#8B4513'
        });
        
        // Wardrobe
        if (width > 3) {
          floorPlan.furniture.push({
            id: `furniture-${room.id}-wardrobe`,
            name: 'خزانة',
            type: 'cabinet',
            position: { x: x + width - 0.8, y: y + 0.2 },
            dimensions: { width: 0.6, height: Math.min(2.0, height * 0.5) },
            rotation: 0,
            color: '#654321'
          });
        }
        break;
        
      case 'living':
        // Sofa
        floorPlan.furniture.push({
          id: `furniture-${room.id}-sofa`,
          name: 'أريكة',
          type: 'sofa',
          position: { x: centerX - 1.25, y: centerY - 0.5 },
          dimensions: { width: 2.5, height: 1.0 },
          rotation: 0,
          color: '#654321'
        });
        
        // Coffee table
        floorPlan.furniture.push({
          id: `furniture-${room.id}-table`,
          name: 'طاولة',
          type: 'table',
          position: { x: centerX - 0.6, y: centerY + 0.8 },
          dimensions: { width: 1.2, height: 0.6 },
          rotation: 0,
          color: '#8B4513'
        });
        break;
        
      case 'kitchen':
        // Kitchen cabinets
        floorPlan.furniture.push({
          id: `furniture-${room.id}-cabinets`,
          name: 'خزائن مطبخ',
          type: 'cabinet',
          position: { x: x + 0.2, y: y + 0.2 },
          dimensions: { width: Math.min(3.0, width * 0.8), height: 0.6 },
          rotation: 0,
          color: '#D2691E'
        });
        break;
        
      case 'dining':
        // Dining table
        floorPlan.furniture.push({
          id: `furniture-${room.id}-table`,
          name: 'طاولة طعام',
          type: 'table',
          position: { x: centerX - 0.75, y: centerY - 0.5 },
          dimensions: { width: 1.5, height: 1.0 },
          rotation: 0,
          color: '#8B4513'
        });
        
        // Chairs
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const chairX = centerX + Math.cos(angle) * 1.2;
          const chairY = centerY + Math.sin(angle) * 1.2;
          
          floorPlan.furniture.push({
            id: `furniture-${room.id}-chair-${i}`,
            name: 'كرسي',
            type: 'chair',
            position: { x: chairX, y: chairY },
            dimensions: { width: 0.5, height: 0.5 },
            rotation: (i * 90),
            color: '#654321'
          });
        }
        break;
    }
  });
}