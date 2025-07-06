import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FloorPlan, Point } from '@/types/floorPlan';

interface MiniMapProps {
  floorPlan: FloorPlan;
  viewportBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  onViewportChange: (newBounds: { x: number; y: number }) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  floorPlan,
  viewportBounds,
  onViewportChange
}) => {
  const miniMapSize = 200;
  const scale = miniMapSize / Math.max(floorPlan.dimensions.width, floorPlan.dimensions.height);

  const handleClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;
    
    onViewportChange({
      x: x - viewportBounds.width / 2,
      y: y - viewportBounds.height / 2
    });
  };

  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="text-sm">Mini Map</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          width={miniMapSize}
          height={miniMapSize}
          viewBox={`0 0 ${floorPlan.dimensions.width} ${floorPlan.dimensions.height}`}
          className="border cursor-pointer"
          onClick={handleClick}
        >
          {/* Floor plan boundary */}
          <rect
            x={0}
            y={0}
            width={floorPlan.dimensions.width}
            height={floorPlan.dimensions.height}
            fill="white"
            stroke="black"
            strokeWidth={0.1}
          />
          
          {/* Walls */}
          {floorPlan.walls.map((wall) => (
            <line
              key={wall.id}
              x1={wall.start.x}
              y1={wall.start.y}
              x2={wall.end.x}
              y2={wall.end.y}
              stroke="black"
              strokeWidth={wall.thickness}
            />
          ))}
          
          {/* Rooms */}
          {floorPlan.rooms.map((room, index) => (
            <rect
              key={room.id}
              x={index * 2} // Simplified positioning for mini map
              y={index * 2}
              width={2}
              height={2}
              fill={room.color}
              opacity={0.5}
            />
          ))}
          
          {/* Viewport indicator */}
          <rect
            x={viewportBounds.x}
            y={viewportBounds.y}
            width={viewportBounds.width}
            height={viewportBounds.height}
            fill="none"
            stroke="red"
            strokeWidth={0.2}
            strokeDasharray="0.5,0.5"
          />
        </svg>
      </CardContent>
    </Card>
  );
};