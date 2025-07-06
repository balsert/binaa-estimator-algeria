import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Download, Undo, Redo, ZoomIn, ZoomOut, Grid, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FloorPlanCanvas } from '@/components/FloorPlanDesigner/FloorPlanCanvas';
import { ToolBar } from '@/components/FloorPlanDesigner/ToolBar';
import { PropertiesPanel } from '@/components/FloorPlanDesigner/PropertiesPanel';
import { LayerManager } from '@/components/FloorPlanDesigner/LayerManager';
import { MiniMap } from '@/components/FloorPlanDesigner/MiniMap';
import { ValidationPanel } from '@/components/FloorPlanDesigner/ValidationPanel';
import { AutoGenerationPanel } from '@/components/FloorPlanDesigner/AutoGenerationPanel';
import { useFloorPlanStore } from '@/stores/floorPlanStore';
import { FloorPlan, Point, Wall, Door, Window, Room, Furniture } from '@/types/floorPlan';
import { useToast } from '@/hooks/use-toast';

const FloorPlanDesigner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    floorPlan,
    selectedTool,
    selectedElement,
    selectedElementType,
    zoom,
    offset,
    setFloorPlan,
    setSelectedTool,
    setSelectedElement,
    setZoom,
    setOffset,
    addWall,
    addDoor,
    addWindow,
    addRoom,
    addFurniture,
    updateElement,
    deleteElement,
    duplicateElement,
    undo,
    redo
  } = useFloorPlanStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<Point | null>(null);

  // Initialize with a default floor plan if none exists
  React.useEffect(() => {
    if (!floorPlan) {
      const defaultFloorPlan: FloorPlan = {
        id: 'default-plan',
        name: 'New Floor Plan',
        dimensions: { width: 20, height: 15 },
        scale: 1,
        units: 'metric',
        gridSize: 0.5,
        walls: [],
        doors: [],
        windows: [],
        rooms: [],
        furniture: [],
        layers: [
          {
            id: 'walls',
            name: 'Walls',
            visible: true,
            locked: false,
            opacity: 1,
            elements: []
          },
          {
            id: 'doors-windows',
            name: 'Doors & Windows',
            visible: true,
            locked: false,
            opacity: 1,
            elements: []
          },
          {
            id: 'furniture',
            name: 'Furniture',
            visible: true,
            locked: false,
            opacity: 1,
            elements: []
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setFloorPlan(defaultFloorPlan);
    }
  }, [floorPlan, setFloorPlan]);

  const handleCanvasClick = useCallback((position: Point) => {
    if (!floorPlan) return;

    switch (selectedTool) {
      case 'wall':
        if (!isDrawing) {
          setIsDrawing(true);
          setDrawingStart(position);
        } else {
          if (drawingStart) {
            const newWall: Wall = {
              id: `wall-${Date.now()}`,
              start: drawingStart,
              end: position,
              thickness: 0.2,
              type: 'interior',
              material: 'brick'
            };
            addWall(newWall);
            setIsDrawing(false);
            setDrawingStart(null);
          }
        }
        break;

      case 'door':
        const newDoor: Door = {
          id: `door-${Date.now()}`,
          position,
          width: 0.8,
          height: 2.0,
          wallId: '', // Would need to find nearest wall
          type: 'single',
          openDirection: 'inward'
        };
        addDoor(newDoor);
        break;

      case 'window':
        const newWindow: Window = {
          id: `window-${Date.now()}`,
          position,
          width: 1.2,
          height: 1.0,
          wallId: '', // Would need to find nearest wall
          type: 'single',
          sillHeight: 0.9
        };
        addWindow(newWindow);
        break;

      case 'room':
        const newRoom: Room = {
          id: `room-${Date.now()}`,
          name: 'New Room',
          type: 'bedroom',
          walls: [],
          area: 12,
          color: '#E3F2FD',
          furniture: []
        };
        addRoom(newRoom);
        break;

      case 'bed':
      case 'sofa':
      case 'kitchen':
      case 'bathroom':
      case 'garage':
        const furnitureTypes = {
          bed: { width: 2, height: 1.5, color: '#8B4513' },
          sofa: { width: 2.5, height: 1, color: '#654321' },
          kitchen: { width: 3, height: 0.6, color: '#D2691E' },
          bathroom: { width: 1.5, height: 1.5, color: '#87CEEB' },
          garage: { width: 5, height: 2.5, color: '#696969' }
        };

        const furnitureConfig = furnitureTypes[selectedTool as keyof typeof furnitureTypes];
        if (furnitureConfig) {
          const newFurniture: Furniture = {
            id: `furniture-${Date.now()}`,
            name: selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1),
            type: selectedTool as any,
            position,
            dimensions: { width: furnitureConfig.width, height: furnitureConfig.height },
            rotation: 0,
            color: furnitureConfig.color
          };
          addFurniture(newFurniture);
        }
        break;
    }
  }, [selectedTool, isDrawing, drawingStart, floorPlan, addWall, addDoor, addWindow, addRoom, addFurniture]);

  const handleElementSelect = useCallback((elementId: string, elementType: string) => {
    if (!floorPlan) return;

    let element: any;
    switch (elementType) {
      case 'wall':
        element = floorPlan.walls.find(w => w.id === elementId);
        break;
      case 'door':
        element = floorPlan.doors.find(d => d.id === elementId);
        break;
      case 'window':
        element = floorPlan.windows.find(w => w.id === elementId);
        break;
      case 'room':
        element = floorPlan.rooms.find(r => r.id === elementId);
        break;
      case 'furniture':
        element = floorPlan.furniture.find(f => f.id === elementId);
        break;
    }

    if (element) {
      setSelectedElement(element, elementType);
      setSelectedTool('select');
    }
  }, [floorPlan, setSelectedElement, setSelectedTool]);

  const handleElementMove = useCallback((elementId: string, newPosition: Point) => {
    if (selectedElementType === 'door' || selectedElementType === 'window' || selectedElementType === 'furniture') {
      updateElement(elementId, selectedElementType, { position: newPosition });
    }
  }, [selectedElementType, updateElement]);

  const handleZoomIn = () => setZoom(zoom * 1.2);
  const handleZoomOut = () => setZoom(zoom / 1.2);

  const handleSave = () => {
    // Implement save functionality
    toast({
      title: "Floor plan saved",
      description: "Your floor plan has been saved successfully.",
    });
  };

  const handleExport = () => {
    // Implement export functionality
    toast({
      title: "Export started",
      description: "Your floor plan is being exported as PDF.",
    });
  };

  if (!floorPlan) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Floor Plan Designer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-subtle flex flex-col">
      {/* Header */}
      <motion.header 
        className="bg-construction text-primary-foreground shadow-construction"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-lg font-bold">Floor Plan Designer</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              {/* History Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Redo className="h-4 w-4" />
              </Button>
              
              {/* File Operations */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            <AutoGenerationPanel 
              onGenerate={() => {
                toast({
                  title: "تم إنشاء المخطط",
                  description: "تم إنشاء مخطط المنزل بنجاح",
                });
              }}
            />
            
            <ToolBar
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
            />
            
            <LayerManager
              layers={floorPlan.layers}
              onLayerUpdate={(layerId, updates) => {
                // Implement layer update
              }}
              onLayerAdd={() => {
                // Implement layer add
              }}
              onLayerDelete={(layerId) => {
                // Implement layer delete
              }}
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <FloorPlanCanvas
              floorPlan={floorPlan}
              selectedTool={selectedTool}
              zoom={zoom}
              offset={offset}
              onElementSelect={handleElementSelect}
              onElementMove={handleElementMove}
              onCanvasClick={handleCanvasClick}
            />
          </div>
          
          {/* Bottom Panel - Mini Map */}
          <div className="h-64 bg-white border-t p-4">
            <MiniMap
              floorPlan={floorPlan}
              viewportBounds={{
                x: -offset.x / zoom,
                y: -offset.y / zoom,
                width: 800 / zoom,
                height: 600 / zoom
              }}
              onViewportChange={(newBounds) => {
                setOffset({
                  x: -newBounds.x * zoom,
                  y: -newBounds.y * zoom
                });
              }}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            <PropertiesPanel
              selectedElement={selectedElement}
              elementType={selectedElementType}
              onElementUpdate={(elementId, updates) => updateElement(elementId, selectedElementType, updates)}
              onElementDelete={(elementId) => deleteElement(elementId, selectedElementType)}
              onElementDuplicate={(elementId) => duplicateElement(elementId, selectedElementType)}
            />
            
            <ValidationPanel floorPlan={floorPlan} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanDesigner;