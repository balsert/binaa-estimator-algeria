import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FloorPlanCanvas } from './FloorPlanCanvas';
import { RoomToolbar } from './RoomToolbar';
import { RoomPropertiesPanel } from './RoomPropertiesPanel';
import { FloorPlanControls } from './FloorPlanControls';
import { FloorSelector } from './FloorSelector';
import { useFloorPlanEditor } from '@/hooks/useFloorPlanEditor';
import { FloorPlan, RoomType, Point } from '@/types/floorPlan';
import { createRoom, exportFloorPlanToPNG } from '@/utils/floorPlanUtils';
import { AutoSave } from '@/lib/floorPlanDatabase';
import { useToast } from '@/hooks/use-toast';

interface FloorPlanEditorProps {
  initialFloorPlan: FloorPlan;
  onSave?: (floorPlan: FloorPlan) => void;
}

export const FloorPlanEditor: React.FC<FloorPlanEditorProps> = ({
  initialFloorPlan,
  onSave
}) => {
  const { toast } = useToast();
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);

  const {
    floorPlan,
    selectedRoom,
    zoom,
    offset,
    setFloorPlan,
    addRoom,
    updateRoom,
    deleteRoom,
    moveRoom,
    resizeRoom,
    selectRoom,
    setZoom,
    setOffset,
    switchFloor,
    undo,
    redo,
    canUndo,
    canRedo
  } = useFloorPlanEditor();

  React.useEffect(() => {
    setFloorPlan(initialFloorPlan);
  }, [initialFloorPlan, setFloorPlan]);

  const handleCanvasClick = useCallback((position: Point) => {
    if (selectedRoomType && floorPlan) {
      try {
        const newRoom = createRoom(selectedRoomType, position);
        addRoom(newRoom);
        setSelectedRoomType(null);
        toast({
          title: "تم إضافة الغرفة",
          description: `تم إضافة ${newRoom.name} بنجاح`,
          variant: "default"
        });
      } catch (error) {
        toast({
          title: "خطأ في إضافة الغرفة",
          description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
          variant: "destructive"
        });
      }
    }
  }, [selectedRoomType, floorPlan, addRoom, toast]);

  const handleSave = useCallback(async () => {
    if (floorPlan) {
      try {
        const autoSave = AutoSave.getInstance();
        await autoSave.forceSave();
        
        if (onSave) {
          onSave(floorPlan);
        }
        
        toast({
          title: "تم الحفظ",
          description: "تم حفظ المخطط بنجاح",
          variant: "default"
        });
      } catch (error) {
        toast({
          title: "خطأ في الحفظ",
          description: "حدث خطأ أثناء حفظ المخطط",
          variant: "destructive"
        });
      }
    }
  }, [floorPlan, onSave, toast]);

  const handleExport = useCallback(() => {
    if (floorPlan) {
      // Create a temporary canvas for export
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      
      exportFloorPlanToPNG(canvas, floorPlan.name);
      
      toast({
        title: "تم التصدير",
        description: "تم تصدير المخطط كصورة PNG",
        variant: "default"
      });
    }
  }, [floorPlan, toast]);

  const selectedRoomData = floorPlan && selectedRoom 
    ? floorPlan.floors[floorPlan.currentFloor].rooms.find(r => r.id === selectedRoom)
    : null;

  if (!floorPlan) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المخطط...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-subtle">
      <div className="grid grid-cols-12 gap-4 h-full p-4">
        {/* Left Sidebar */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FloorSelector
              floorPlan={floorPlan}
              currentFloor={floorPlan.currentFloor}
              onFloorChange={switchFloor}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <RoomToolbar
              onRoomTypeSelect={setSelectedRoomType}
              selectedRoomType={selectedRoomType}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FloorPlanControls
              zoom={zoom}
              onZoomChange={setZoom}
              showGrid={showGrid}
              onShowGridChange={setShowGrid}
              showDimensions={showDimensions}
              onShowDimensionsChange={setShowDimensions}
              onSave={handleSave}
              onExport={handleExport}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </motion.div>
        </div>

        {/* Main Canvas */}
        <div className="col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <FloorPlanCanvas
              floorPlan={floorPlan}
              selectedRoom={selectedRoom}
              zoom={zoom}
              offset={offset}
              onRoomSelect={selectRoom}
              onRoomMove={moveRoom}
              onRoomResize={resizeRoom}
              onCanvasClick={handleCanvasClick}
              showGrid={showGrid}
              showDimensions={showDimensions}
            />
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full"
          >
            <RoomPropertiesPanel
              room={selectedRoomData}
              onRoomUpdate={updateRoom}
              onRoomDelete={deleteRoom}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};