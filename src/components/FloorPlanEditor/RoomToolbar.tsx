import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RoomType, ROOM_TEMPLATES } from '@/utils/floorPlanUtils';

interface RoomToolbarProps {
  onRoomTypeSelect: (type: RoomType) => void;
  selectedRoomType: RoomType | null;
}

export const RoomToolbar: React.FC<RoomToolbarProps> = ({
  onRoomTypeSelect,
  selectedRoomType
}) => {
  const roomTypes = Object.values(ROOM_TEMPLATES);

  return (
    <Card className="card-construction">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 text-center">أنواع الغرف</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {roomTypes.map((template) => (
            <motion.div
              key={template.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={selectedRoomType === template.type ? "default" : "outline"}
                className={`w-full h-auto p-3 flex flex-col items-center gap-2 ${
                  selectedRoomType === template.type 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                }`}
                onClick={() => onRoomTypeSelect(template.type)}
              >
                <span className="text-2xl">{template.icon}</span>
                <span className="text-xs text-center leading-tight">
                  {template.name}
                </span>
                <span className="text-xs opacity-70">
                  {template.defaultDimensions.width}×{template.defaultDimensions.height}م
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            انقر على نوع الغرفة ثم انقر على المخطط لإضافتها
          </p>
        </div>
      </CardContent>
    </Card>
  );
};