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

    const shareText = `
مشروع: ${project.name}
المساحة: ${project.length}م × ${project.width}م
الطوابق: ${project.floors}

المواد المطلوبة:
• الطوب: ${project.bricks.toLocaleString('ar-DZ')} وحدة
• الإسمنت: ${project.cement.toLocaleString('ar-DZ')} كيس
• الرمل: ${project.sand.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })} م³
• الحديد: ${project.steel.toLocaleString('ar-DZ')} كغ
• الحصى: ${project.gravel.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })} م³

التكلفة الإجمالية: ${project.finalCost.toLocaleString('ar-DZ')} د.ج

تم الحساب بواسطة حاسبة مواد البناء
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: `مشروع ${project.name}`,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "تم النسخ",
          description: "تم نسخ تفاصيل المشروع إلى الحافظة",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('خطأ في المشاركة:', error);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const materials = [
    { name: "الطوب/البلوك", quantity: project.bricks, unit: "وحدة", price: editedPrices.brickPrice, icon: "🧱" },
    { name: "الإسمنت", quantity: project.cement, unit: "كيس 50كغ", price: editedPrices.cementPrice, icon: "🏗️" },
    { name: "الرمل", quantity: project.sand, unit: "م³", price: editedPrices.sandPrice, icon: "⛱️" },
    { name: "الحديد", quantity: project.steel, unit: "كغ", price: editedPrices.steelPrice, icon: "🔩" },
    { name: "الحصى", quantity: project.gravel, unit: "م³", price: editedPrices.gravelPrice, icon: "🪨" }
  ];

  const totalMaterialCost = materials.reduce((sum, material) => 
    sum + (material.quantity * material.price), 0
  );
  const finalCost = totalMaterialCost * (1 + editedPrices.contingencyPercent / 100);

  return (
    <div className="min-h-screen bg-subtle">
      {/* Header */}
      <motion.header 
        className="bg-success text-success-foreground shadow-construction"
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
                className="text-success-foreground hover:bg-success-foreground/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">{project.name}</h1>
                <p className="text-success-foreground/80 text-sm">
                  {project.length}م × {project.width}م - {project.floors} طوابق
                </p>
              </div>
            </div>
            <div className="flex gap-2">
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

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle>تفاصيل المشروع</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>المساحة: {project.length}م × {project.width}م</div>
                <div>عدد الطوابق: {project.floors}</div>
                <div>سمك الجدران: {project.wallThickness} سم</div>
                <div>ارتفاع السقف: {project.ceilingHeight} م</div>
                <div>سور خارجي: {project.includeWall ? "نعم" : "لا"}</div>
                <div>بلاطة خرسانية: {project.includeSlab ? "نعم" : "لا"}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Materials List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle>الكميات المطلوبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {materials.map((material, index) => (
                <motion.div
                  key={material.name}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{material.icon}</span>
                    <div>
                      <h4 className="font-medium">{material.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {material.quantity.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })} {material.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    {editMode ? (
                      <Input
                        type="number"
                        value={material.price}
                        onChange={(e) => setEditedPrices(prev => ({
                          ...prev,
                          [`${material.name === "الطوب/البلوك" ? "brick" : 
                             material.name === "الإسمنت" ? "cement" :
                             material.name === "الرمل" ? "sand" :
                             material.name === "الحديد" ? "steel" : "gravel"}Price`]: parseFloat(e.target.value) || 0
                        }))}
                        className="w-20 text-xs text-right"
                      />
                    ) : (
                      <div>
                        <div className="font-semibold">
                          {(material.quantity * material.price).toLocaleString('ar-DZ')} د.ج
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {material.price} د.ج/{material.unit}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Cost Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-construction border-primary">
            <CardHeader>
              <CardTitle>ملخص التكاليف</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>مجموع تكلفة المواد:</span>
                <span className="font-semibold">
                  {totalMaterialCost.toLocaleString('ar-DZ')} د.ج
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>نسبة الاحتياطي:</span>
                  {editMode ? (
                    <Input
                      type="number"
                      value={editedPrices.contingencyPercent}
                      onChange={(e) => setEditedPrices(prev => ({
                        ...prev,
                        contingencyPercent: parseFloat(e.target.value) || 0
                      }))}
                      className="w-16 text-xs"
                      min="0"
                      max="50"
                    />
                  ) : (
                    <span>{editedPrices.contingencyPercent}%</span>
                  )}
                </div>
                <span className="font-semibold">
                  {(finalCost - totalMaterialCost).toLocaleString('ar-DZ')} د.ج
                </span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">التكلفة النهائية:</span>
                  <span className="font-bold text-primary text-2xl">
                    {finalCost.toLocaleString('ar-DZ')} د.ج
                  </span>
                </div>
              </div>
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