import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator as CalculatorIcon, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { db, Project, AppSettings, calculateMaterials, initializeSettings } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const Calculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    length: "",
    width: "",
    floors: "1",
    wallThickness: "20",
    ceilingHeight: "3",
    includeWall: false,
    includeSlab: true,
    roofType: "concrete" as "concrete" | "tiles" | "none",
    rooms: "",
    bathrooms: ""
  });

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const appSettings = await initializeSettings();
        setSettings(appSettings);
        
        // Set default values from settings
        setFormData(prev => ({
          ...prev,
          wallThickness: appSettings.defaultWallThickness.toString(),
          ceilingHeight: appSettings.defaultCeilingHeight.toString()
        }));
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
      }
    };

    loadSettings();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = async () => {
    // Validation
    if (!formData.length || !formData.width || !formData.floors) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    if (!settings) {
      toast({
        title: "خطأ",
        description: "لم يتم تحميل الإعدادات بعد",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    try {
      const inputData = {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        floors: parseInt(formData.floors),
        wallThickness: parseFloat(formData.wallThickness),
        ceilingHeight: parseFloat(formData.ceilingHeight),
        includeWall: formData.includeWall,
        includeSlab: formData.includeSlab,
        roofType: formData.roofType,
        rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined
      };

      // Calculate materials
      const calculations = calculateMaterials(inputData);

      // Create project
      const project: Omit<Project, 'id'> = {
        name: formData.name || `مشروع ${inputData.length}×${inputData.width}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        
        ...inputData,
        
        bricks: calculations.bricks || 0,
        cement: calculations.cement || 0,
        sand: calculations.sand || 0,
        steel: calculations.steel || 0,
        gravel: calculations.gravel || 0,
        
        brickPrice: settings.defaultBrickPrice,
        cementPrice: settings.defaultCementPrice,
        sandPrice: settings.defaultSandPrice,
        steelPrice: settings.defaultSteelPrice,
        gravelPrice: settings.defaultGravelPrice,
        
        totalMaterialCost: 0,
        contingencyPercent: settings.defaultContingencyPercent,
        finalCost: 0
      };

      // Calculate costs
      project.totalMaterialCost = 
        (project.bricks * project.brickPrice) +
        (project.cement * project.cementPrice) +
        (project.sand * project.sandPrice) +
        (project.steel * project.steelPrice) +
        (project.gravel * project.gravelPrice);

      project.finalCost = project.totalMaterialCost * (1 + project.contingencyPercent / 100);

      // Save to database
      const projectId = await db.projects.add(project);

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حساب المواد وحفظ المشروع",
        variant: "default"
      });

      // Navigate to results
      navigate(`/project/${projectId}`);

    } catch (error) {
      console.error('خطأ في الحساب:', error);
      toast({
        title: "خطأ في الحساب",
        description: "حدث خطأ أثناء حساب المواد",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const roofOptions = [
    { value: "concrete", label: "سقف خرساني" },
    { value: "tiles", label: "سقف بالتول" },
    { value: "none", label: "بدون سقف" }
  ];

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
              <CalculatorIcon className="h-6 w-6" />
              <h1 className="text-xl font-bold">حاسبة مواد البناء</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle className="text-center">بيانات المشروع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name">اسم المشروع (اختياري)</Label>
                <Input
                  id="name"
                  className="input-arabic"
                  placeholder="مثال: فيلا العائلة"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">الطول (متر)</Label>
                  <Input
                    id="length"
                    type="number"
                    className="input-arabic arabic-numbers"
                    placeholder="15"
                    value={formData.length}
                    onChange={(e) => handleInputChange('length', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">العرض (متر)</Label>
                  <Input
                    id="width"
                    type="number"
                    className="input-arabic arabic-numbers"
                    placeholder="12"
                    value={formData.width}
                    onChange={(e) => handleInputChange('width', e.target.value)}
                  />
                </div>
              </div>

              {/* Floors and Height */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floors">عدد الطوابق</Label>
                  <Select value={formData.floors} onValueChange={(value) => handleInputChange('floors', value)}>
                    <SelectTrigger className="input-arabic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">طابق واحد</SelectItem>
                      <SelectItem value="2">طابقان</SelectItem>
                      <SelectItem value="3">ثلاثة طوابق</SelectItem>
                      <SelectItem value="4">أربعة طوابق</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceilingHeight">ارتفاع السقف (متر)</Label>
                  <Input
                    id="ceilingHeight"
                    type="number"
                    step="0.1"
                    className="input-arabic arabic-numbers"
                    value={formData.ceilingHeight}
                    onChange={(e) => handleInputChange('ceilingHeight', e.target.value)}
                  />
                </div>
              </div>

              {/* Wall Thickness */}
              <div className="space-y-2">
                <Label htmlFor="wallThickness">سمك الجدران (سم)</Label>
                <Select value={formData.wallThickness} onValueChange={(value) => handleInputChange('wallThickness', value)}>
                  <SelectTrigger className="input-arabic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 سم</SelectItem>
                    <SelectItem value="20">20 سم</SelectItem>
                    <SelectItem value="25">25 سم</SelectItem>
                    <SelectItem value="30">30 سم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Construction Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeWall">يشمل سور خارجي</Label>
                  <Switch
                    id="includeWall"
                    checked={formData.includeWall}
                    onCheckedChange={(checked) => handleInputChange('includeWall', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeSlab">يشمل بلاطة خرسانية</Label>
                  <Switch
                    id="includeSlab"
                    checked={formData.includeSlab}
                    onCheckedChange={(checked) => handleInputChange('includeSlab', checked)}
                  />
                </div>
              </div>

              {/* Roof Type */}
              <div className="space-y-2">
                <Label>نوع السقف</Label>
                <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                  <SelectTrigger className="input-arabic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roofOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rooms">عدد الغرف (اختياري)</Label>
                  <Input
                    id="rooms"
                    type="number"
                    className="input-arabic arabic-numbers"
                    placeholder="4"
                    value={formData.rooms}
                    onChange={(e) => handleInputChange('rooms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">عدد الحمامات (اختياري)</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    className="input-arabic arabic-numbers"
                    placeholder="2"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full btn-construction text-lg py-6"
              >
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    جاري الحساب...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CalculatorIcon className="h-5 w-5" />
                    احسب المواد والتكلفة
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Calculator;