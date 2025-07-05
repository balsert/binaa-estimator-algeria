import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Save, Share2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { db, Project } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { exportProjectToPDF, shareProject } from "@/utils/pdfExport";
import MaterialCard from "@/components/MaterialCard";
import ConstructionVisuals from "@/components/ConstructionVisuals";
import AnimatedCounter from "@/components/AnimatedCounter";
import { materialAssets } from "@/components/MaterialIcons";

const ProjectResults = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPrices, setEditedPrices] = useState({
    brickPrice: 0,
    cementPrice: 0,
    sandPrice: 0,
    steelPrice: 0,
    gravelPrice: 0,
    contingencyPercent: 0
  });

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      try {
        const projectData = await db.projects.get(parseInt(projectId));
        if (projectData) {
          setProject(projectData);
          setEditedPrices({
            brickPrice: projectData.brickPrice,
            cementPrice: projectData.cementPrice,
            sandPrice: projectData.sandPrice,
            steelPrice: projectData.steelPrice,
            gravelPrice: projectData.gravelPrice,
            contingencyPercent: projectData.contingencyPercent
          });
        } else {
          toast({
            title: "المشروع غير موجود",
            description: "لم يتم العثور على المشروع المطلوب",
            variant: "destructive"
          });
          navigate('/');
        }
      } catch (error) {
        console.error('خطأ في تحميل المشروع:', error);
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل المشروع",
          variant: "destructive"
        });
      }
    };

    loadProject();
  }, [projectId, navigate, toast]);

  const handleSavePrices = async () => {
    if (!project) return;

    try {
      // Recalculate costs with new prices
      const totalMaterialCost = 
        (project.bricks * editedPrices.brickPrice) +
        (project.cement * editedPrices.cementPrice) +
        (project.sand * editedPrices.sandPrice) +
        (project.steel * editedPrices.steelPrice) +
        (project.gravel * editedPrices.gravelPrice);

      const finalCost = totalMaterialCost * (1 + editedPrices.contingencyPercent / 100);

      const updatedProject = {
        ...project,
        ...editedPrices,
        totalMaterialCost,
        finalCost,
        updatedAt: new Date()
      };

      await db.projects.update(project.id!, updatedProject);
      setProject(updatedProject);
      setEditMode(false);

      toast({
        title: "تم الحفظ",
        description: "تم تحديث الأسعار والتكاليف بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (!project) return;

    const result = await shareProject(project);
    
    if (result === 'copied') {
      toast({
        title: "تم النسخ",
        description: "تم نسخ تفاصيل المشروع إلى الحافظة",
        variant: "default"
      });
    } else if (result === false) {
      toast({
        title: "خطأ في المشاركة",
        description: "حدث خطأ أثناء مشاركة المشروع",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = () => {
    if (!project) return;
    
    try {
      exportProjectToPDF(project);
      toast({
        title: "تم التصدير",
        description: "تم تصدير التقرير بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('خطأ في التصدير:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive"
      });
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل المشروع...</p>
        </div>
      </div>
    );
  }

  const materials = [
    { 
      name: "الطوب/البلوك", 
      quantity: project.bricks, 
      unit: "وحدة", 
      price: editedPrices.brickPrice,
      ...materialAssets.bricks
    },
    { 
      name: "الإسمنت", 
      quantity: project.cement, 
      unit: "كيس 50كغ", 
      price: editedPrices.cementPrice,
      ...materialAssets.cement
    },
    { 
      name: "الرمل", 
      quantity: project.sand, 
      unit: "م³", 
      price: editedPrices.sandPrice,
      ...materialAssets.sand
    },
    { 
      name: "الحديد", 
      quantity: project.steel, 
      unit: "كغ", 
      price: editedPrices.steelPrice,
      ...materialAssets.steel
    },
    { 
      name: "الحصى", 
      quantity: project.gravel, 
      unit: "م³", 
      price: editedPrices.gravelPrice,
      ...materialAssets.gravel
    }
  ];

  const totalMaterialCost = materials.reduce((sum, material) => 
    sum + (material.quantity * material.price), 0
  );
  const finalCost = totalMaterialCost * (1 + editedPrices.contingencyPercent / 100);

  return (
    <div className="min-h-screen bg-subtle">
      {/* Header */}
      <motion.header 
        className="bg-success text-success-foreground shadow-construction relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 text-2xl">✅</div>
          <div className="absolute top-4 right-8 text-xl">📊</div>
          <div className="absolute bottom-2 left-8 text-xl">💰</div>
        </div>
        
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-success-foreground hover:bg-success-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success-foreground/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🏠</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">{project.name}</h1>
                  <p className="text-success-foreground/80 text-sm">
                    📐 {project.length}م × {project.width}م - 🏢 {project.floors} طوابق
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportPDF}
                className="text-success-foreground hover:bg-success-foreground/20"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-success-foreground hover:bg-success-foreground/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className="text-success-foreground hover:bg-success-foreground/20"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Project Visualization */}
        <ConstructionVisuals
          length={project.length}
          width={project.width}
          floors={project.floors}
          includeWall={project.includeWall}
          includeSlab={project.includeSlab}
        />

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                تفاصيل المشروع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span>📐</span>
                  <span>المساحة: {project.length}م × {project.width}م</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏢</span>
                  <span>عدد الطوابق: {project.floors}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📏</span>
                  <span>سمك الجدران: {project.wallThickness} سم</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📐</span>
                  <span>ارتفاع السقف: {project.ceilingHeight} م</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🧱</span>
                  <span>سور خارجي: {project.includeWall ? "نعم ✅" : "لا ❌"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏗️</span>
                  <span>بلاطة خرسانية: {project.includeSlab ? "نعم ✅" : "لا ❌"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Materials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">🧱</span>
            الكميات والتكاليف المطلوبة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material, index) => (
              <MaterialCard
                key={material.name}
                name={material.name}
                quantity={material.quantity}
                unit={material.unit}
                price={material.price}
                totalCost={material.quantity * material.price}
                image={material.image}
                icon={material.icon}
                color={material.color}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Cost Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-construction border-primary bg-gradient-to-r from-primary/5 to-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                ملخص التكاليف
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-sm text-muted-foreground mb-1">مجموع تكلفة المواد</div>
                  <div className="text-xl font-bold text-primary">
                    <AnimatedCounter value={totalMaterialCost} suffix=" د.ج" />
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-sm text-muted-foreground mb-1">
                    نسبة الاحتياطي ({editedPrices.contingencyPercent}%)
                  </div>
                  <div className="text-xl font-bold text-warning">
                    <AnimatedCounter value={finalCost - totalMaterialCost} suffix=" د.ج" />
                  </div>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-sm text-muted-foreground mb-1">التكلفة النهائية</div>
                  <div className="text-2xl font-bold text-success">
                    <AnimatedCounter value={finalCost} suffix=" د.ج" />
                  </div>
                </div>
              </div>

              {editMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-6"
                >
                  <h4 className="font-semibold mb-4">تعديل الأسعار:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {materials.map((material, index) => (
                      <div key={material.name} className="space-y-2">
                        <Label className="text-xs">{material.name}</Label>
                        <Input
                          type="number"
                          value={material.price}
                          onChange={(e) => {
                            const field = material.name === "الطوب/البلوك" ? "brickPrice" : 
                                         material.name === "الإسمنت" ? "cementPrice" :
                                         material.name === "الرمل" ? "sandPrice" :
                                         material.name === "الحديد" ? "steelPrice" : "gravelPrice";
                            setEditedPrices(prev => ({
                              ...prev,
                              [field]: parseFloat(e.target.value) || 0
                            }));
                          }}
                          className="text-xs"
                        />
                      </div>
                    ))}
                    <div className="space-y-2">
                      <Label className="text-xs">نسبة الاحتياطي (%)</Label>
                      <Input
                        type="number"
                        value={editedPrices.contingencyPercent}
                        onChange={(e) => setEditedPrices(prev => ({
                          ...prev,
                          contingencyPercent: parseFloat(e.target.value) || 0
                        }))}
                        className="text-xs"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        {editMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex gap-4"
          >
            <Button
              onClick={handleSavePrices}
              className="flex-1 btn-construction"
            >
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
            <Button
              onClick={() => setEditMode(false)}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProjectResults;