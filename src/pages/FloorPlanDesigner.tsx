import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Download, Undo, Redo, ZoomIn, ZoomOut, Grid, Ruler, Home, Plus, Menu, X, Layers, Settings } from 'lucide-react';
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
import { generateProfessionalFloorPlan, GenerationOptions } from '@/utils/automaticFloorPlanGenerator';
import { useToast } from '@/hooks/use-toast';
import { db, Project } from '@/lib/database';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectList, setShowProjectList] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const isMobile = useIsMobile();

  // Load all projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await db.projects.toArray();
        setProjects(allProjects);
      } catch (error) {
        console.error('خطأ في تحميل المشاريع:', error);
      }
    };
    
    loadProjects();
  }, []);

  // Generate floor plan for selected project
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowProjectList(false);
    
    // Generate professional floor plan automatically
    const generatedPlan = generateProfessionalFloorPlan({
      dimensions: { width: project.width, height: project.length },
      bedrooms: Math.max(1, Math.floor((project.rooms || 3) / 2)),
      bathrooms: project.bathrooms || 1,
      includeKitchen: true,
      includeLiving: true,
      includeDining: (project.rooms || 3) >= 4,
      includeOffice: (project.rooms || 3) >= 5,
      includeStorage: true,
      style: 'modern'
    });
    
    // Update floor plan name with project info
    generatedPlan.name = `مخطط ${project.name}`;
    generatedPlan.id = `fp-${project.id}`;
    
    setFloorPlan(generatedPlan);
    
    toast({
      title: "تم إنشاء المخطط المعماري",
      description: `تم إنشاء مخطط احترافي للمشروع: ${project.name}`,
    });
  };

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

  // Show project list if no project selected
  if (showProjectList) {
    return (
      <div className="min-h-screen bg-subtle">
        {/* Header */}
        <motion.header 
          className="bg-construction text-primary-foreground shadow-construction"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">مصمم المخططات المعمارية</h1>
                  <p className="text-primary-foreground/80 text-sm">اختر مشروعاً لعرض مخططه المعماري</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Projects List */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-construction">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <span className="text-xl">🏗️</span>
                  اختر مشروعاً لعرض مخططه المعماري
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🏗️</div>
                    <h3 className="text-lg font-semibold mb-2">لا توجد مشاريع</h3>
                    <p className="text-muted-foreground mb-4">
                      قم بإنشاء مشروع جديد أولاً من حاسبة مواد البناء
                    </p>
                    <Button onClick={() => navigate('/calculator')} className="btn-construction">
                      <Plus className="h-4 w-4 ml-2" />
                      إنشاء مشروع جديد
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <motion.div
                        key={project.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                        onClick={() => handleProjectSelect(project)}
                      >
                        <Card className="card-construction hover:border-primary/50 transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-3xl mb-3">🏠</div>
                              <h3 className="font-bold mb-2">{project.name}</h3>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>📏 الأبعاد: {project.length}×{project.width} متر</p>
                                <p>🏢 الطوابق: {project.floors}</p>
                                {project.rooms && <p>🚪 الغرف: {project.rooms}</p>}
                                {project.bathrooms && <p>🚿 الحمامات: {project.bathrooms}</p>}
                              </div>
                              <div className="mt-4 p-2 bg-primary/10 rounded-lg">
                                <p className="text-xs text-primary font-semibold">
                                  انقر لعرض المخطط المعماري
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!floorPlan) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري إنشاء المخطط المعماري...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-subtle flex flex-col">
      {/* Mobile Header */}
      <motion.header 
        className="bg-construction text-primary-foreground shadow-construction"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProjectList(true)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  {selectedProject ? (isMobile ? selectedProject.name : `مخطط ${selectedProject.name}`) : 'مصمم المخططات'}
                </h1>
                {!isMobile && selectedProject && (
                  <p className="text-primary-foreground/80 text-xs">
                    {selectedProject.length}×{selectedProject.width} متر - {selectedProject.floors} طوابق
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {/* Mobile Panel Toggles */}
              {isMobile && (
                <>
                  <Sheet open={showLeftPanel} onOpenChange={setShowLeftPanel}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-foreground hover:bg-primary-foreground/20"
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-4 space-y-4 h-full overflow-y-auto">
                        <h3 className="font-bold mb-4">أدوات التصميم</h3>
                        <AutoGenerationPanel 
                          onGenerate={() => {
                            setShowLeftPanel(false);
                            toast({
                              title: "تم إنشاء المخطط",
                              description: "تم إنشاء مخطط المنزل بنجاح",
                            });
                          }}
                        />
                        
                        <ToolBar
                          selectedTool={selectedTool}
                          onToolSelect={(tool) => {
                            setSelectedTool(tool);
                            setShowLeftPanel(false);
                          }}
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
                    </SheetContent>
                  </Sheet>

                  <Sheet open={showRightPanel} onOpenChange={setShowRightPanel}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-foreground hover:bg-primary-foreground/20"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 p-0">
                      <div className="p-4 space-y-4 h-full overflow-y-auto">
                        <h3 className="font-bold mb-4">خصائص العنصر</h3>
                        <PropertiesPanel
                          selectedElement={selectedElement}
                          elementType={selectedElementType}
                          onElementUpdate={(elementId, updates) => updateElement(elementId, selectedElementType, updates)}
                          onElementDelete={(elementId) => deleteElement(elementId, selectedElementType)}
                          onElementDuplicate={(elementId) => duplicateElement(elementId, selectedElementType)}
                        />
                        
                        <ValidationPanel floorPlan={floorPlan} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
              
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              {!isMobile && <span className="text-xs px-1">{Math.round(zoom * 100)}%</span>}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              
              {/* History & File Controls */}
              {!isMobile && (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        {!isMobile && (
          <motion.div 
            className="w-72 bg-white border-r flex flex-col overflow-y-auto"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}

        {/* Canvas Area - Full screen on mobile */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <FloorPlanCanvas
                floorPlan={floorPlan}
                selectedTool={selectedTool}
                zoom={zoom}
                offset={offset}
                onElementSelect={handleElementSelect}
                onElementMove={handleElementMove}
                onCanvasClick={handleCanvasClick}
              />
            </motion.div>
          </div>
          
          {/* Bottom Panel - Mini Map (Desktop only) */}
          {!isMobile && (
            <motion.div 
              className="h-48 bg-white border-t"
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-3">
                <h4 className="text-sm font-semibold mb-2 text-center">خريطة صغيرة</h4>
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
            </motion.div>
          )}
        </div>

        {/* Desktop Right Sidebar */}
        {!isMobile && (
          <motion.div 
            className="w-72 bg-white border-l flex flex-col overflow-y-auto"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
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
          </motion.div>
        )}
      </div>

      {/* Mobile Bottom Action Bar */}
      {isMobile && (
        <motion.div 
          className="bg-white border-t p-3 flex justify-center gap-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Undo className="h-4 w-4" />
            <span className="text-xs">تراجع</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Redo className="h-4 w-4" />
            <span className="text-xs">إعادة</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Save className="h-4 w-4" />
            <span className="text-xs">حفظ</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs">تصدير</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FloorPlanDesigner;