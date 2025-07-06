import { FloorPlan, ValidationResult, Wall, Door, Window, Room } from '@/types/floorPlan';

export function validateFloorPlan(floorPlan: FloorPlan): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate walls
  validateWalls(floorPlan.walls, errors, warnings);
  
  // Validate doors
  validateDoors(floorPlan.doors, floorPlan.walls, errors, warnings);
  
  // Validate windows
  validateWindows(floorPlan.windows, floorPlan.walls, errors, warnings);
  
  // Validate rooms
  validateRooms(floorPlan.rooms, floorPlan.walls, errors, warnings);
  
  // Validate overall design
  validateOverallDesign(floorPlan, errors, warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function validateWalls(walls: Wall[], errors: string[], warnings: string[]): void {
  walls.forEach((wall, index) => {
    // Check minimum wall length
    const length = Math.sqrt(
      Math.pow(wall.end.x - wall.start.x, 2) + 
      Math.pow(wall.end.y - wall.start.y, 2)
    );
    
    if (length < 0.5) {
      errors.push(`Wall ${index + 1}: Minimum wall length is 0.5m`);
    }
    
    // Check wall thickness
    if (wall.thickness < 0.1 || wall.thickness > 0.5) {
      warnings.push(`Wall ${index + 1}: Wall thickness should be between 10cm and 50cm`);
    }
    
    // Check for overlapping walls
    walls.forEach((otherWall, otherIndex) => {
      if (index !== otherIndex && wallsOverlap(wall, otherWall)) {
        errors.push(`Wall ${index + 1} overlaps with Wall ${otherIndex + 1}`);
      }
    });
  });
}

function validateDoors(doors: Door[], walls: Wall[], errors: string[], warnings: string[]): void {
  doors.forEach((door, index) => {
    // Check door dimensions
    if (door.width < 0.6 || door.width > 2.0) {
      warnings.push(`Door ${index + 1}: Door width should be between 60cm and 200cm`);
    }
    
    if (door.height < 1.8 || door.height > 2.5) {
      warnings.push(`Door ${index + 1}: Door height should be between 180cm and 250cm`);
    }
    
    // Check if door is on a wall
    const associatedWall = walls.find(wall => wall.id === door.wallId);
    if (!associatedWall) {
      errors.push(`Door ${index + 1}: Must be associated with a wall`);
    }
    
    // Check door spacing
    doors.forEach((otherDoor, otherIndex) => {
      if (index !== otherIndex && door.wallId === otherDoor.wallId) {
        const distance = Math.sqrt(
          Math.pow(door.position.x - otherDoor.position.x, 2) + 
          Math.pow(door.position.y - otherDoor.position.y, 2)
        );
        
        if (distance < 0.5) {
          warnings.push(`Door ${index + 1}: Minimum 50cm spacing between doors`);
        }
      }
    });
  });
}

function validateWindows(windows: Window[], walls: Wall[], errors: string[], warnings: string[]): void {
  windows.forEach((window, index) => {
    // Check window dimensions
    if (window.width < 0.4 || window.width > 3.0) {
      warnings.push(`Window ${index + 1}: Window width should be between 40cm and 300cm`);
    }
    
    if (window.height < 0.6 || window.height > 2.0) {
      warnings.push(`Window ${index + 1}: Window height should be between 60cm and 200cm`);
    }
    
    // Check sill height
    if (window.sillHeight < 0.6 || window.sillHeight > 1.2) {
      warnings.push(`Window ${index + 1}: Sill height should be between 60cm and 120cm`);
    }
    
    // Check if window is on a wall
    const associatedWall = walls.find(wall => wall.id === window.wallId);
    if (!associatedWall) {
      errors.push(`Window ${index + 1}: Must be associated with a wall`);
    }
  });
}

function validateRooms(rooms: Room[], walls: Wall[], errors: string[], warnings: string[]): void {
  rooms.forEach((room, index) => {
    // Check room area
    if (room.area < 4) {
      warnings.push(`Room ${room.name}: Minimum room area should be 4m²`);
    }
    
    // Check if room has walls
    if (room.walls.length < 3) {
      errors.push(`Room ${room.name}: Must have at least 3 walls`);
    }
    
    // Validate room type specific requirements
    validateRoomTypeRequirements(room, errors, warnings);
  });
}

function validateRoomTypeRequirements(room: Room, errors: string[], warnings: string[]): void {
  switch (room.type) {
    case 'bedroom':
      if (room.area < 9) {
        warnings.push(`${room.name}: Bedroom should be at least 9m²`);
      }
      break;
    case 'bathroom':
      if (room.area < 3) {
        warnings.push(`${room.name}: Bathroom should be at least 3m²`);
      }
      break;
    case 'kitchen':
      if (room.area < 6) {
        warnings.push(`${room.name}: Kitchen should be at least 6m²`);
      }
      break;
    case 'living':
      if (room.area < 12) {
        warnings.push(`${room.name}: Living room should be at least 12m²`);
      }
      break;
  }
}

function validateOverallDesign(floorPlan: FloorPlan, errors: string[], warnings: string[]): void {
  // Check if there's at least one room
  if (floorPlan.rooms.length === 0) {
    warnings.push('Floor plan should have at least one room');
  }
  
  // Check if there's at least one door
  if (floorPlan.doors.length === 0) {
    warnings.push('Floor plan should have at least one door for access');
  }
  
  // Check room connectivity (simplified)
  const hasMainEntrance = floorPlan.doors.some(door => {
    const wall = floorPlan.walls.find(w => w.id === door.wallId);
    return wall?.type === 'exterior';
  });
  
  if (!hasMainEntrance) {
    errors.push('Floor plan must have at least one entrance door');
  }
}

function wallsOverlap(wall1: Wall, wall2: Wall): boolean {
  // Simplified overlap detection
  const tolerance = 0.1;
  
  return (
    Math.abs(wall1.start.x - wall2.start.x) < tolerance &&
    Math.abs(wall1.start.y - wall2.start.y) < tolerance &&
    Math.abs(wall1.end.x - wall2.end.x) < tolerance &&
    Math.abs(wall1.end.y - wall2.end.y) < tolerance
  );
}