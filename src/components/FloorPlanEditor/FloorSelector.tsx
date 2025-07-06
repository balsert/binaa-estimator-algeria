import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloorPlan } from '@/types/floorPlan';
import { calculateTotalFloorArea } from '@/utils/floorPlanUtils';

interface FloorSelectorProps {
  floorPlan: FloorPlan;
  currentFloor: number;
  onFloorChange: (floorIndex: number) => void;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  floorPlan,
  currentFloor,
  onFloorChange
}) => {
  return (
    <Card className="card-construction">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-center">الطوابق</h3>
        <div className="grid grid-cols-1 gap-2">
          {floorPlan.floors.map((floor, index) => {
            const isActive = index === currentFloor;
            const roomCount = floor.rooms.length;
            const totalArea = calculateTotalFloorArea(floor);
            
            return (
              <Button
                key={floor.id}
                variant={isActive ? "default" : "outline"}
                className={`w-full justify-between p-3 h-auto ${
                  isActive ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => onFloorChange(index)}
              >
                <div className="text-right">
                  <div className="font-medium">
                    الطابق {floor.level}
                  </div>
                  <div className="text-xs opacity-80">
                    {roomCount} غرفة • {totalArea.toFixed(1)} م²
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {floor.stairs && (
                    <Badge variant="secondary" className="text-xs">
                      درج
                    </Badge>
                  )}
                  <span className="text-2xl">
                    {floor.level === 1 ? '🏠' : '🏢'}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};