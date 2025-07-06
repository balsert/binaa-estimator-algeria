import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MousePointer, 
  Square, 
  Minus, 
  DoorOpen, 
  RectangleHorizontal,
  Home,
  Sofa,
  Bed,
  ChefHat,
  Bath,
  Car
} from 'lucide-react';
import { DesignTool } from '@/types/floorPlan';

interface ToolBarProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const tools: DesignTool[] = [
  {
    id: 'select',
    name: 'Select',
    icon: 'MousePointer',
    cursor: 'default',
    active: false
  },
  {
    id: 'wall',
    name: 'Wall',
    icon: 'Minus',
    cursor: 'crosshair',
    active: false
  },
  {
    id: 'door',
    name: 'Door',
    icon: 'DoorOpen',
    cursor: 'crosshair',
    active: false
  },
  {
    id: 'window',
    name: 'Window',
    icon: 'RectangleHorizontal',
    cursor: 'crosshair',
    active: false
  },
  {
    id: 'room',
    name: 'Room',
    icon: 'Square',
    cursor: 'crosshair',
    active: false
  }
];

const furnitureTools = [
  { id: 'bed', name: 'Bed', icon: 'Bed' },
  { id: 'sofa', name: 'Sofa', icon: 'Sofa' },
  { id: 'kitchen', name: 'Kitchen', icon: 'ChefHat' },
  { id: 'bathroom', name: 'Bathroom', icon: 'Bath' },
  { id: 'garage', name: 'Garage', icon: 'Car' }
];

const iconComponents = {
  MousePointer,
  Square,
  Minus,
  DoorOpen,
  RectangleHorizontal,
  Home,
  Sofa,
  Bed,
  ChefHat,
  Bath,
  Car
};

export const ToolBar: React.FC<ToolBarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Drawing Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Drawing Tools</h3>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => {
                const IconComponent = iconComponents[tool.icon as keyof typeof iconComponents];
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToolSelect(tool.id)}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Furniture Tools */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Furniture</h3>
            <div className="grid grid-cols-2 gap-2">
              {furnitureTools.map((tool) => {
                const IconComponent = iconComponents[tool.icon as keyof typeof iconComponents];
                return (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToolSelect(tool.id)}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Room Templates */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Room Templates</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToolSelect('bedroom-template')}
                className="w-full justify-start"
              >
                <Bed className="h-4 w-4 mr-2" />
                Bedroom
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToolSelect('living-template')}
                className="w-full justify-start"
              >
                <Sofa className="h-4 w-4 mr-2" />
                Living Room
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToolSelect('kitchen-template')}
                className="w-full justify-start"
              >
                <ChefHat className="h-4 w-4 mr-2" />
                Kitchen
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};