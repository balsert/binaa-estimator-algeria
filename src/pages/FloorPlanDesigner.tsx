import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';
import { floorPlanDB } from '@/lib/floorPlanDatabase';
import { createNewFloorPlan } from '@/utils/floorPlanUtils';
import { FloorPlan } from '@/types/floorPlan';
import { useToast } from '@/hooks/use-toast';

const FloorPlanDesigner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [savedFloorPlans, setSavedFloorPlans] = useState<FloorPlan[]>([]);
  
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    width: '',
    length: '',
    floors: '1'
  });

  useEffect(() => {
    loadSavedFloorPlans();
  }, []);

  const loadSavedFloorPlans = async () => {
    try {
      const plans = await floorPlanDB.floorPlans.orderBy('updatedAt').reverse().toArray();
      setSavedFloorPlans(plans);
    } catch (error) {
      console.error('Error loading floor plans:', error);
    }
  };

  const handleCreateNewProject = () => {
    const { name, width, length, floors } = newProjectForm;
    
    if (!name || !width || !length) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const propertyDimensions = {
      width: parseFloat(width),
      height: parseFloat(length)
    };

    if (propertyDimensions.width < 5 || propertyDimensions.height < 5) {
      toast({
        title: "أبعاد غير صحيحة",
        description: "الحد الأدنى للأبعاد هو 5×5 متر",
        variant: "destructive"
      });
      return;
    }

    const floorPlan = createNewFloorPlan(
      name,
      propertyDimensions,
      parseInt(floors)
    );

    setCurrentFloorPlan(floorPlan);
    setShowNewProjectForm(false);
    
    toast({
      title: "تم إنشاء المشروع",
      description: `تم إنشاء مشروع ${name} بنجاح`,
      variant: "default"
    });
  };

  const handleLoadProject = (floorPlan: FloorPlan) => {
    setCurrentFloorPlan(floorPlan);
  };

  const handleSaveProject = async (floorPlan: FloorPlan) => {
    try {
      if (floorPlan.id && await floorPlanDB.floorPlans.get(floorPlan.id)) {
        await floorPlanDB.floorPlans.update(floorPlan.id, {
          ...floorPlan,
          updatedAt: new Date()
        });
      } else {
        await floorPlanDB.floorPlans.add({
          ...floorPlan,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      await loadSavedFloorPlans();
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ المشروع بنجاح",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المشروع",
        variant: "destructive"
      });
    }
  };

  if (currentFloorPlan) {
    return (
      <div className="h-screen">
        <FloorPlanEditor
          initialFloorPlan={currentFloorPlan}
          onSave={handleSaveProject}
        />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentFloorPlan(null)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة للمشاريع
          </Button>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-3">
                <Home className="h-6 w-6" />
                <h1 className="text-xl font-bold">مصمم المخططات المعمارية</h1>
              </div>
            </div>
            <Button
              onClick={() => setShowNewProjectForm(true)}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Plus className="h-4 w-4 ml-2" />
              مشروع جديد
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* New Project Form */}
        {showNewProjectForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="card-construction">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🏗️</span>
                  مشروع جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">اسم المشروع</Label>
                    <Input
                      id="projectName"
                      placeholder="مثال: فيلا العائلة"
                      value={newProjectForm.name}
                      onChange={(e) => setNewProjectForm(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      className="input-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="floors">عدد الطوابق</Label>
                    <Input
                      id="floors"
                      type="number"
                      min="1"
                      max="4"
                      value={newProjectForm.floors}
                      onChange={(e) => setNewProjectForm(prev => ({
                        ...prev,
                        floors: e.target.value
                      }))}
                      className="input-arabic arabic-numbers"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">العرض (متر)</Label>
                    <Input
                      id="width"
                      type="number"
                      min="5"
                      step="0.5"
                      placeholder="15"
                      value={newProjectForm.width}
                      onChange={(e) => setNewProjectForm(prev => ({
                        ...prev,
                        width: e.target.value
                      }))}
                      className="input-arabic arabic-numbers"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="length">الطول (متر)</Label>
                    <Input
                      id="length"
                      type="number"
                      min="5"
                      step="0.5"
                      placeholder="20"
                      value={newProjectForm.length}
                      onChange={(e) => setNewProjectForm(prev => ({
                        ...prev,
                        length: e.target.value
                      }))}
                      className="input-arabic arabic-numbers"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCreateNewProject}
                    className="flex-1 btn-construction"
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء المشروع
                  </Button>
                  <Button
                    onClick={() => setShowNewProjectForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Saved Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-6">المشاريع المحفوظة</h2>
          
          {savedFloorPlans.length === 0 ? (
            <Card className="card-construction">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-lg font-semibold mb-2">لا توجد مشاريع محفوظة</h3>
                <p className="text-muted-foreground mb-6">
                  ابدأ بإنشاء مشروع جديد لتصميم مخططك المعماري
                </p>
                <Button
                  onClick={() => setShowNewProjectForm(true)}
                  className="btn-construction"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء مشروع جديد
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedFloorPlans.map((floorPlan, index) => (
                <motion.div
                  key={floorPlan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleLoadProject(floorPlan)}
                >
                  <Card className="card-construction hover:shadow-construction transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{floorPlan.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {floorPlan.propertyDimensions.width}×{floorPlan.propertyDimensions.height} متر
                          </p>
                        </div>
                        <span className="text-2xl">🏠</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>الطوابق:</span>
                          <span>{floorPlan.floors.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>إجمالي الغرف:</span>
                          <span>
                            {floorPlan.floors.reduce((total, floor) => total + floor.rooms.length, 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>آخر تحديث:</span>
                          <span>
                            {new Date(floorPlan.updatedAt).toLocaleDateString('ar-DZ')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FloorPlanDesigner;