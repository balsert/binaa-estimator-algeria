import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import Konva from 'konva';
import { FloorPlan, Room, Point } from '@/types/floorPlan';
import { WALL_THICKNESS, formatArea, formatDimensions } from '@/utils/floorPlanUtils';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlan;
  selectedRoom: string | null;
  zoom: number;
  offset: Point;
  onRoomSelect: (roomId: string | null) => void;
  onRoomMove: (roomId: string, position: Point) => void;
  onRoomResize: (roomId: string, dimensions: { width: number; height: number }) => void;
  onCanvasClick: (position: Point) => void;
  showGrid?: boolean;
  showDimensions?: boolean;
}

const PIXELS_PER_METER = 50;

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  floorPlan,
  selectedRoom,
  zoom,
  offset,
  onRoomSelect,
  onRoomMove,
  onRoomResize,
  onCanvasClick,
  showGrid = true,
  showDimensions = true
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      const container = stageRef.current?.container();
      if (container) {
        const rect = container.getBoundingClientRect();
        setStageSize({
          width: Math.min(rect.width, 2000),
          height: Math.min(rect.height, 2000)
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const currentFloor = floorPlan.floors[floorPlan.currentFloor];
  const propertyWidth = floorPlan.propertyDimensions.width * PIXELS_PER_METER;
  const propertyHeight = floorPlan.propertyDimensions.height * PIXELS_PER_METER;

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const gridSpacing = floorPlan.gridSize * PIXELS_PER_METER;

    // Vertical lines
    for (let x = 0; x <= propertyWidth; x += gridSpacing) {
      gridLines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, propertyHeight]}
          stroke="#e0e0e0"
          strokeWidth={0.5}
          dash={[2, 2]}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= propertyHeight; y += gridSpacing) {
      gridLines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, propertyWidth, y]}
          stroke="#e0e0e0"
          strokeWidth={0.5}
          dash={[2, 2]}
        />
      );
    }

    return gridLines;
  };

  const renderRoom = (room: Room) => {
    const x = room.position.x * PIXELS_PER_METER;
    const y = room.position.y * PIXELS_PER_METER;
    const width = room.dimensions.width * PIXELS_PER_METER;
    const height = room.dimensions.height * PIXELS_PER_METER;
    const isSelected = room.id === selectedRoom;

    return (
      <Group
        key={room.id}
        x={x}
        y={y}
        draggable
        onDragEnd={(e) => {
          const newPosition = {
            x: e.target.x() / PIXELS_PER_METER,
            y: e.target.y() / PIXELS_PER_METER
          };
          onRoomMove(room.id, newPosition);
        }}
        onClick={() => onRoomSelect(room.id)}
      >
        {/* Room background */}
        <Rect
          width={width}
          height={height}
          fill={room.color}
          stroke={isSelected ? "#1976d2" : "#666"}
          strokeWidth={isSelected ? 3 : 1}
          cornerRadius={4}
        />

        {/* Room walls */}
        <Rect
          width={width}
          height={height}
          stroke="#333"
          strokeWidth={WALL_THICKNESS * PIXELS_PER_METER}
          fill="transparent"
        />

        {/* Room label */}
        <Text
          x={width / 2}
          y={height / 2 - 15}
          text={room.name}
          fontSize={14}
          fontFamily="Noto Sans Arabic"
          fill="#333"
          align="center"
          width={width}
          fontStyle="bold"
        />

        {/* Room dimensions */}
        {showDimensions && (
          <>
            <Text
              x={width / 2}
              y={height / 2}
              text={formatDimensions(room.dimensions)}
              fontSize={12}
              fontFamily="Noto Sans Arabic"
              fill="#666"
              align="center"
              width={width}
            />
            <Text
              x={width / 2}
              y={height / 2 + 15}
              text={formatArea(room.dimensions.width * room.dimensions.height)}
              fontSize={11}
              fontFamily="Noto Sans Arabic"
              fill="#888"
              align="center"
              width={width}
            />
          </>
        )}

        {/* Selection handles */}
        {isSelected && (
          <>
            {/* Corner resize handles */}
            <Rect
              x={width - 8}
              y={height - 8}
              width={16}
              height={16}
              fill="#1976d2"
              stroke="#fff"
              strokeWidth={2}
              cornerRadius={2}
              draggable
              onDragMove={(e) => {
                const newWidth = (e.target.x() + 8) / PIXELS_PER_METER;
                const newHeight = (e.target.y() + 8) / PIXELS_PER_METER;
                onRoomResize(room.id, {
                  width: Math.max(2, newWidth),
                  height: Math.max(2, newHeight)
                });
              }}
            />
          </>
        )}
      </Group>
    );
  };

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      onRoomSelect(null);
      const position = e.target.getStage()?.getPointerPosition();
      if (position) {
        onCanvasClick({
          x: (position.x - offset.x) / (PIXELS_PER_METER * zoom),
          y: (position.y - offset.y) / (PIXELS_PER_METER * zoom)
        });
      }
    }
  };

  return (
    <div className="w-full h-full bg-white border rounded-lg overflow-hidden">
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
      >
        <Layer>
          {/* Property boundary */}
          <Rect
            x={0}
            y={0}
            width={propertyWidth}
            height={propertyHeight}
            stroke="#333"
            strokeWidth={3}
            fill="transparent"
          />

          {/* Grid */}
          {renderGrid()}

          {/* Rooms */}
          {currentFloor.rooms.map(renderRoom)}

          {/* Property dimensions */}
          <Text
            x={propertyWidth / 2}
            y={-30}
            text={`${floorPlan.propertyDimensions.width}م`}
            fontSize={14}
            fontFamily="Noto Sans Arabic"
            fill="#333"
            align="center"
            width={propertyWidth}
          />
          
          <Text
            x={-40}
            y={propertyHeight / 2}
            text={`${floorPlan.propertyDimensions.height}م`}
            fontSize={14}
            fontFamily="Noto Sans Arabic"
            fill="#333"
            align="center"
            rotation={-90}
          />
        </Layer>
      </Stage>
    </div>
  );
};