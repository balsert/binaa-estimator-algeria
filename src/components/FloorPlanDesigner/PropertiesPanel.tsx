import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Trash2, Copy, RotateCw } from 'lucide-react';
import { Wall, Door, Window, Room, Furniture } from '@/types/floorPlan';

interface PropertiesPanelProps {
  selectedElement: any;
  elementType: string;
  onElementUpdate: (elementId: string, updates: any) => void;
  onElementDelete: (elementId: string) => void;
  onElementDuplicate: (elementId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  elementType,
  onElementUpdate,
  onElementDelete,
  onElementDuplicate
}) => {
  const [localElement, setLocalElement] = useState(selectedElement);

  React.useEffect(() => {
    setLocalElement(selectedElement);
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <Card className="w-80">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-muted-foreground">
            Select an element to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    const updatedElement = { ...localElement, [field]: value };
    setLocalElement(updatedElement);
    onElementUpdate(selectedElement.id, { [field]: value });
  };

  const renderWallProperties = (wall: Wall) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Wall Type</Label>
        <Select value={wall.type} onValueChange={(value) => handleUpdate('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="exterior">Exterior</SelectItem>
            <SelectItem value="interior">Interior</SelectItem>
            <SelectItem value="load-bearing">Load Bearing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Thickness (cm)</Label>
        <Input
          type="number"
          value={wall.thickness * 100}
          onChange={(e) => handleUpdate('thickness', parseFloat(e.target.value) / 100)}
          min="10"
          max="50"
        />
      </div>

      <div className="space-y-2">
        <Label>Material</Label>
        <Select value={wall.material} onValueChange={(value) => handleUpdate('material', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brick">Brick</SelectItem>
            <SelectItem value="concrete">Concrete</SelectItem>
            <SelectItem value="wood">Wood Frame</SelectItem>
            <SelectItem value="steel">Steel Frame</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Start Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="X"
            value={wall.start.x}
            onChange={(e) => handleUpdate('start', { ...wall.start, x: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Y"
            value={wall.start.y}
            onChange={(e) => handleUpdate('start', { ...wall.start, y: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>End Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="X"
            value={wall.end.x}
            onChange={(e) => handleUpdate('end', { ...wall.end, x: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Y"
            value={wall.end.y}
            onChange={(e) => handleUpdate('end', { ...wall.end, y: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  const renderDoorProperties = (door: Door) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Door Type</Label>
        <Select value={door.type} onValueChange={(value) => handleUpdate('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="sliding">Sliding</SelectItem>
            <SelectItem value="french">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Width (cm)</Label>
        <Input
          type="number"
          value={door.width * 100}
          onChange={(e) => handleUpdate('width', parseFloat(e.target.value) / 100)}
          min="60"
          max="200"
        />
      </div>

      <div className="space-y-2">
        <Label>Height (cm)</Label>
        <Input
          type="number"
          value={door.height * 100}
          onChange={(e) => handleUpdate('height', parseFloat(e.target.value) / 100)}
          min="180"
          max="250"
        />
      </div>

      <div className="space-y-2">
        <Label>Open Direction</Label>
        <Select value={door.openDirection} onValueChange={(value) => handleUpdate('openDirection', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="inward">Inward</SelectItem>
            <SelectItem value="outward">Outward</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="X"
            value={door.position.x}
            onChange={(e) => handleUpdate('position', { ...door.position, x: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Y"
            value={door.position.y}
            onChange={(e) => handleUpdate('position', { ...door.position, y: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  const renderWindowProperties = (window: Window) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Window Type</Label>
        <Select value={window.type} onValueChange={(value) => handleUpdate('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="bay">Bay</SelectItem>
            <SelectItem value="casement">Casement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Width (cm)</Label>
        <Input
          type="number"
          value={window.width * 100}
          onChange={(e) => handleUpdate('width', parseFloat(e.target.value) / 100)}
          min="40"
          max="300"
        />
      </div>

      <div className="space-y-2">
        <Label>Height (cm)</Label>
        <Input
          type="number"
          value={window.height * 100}
          onChange={(e) => handleUpdate('height', parseFloat(e.target.value) / 100)}
          min="60"
          max="200"
        />
      </div>

      <div className="space-y-2">
        <Label>Sill Height (cm)</Label>
        <Input
          type="number"
          value={window.sillHeight * 100}
          onChange={(e) => handleUpdate('sillHeight', parseFloat(e.target.value) / 100)}
          min="60"
          max="120"
        />
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="X"
            value={window.position.x}
            onChange={(e) => handleUpdate('position', { ...window.position, x: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Y"
            value={window.position.y}
            onChange={(e) => handleUpdate('position', { ...window.position, y: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  const renderRoomProperties = (room: Room) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Room Name</Label>
        <Input
          value={room.name}
          onChange={(e) => handleUpdate('name', e.target.value)}
          placeholder="Enter room name"
        />
      </div>

      <div className="space-y-2">
        <Label>Room Type</Label>
        <Select value={room.type} onValueChange={(value) => handleUpdate('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bedroom">Bedroom</SelectItem>
            <SelectItem value="bathroom">Bathroom</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="living">Living Room</SelectItem>
            <SelectItem value="dining">Dining Room</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
            <SelectItem value="hallway">Hallway</SelectItem>
            <SelectItem value="balcony">Balcony</SelectItem>
            <SelectItem value="garage">Garage</SelectItem>
            <SelectItem value="utility">Utility</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Input
          type="color"
          value={room.color}
          onChange={(e) => handleUpdate('color', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Area: {room.area.toFixed(2)} m²</Label>
      </div>
    </div>
  );

  const renderFurnitureProperties = (furniture: Furniture) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={furniture.name}
          onChange={(e) => handleUpdate('name', e.target.value)}
          placeholder="Enter furniture name"
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={furniture.type} onValueChange={(value) => handleUpdate('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bed">Bed</SelectItem>
            <SelectItem value="sofa">Sofa</SelectItem>
            <SelectItem value="table">Table</SelectItem>
            <SelectItem value="chair">Chair</SelectItem>
            <SelectItem value="cabinet">Cabinet</SelectItem>
            <SelectItem value="appliance">Appliance</SelectItem>
            <SelectItem value="fixture">Fixture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Dimensions</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Width"
            value={furniture.dimensions.width}
            onChange={(e) => handleUpdate('dimensions', { ...furniture.dimensions, width: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Height"
            value={furniture.dimensions.height}
            onChange={(e) => handleUpdate('dimensions', { ...furniture.dimensions, height: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="X"
            value={furniture.position.x}
            onChange={(e) => handleUpdate('position', { ...furniture.position, x: parseFloat(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Y"
            value={furniture.position.y}
            onChange={(e) => handleUpdate('position', { ...furniture.position, y: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Rotation: {furniture.rotation}°</Label>
        <Slider
          value={[furniture.rotation]}
          onValueChange={([value]) => handleUpdate('rotation', value)}
          min={0}
          max={360}
          step={15}
        />
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <Input
          type="color"
          value={furniture.color}
          onChange={(e) => handleUpdate('color', e.target.value)}
        />
      </div>
    </div>
  );

  const renderProperties = () => {
    switch (elementType) {
      case 'wall':
        return renderWallProperties(localElement);
      case 'door':
        return renderDoorProperties(localElement);
      case 'window':
        return renderWindowProperties(localElement);
      case 'room':
        return renderRoomProperties(localElement);
      case 'furniture':
        return renderFurnitureProperties(localElement);
      default:
        return <p>Unknown element type</p>;
    }
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="capitalize">{elementType} Properties</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onElementDuplicate(selectedElement.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onElementDelete(selectedElement.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderProperties()}
      </CardContent>
    </Card>
  );
};