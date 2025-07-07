import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Group } from 'react-konva';
import Konva from 'konva';
import { FloorPlan, Point, Wall, Door, Window, Room, Furniture } from '@/types/floorPlan';
import { useFloorPlanStore } from '@/stores/floorPlanStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlan;
  selectedTool: string;
  zoom: number;
  offset: Point;
  onElementSelect: (elementId: string, elementType: string) => void;
  onElementMove: (elementId: string, newPosition: Point) => void;
  onCanvasClick: (position: Point) => void;
}

const PIXELS_PER_METER = 50;
const GRID_COLOR = '#e0e0e0';
const WALL_COLOR = '#333333';
const DOOR_COLOR = '#8B4513';
const WINDOW_COLOR = '#87CEEB';

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  floorPlan,
  selectedTool,
  zoom,
  offset,
  onElementSelect,
  onElementMove,
  onCanvasClick
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 });
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateSize = () => {
      const container = stageRef.current?.container();
      if (container) {
        const parent = container.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          // Adjust for mobile - take full available space
          const availableWidth = rect.width - (isMobile ? 0 : 40); // No padding on mobile
          const availableHeight = rect.height - (isMobile ? 0 : 40);
          
          setStageSize({
            width: Math.max(availableWidth, 320), // Minimum width for mobile
            height: Math.max(availableHeight, 400) // Minimum height for mobile
          });
        }
      }
    };

    updateSize();
    
    // More frequent updates for mobile responsive behavior
    const resizeObserver = new ResizeObserver(updateSize);
    const container = stageRef.current?.container();
    if (container?.parentElement) {
      resizeObserver.observe(container.parentElement);
    }
    
    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, [isMobile]);

  const renderGrid = useCallback(() => {
    if (!showGrid) return null;

    const gridLines = [];
    const gridSpacing = floorPlan.gridSize * PIXELS_PER_METER;
    const canvasWidth = floorPlan.dimensions.width * PIXELS_PER_METER;
    const canvasHeight = floorPlan.dimensions.height * PIXELS_PER_METER;

    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSpacing) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, canvasHeight]}
          stroke={GRID_COLOR}
          strokeWidth={0.5}
          dash={[2, 2]}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSpacing) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, canvasWidth, y]}
          stroke={GRID_COLOR}
          strokeWidth={0.5}
          dash={[2, 2]}
        />
      );
    }

    return gridLines;
  }, [showGrid, floorPlan.gridSize, floorPlan.dimensions]);

  const renderWalls = useCallback(() => {
    return floorPlan.walls.map(wall => {
      const startX = wall.start.x * PIXELS_PER_METER;
      const startY = wall.start.y * PIXELS_PER_METER;
      const endX = wall.end.x * PIXELS_PER_METER;
      const endY = wall.end.y * PIXELS_PER_METER;

      return (
        <Group key={wall.id}>
          <Line
            points={[startX, startY, endX, endY]}
            stroke={WALL_COLOR}
            strokeWidth={wall.thickness * PIXELS_PER_METER}
            lineCap="round"
            onClick={() => onElementSelect(wall.id, 'wall')}
            onTap={() => onElementSelect(wall.id, 'wall')}
          />
          {showDimensions && (
            <Text
              x={(startX + endX) / 2}
              y={(startY + endY) / 2 - 10}
              text={`${Math.sqrt(Math.pow(wall.end.x - wall.start.x, 2) + Math.pow(wall.end.y - wall.start.y, 2)).toFixed(2)}m`}
              fontSize={12}
              fill="#666"
              align="center"
            />
          )}
        </Group>
      );
    });
  }, [floorPlan.walls, showDimensions, onElementSelect]);

  const renderDoors = useCallback(() => {
    return floorPlan.doors.map(door => {
      const x = door.position.x * PIXELS_PER_METER;
      const y = door.position.y * PIXELS_PER_METER;
      const width = door.width * PIXELS_PER_METER;
      const height = door.height * PIXELS_PER_METER;

      return (
        <Group
          key={door.id}
          draggable
          onDragEnd={(e) => {
            const newPosition = {
              x: e.target.x() / PIXELS_PER_METER,
              y: e.target.y() / PIXELS_PER_METER
            };
            onElementMove(door.id, newPosition);
          }}
        >
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={DOOR_COLOR}
            stroke="#654321"
            strokeWidth={2}
            cornerRadius={4}
            onClick={() => onElementSelect(door.id, 'door')}
            onTap={() => onElementSelect(door.id, 'door')}
          />
          <Text
            x={x + width / 2}
            y={y + height / 2}
            text="D"
            fontSize={14}
            fill="white"
            align="center"
            fontStyle="bold"
          />
        </Group>
      );
    });
  }, [floorPlan.doors, onElementSelect, onElementMove]);

  const renderWindows = useCallback(() => {
    return floorPlan.windows.map(window => {
      const x = window.position.x * PIXELS_PER_METER;
      const y = window.position.y * PIXELS_PER_METER;
      const width = window.width * PIXELS_PER_METER;
      const height = window.height * PIXELS_PER_METER;

      return (
        <Group
          key={window.id}
          draggable
          onDragEnd={(e) => {
            const newPosition = {
              x: e.target.x() / PIXELS_PER_METER,
              y: e.target.y() / PIXELS_PER_METER
            };
            onElementMove(window.id, newPosition);
          }}
        >
          <Rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={WINDOW_COLOR}
            stroke="#4682B4"
            strokeWidth={2}
            cornerRadius={2}
            onClick={() => onElementSelect(window.id, 'window')}
            onTap={() => onElementSelect(window.id, 'window')}
          />
          <Line
            points={[x, y, x + width, y + height]}
            stroke="#4682B4"
            strokeWidth={1}
          />
          <Line
            points={[x + width, y, x, y + height]}
            stroke="#4682B4"
            strokeWidth={1}
          />
          <Text
            x={x + width / 2}
            y={y + height / 2}
            text="W"
            fontSize={12}
            fill="#2F4F4F"
            align="center"
            fontStyle="bold"
          />
        </Group>
      );
    });
  }, [floorPlan.windows, onElementSelect, onElementMove]);

  const renderRooms = useCallback(() => {
    return floorPlan.rooms.map(room => {
      // Calculate room bounds from walls
      const roomWalls = floorPlan.walls.filter(wall => room.walls.includes(wall.id));
      if (roomWalls.length === 0) return null;

      const points = roomWalls.flatMap(wall => [
        wall.start.x * PIXELS_PER_METER,
        wall.start.y * PIXELS_PER_METER,
        wall.end.x * PIXELS_PER_METER,
        wall.end.y * PIXELS_PER_METER
      ]);

      const minX = Math.min(...points.filter((_, i) => i % 2 === 0));
      const maxX = Math.max(...points.filter((_, i) => i % 2 === 0));
      const minY = Math.min(...points.filter((_, i) => i % 2 === 1));
      const maxY = Math.max(...points.filter((_, i) => i % 2 === 1));

      return (
        <Group key={room.id}>
          <Rect
            x={minX}
            y={minY}
            width={maxX - minX}
            height={maxY - minY}
            fill={room.color}
            opacity={0.3}
            onClick={() => onElementSelect(room.id, 'room')}
            onTap={() => onElementSelect(room.id, 'room')}
          />
          <Text
            x={minX + (maxX - minX) / 2}
            y={minY + (maxY - minY) / 2}
            text={room.name}
            fontSize={16}
            fill="#333"
            align="center"
            fontStyle="bold"
          />
          {showDimensions && (
            <Text
              x={minX + (maxX - minX) / 2}
              y={minY + (maxY - minY) / 2 + 20}
              text={`${room.area.toFixed(1)} m²`}
              fontSize={12}
              fill="#666"
              align="center"
            />
          )}
        </Group>
      );
    });
  }, [floorPlan.rooms, floorPlan.walls, showDimensions, onElementSelect]);

  const renderFurniture = useCallback(() => {
    return floorPlan.furniture.map(furniture => {
      const x = furniture.position.x * PIXELS_PER_METER;
      const y = furniture.position.y * PIXELS_PER_METER;
      const width = furniture.dimensions.width * PIXELS_PER_METER;
      const height = furniture.dimensions.height * PIXELS_PER_METER;

      return (
        <Group
          key={furniture.id}
          x={x}
          y={y}
          rotation={furniture.rotation}
          draggable
          onDragEnd={(e) => {
            const newPosition = {
              x: e.target.x() / PIXELS_PER_METER,
              y: e.target.y() / PIXELS_PER_METER
            };
            onElementMove(furniture.id, newPosition);
          }}
        >
          <Rect
            width={width}
            height={height}
            fill={furniture.color}
            stroke="#8B4513"
            strokeWidth={1}
            cornerRadius={4}
            onClick={() => onElementSelect(furniture.id, 'furniture')}
            onTap={() => onElementSelect(furniture.id, 'furniture')}
          />
          <Text
            x={width / 2}
            y={height / 2}
            text={furniture.name.charAt(0).toUpperCase()}
            fontSize={14}
            fill="#333"
            align="center"
            fontStyle="bold"
          />
        </Group>
      );
    });
  }, [floorPlan.furniture, onElementSelect, onElementMove]);

  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      const position = e.target.getStage()?.getPointerPosition();
      if (position) {
        const adjustedPosition = {
          x: (position.x - offset.x) / (PIXELS_PER_METER * zoom),
          y: (position.y - offset.y) / (PIXELS_PER_METER * zoom)
        };
        onCanvasClick(adjustedPosition);
      }
    }
  }, [offset, zoom, onCanvasClick]);

  return (
    <div className={`w-full h-full bg-white ${isMobile ? 'rounded-none' : 'border rounded-lg'} overflow-hidden relative`}>
      {/* Canvas Controls - Adapted for mobile */}
      <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-10 flex gap-1`}>
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'} rounded transition-all ${
            showGrid 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-white/80 text-muted-foreground border hover:bg-white'
          }`}
        >
          {isMobile ? '⚏' : 'Grid'}
        </button>
        <button
          onClick={() => setShowDimensions(!showDimensions)}
          className={`${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-xs'} rounded transition-all ${
            showDimensions 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'bg-white/80 text-muted-foreground border hover:bg-white'
          }`}
        >
          {isMobile ? '📏' : 'Dimensions'}
        </button>
      </div>

      {/* Mobile Touch Gestures Hint */}
      {isMobile && (
        <div className="absolute bottom-2 left-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded">
          📱 اسحب للتحريك • انقر مرتين للتكبير
        </div>
      )}

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={offset.x}
        y={offset.y}
        onClick={handleStageClick}
        onTap={handleStageClick}
        draggable={isMobile} // Allow dragging on mobile
      >
        <Layer>
          {/* Grid */}
          {renderGrid()}
          
          {/* Floor plan boundary */}
          <Rect
            x={0}
            y={0}
            width={floorPlan.dimensions.width * PIXELS_PER_METER}
            height={floorPlan.dimensions.height * PIXELS_PER_METER}
            stroke="#000"
            strokeWidth={isMobile ? 3 : 2} // Thicker lines for mobile
            fill="transparent"
          />
          
          {/* Rooms (background) */}
          {renderRooms()}
          
          {/* Walls */}
          {renderWalls()}
          
          {/* Doors */}
          {renderDoors()}
          
          {/* Windows */}
          {renderWindows()}
          
          {/* Furniture */}
          {renderFurniture()}
        </Layer>
      </Stage>
    </div>
  );
};