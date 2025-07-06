import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, RotateCw } from 'lucide-react';
import { Room, RoomType } from '@/types/floorPlan';
import { ROOM_TEMPLATES, formatArea } from '@/utils/floorPlanUtils';

interface RoomPropertiesPanelProps {
  room: Room | null;
  onRoomUpdate: (roomId: string, updates: Partial<Room>) => void;
  onRoomDelete: (roomId: string) => void;
}

export const RoomPropertiesPanel: React.FC<RoomPropertiesPanelProps> = ({
  room,
  onRoomUpdate,
  onRoomDelete
}) => {
  const [localRoom, setLocalRoom] = useState<Room | null>(null);

  useEffect(() => {
    setLocalRoom(room);
  }, [room]);

  if (!localRoom) {
    return (
      <Card className="card-construction">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <p className="text-muted-foreground">
            اختر غرفة لعرض خصائصها
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleUpdate = (field: keyof Room, value: any) => {
    const updatedRoom = { ...localRoom, [field]: value };
    setLocalRoom(updatedRoom);
    onRoomUpdate(localRoom.id, { [field]: value });
  };

  const handleDimensionUpdate = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      const newDimensions = {
        ...localRoom.dimensions,
        [dimension]: numValue
      };
      setLocalRoom(prev => prev ? { ...prev, dimensions: newDimensions } : null);
      onRoomUpdate(localRoom.id, { dimensions: newDimensions });
    }
  };

  const handlePositionUpdate = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      const newPosition = {
        ...localRoom.position,
        [axis]: numValue
      };
      setLocalRoom(prev => prev ? { ...prev, position: newPosition } : null);
      onRoomUpdate(localRoom.id, { position: newPosition });
    }
  };

  const rotateRoom = () => {
    const newRotation = (localRoom.rotation + 90) % 360;
    handleUpdate('rotation', newRotation);
  };

  return (
    <Card className="card-construction">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{ROOM_TEMPLATES[localRoom.type].icon}</span>
            خصائص الغرفة
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={rotateRoom}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRoomDelete(localRoom.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Name */}
        <div className="space-y-2">
          <Label htmlFor="roomName">اسم الغرفة</Label>
          <Input
            id="roomName"
            value={localRoom.name}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="input-arabic"
          />
        </div>

        {/* Room Type */}
        <div className="space-y-2">
          <Label>نوع الغرفة</Label>
          <Select
            value={localRoom.type}
            onValueChange={(value: RoomType) => handleUpdate('type', value)}
          >
            <SelectTrigger className="input-arabic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ROOM_TEMPLATES).map((template) => (
                <SelectItem key={template.type} value={template.type}>
                  <div className="flex items-center gap-2">
                    <span>{template.icon}</span>
                    <span>{template.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dimensions */}
        <div className="space-y-2">
          <Label>الأبعاد (متر)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-xs">العرض</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                min="1"
                value={localRoom.dimensions.width}
                onChange={(e) => handleDimensionUpdate('width', e.target.value)}
                className="input-arabic arabic-numbers"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">الطول</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="1"
                value={localRoom.dimensions.height}
                onChange={(e) => handleDimensionUpdate('height', e.target.value)}
                className="input-arabic arabic-numbers"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label>الموقع (متر)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="posX" className="text-xs">X</Label>
              <Input
                id="posX"
                type="number"
                step="0.1"
                min="0"
                value={localRoom.position.x}
                onChange={(e) => handlePositionUpdate('x', e.target.value)}
                className="input-arabic arabic-numbers"
              />
            </div>
            <div>
              <Label htmlFor="posY" className="text-xs">Y</Label>
              <Input
                id="posY"
                type="number"
                step="0.1"
                min="0"
                value={localRoom.position.y}
                onChange={(e) => handlePositionUpdate('y', e.target.value)}
                className="input-arabic arabic-numbers"
              />
            </div>
          </div>
        </div>

        {/* Area Display */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground">المساحة</div>
          <div className="text-lg font-semibold">
            {formatArea(localRoom.dimensions.width * localRoom.dimensions.height)}
          </div>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <Label>الدوران</Label>
          <div className="text-sm text-muted-foreground">
            {localRoom.rotation}°
          </div>
        </div>
      </CardContent>
    </Card>
  );
};