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
import { buildingTypes } from "@/components/MaterialIcons";
import ConstructionVisuals from "@/components/ConstructionVisuals";

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
  const [selectedBuildingType, setSelectedBuildingType] = useState("house");

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
    { value: "concrete", label: "سقف خرساني 🏗️" },
    { value: "tiles", label: "سقف بالتول 🏠" },
    { value: "none", label: "بدون سقف ⭕" }
  ];

  const buildingTypeOptions = [
    { value: "house", label: "منزل عائلي", ...buildingTypes.house },
    { value: "apartment", label: "شقة سكنية", ...buildingTypes.apartment },
    { value: "villa", label: "فيلا فاخرة", ...buildingTypes.villa }
  ];

  return (
    <div className="min-h-screen bg-subtle">
      {/* Header */}
      <motion.header 
        className="bg-construction text-primary-foreground shadow-construction relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-3xl">🧮</div>
          <div className="absolute top-8 right-12 text-2xl">📐</div>
          <div className="absolute bottom-4 left-16 text-xl">🏗️</div>
          <div className="absolute bottom-6 right-8 text-2xl">📊</div>
        </div>
        
        <div className="container mx-auto px-4 py-4 relative">
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
                <CalculatorIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">حاسبة مواد البناء</h1>
                <p className="text-primary-foreground/80 text-sm">احسب كميات وتكاليف مشروعك</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Building Type Selection */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <span className="text-xl">🏠</span>
                نوع المبنى
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {buildingTypeOptions.map((type) => (
                  <motion.div
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                      selectedBuildingType === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedBuildingType(type.value)}
                  >
                    <div className="p-4 text-center">
                      <img 
                        src={type.image} 
                        alt={type.label}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden text-4xl mb-3">{type.icon}</div>
                      <h3 className="font-semibold">{type.label}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <span className="text-xl">📋</span>
                بيانات المشروع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <span>🏷️</span>
                  اسم المشروع (اختياري)
                </Label>
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
                  <Label htmlFor="length" className="flex items-center gap-2">
                    <span>📏</span>
                    الطول (متر)
                  </Label>
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
                  <Label htmlFor="width" className="flex items-center gap-2">
                    <span>📐</span>
                    العرض (متر)
                  </Label>
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
                  <Label htmlFor="floors" className="flex items-center gap-2">
                    <span>🏢</span>
                    عدد الطوابق
                  </Label>
                  <Select value={formData.floors} onValueChange={(value) => handleInputChange('floors', value)}>
                    <SelectTrigger className="input-arabic">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">طابق واحد 🏠</SelectItem>
                      <SelectItem value="2">طابقان 🏢</SelectItem>
                      <SelectItem value="3">ثلاثة طوابق 🏗️</SelectItem>
                      <SelectItem value="4">أربعة طوابق 🏙️</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceilingHeight" className="flex items-center gap-2">
                    <span>📏</span>
                    ارتفاع السقف (متر)
                  </Label>
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
                <Label htmlFor="wallThickness" className="flex items-center gap-2">
                  <span>🧱</span>
                  سمك الجدران (سم)
                </Label>
                <Select value={formData.wallThickness} onValueChange={(value) => handleInputChange('wallThickness', value)}>
                  <SelectTrigger className="input-arabic">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 سم - جدران خفيفة</SelectItem>
                    <SelectItem value="20">20 سم - جدران عادية</SelectItem>
                    <SelectItem value="25">25 سم - جدران قوية</SelectItem>
                    <SelectItem value="30">30 سم - جدران فائقة القوة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Construction Options */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold flex items-center gap-2">
                  <span>⚙️</span>
                  خيارات البناء
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeWall" className="flex items-center gap-2">
                      <span>🧱</span>
                      يشمل سور خارجي
                    </Label>
                    <Switch
                      id="includeWall"
                      checked={formData.includeWall}
                      onCheckedChange={(checked) => handleInputChange('includeWall', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeSlab" className="flex items-center gap-2">
                      <span>🏗️</span>
                      يشمل بلاطة خرسانية
                    </Label>
                    <Switch
                      id="includeSlab"
                      checked={formData.includeSlab}
                      onCheckedChange={(checked) => handleInputChange('includeSlab', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Roof Type */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <span>🏠</span>
                  نوع السقف
                </Label>
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
                  <Label htmlFor="rooms" className="flex items-center gap-2">
                    <span>🚪</span>
                    عدد الغرف (اختياري)
                  </Label>
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
                  <Label htmlFor="bathrooms" className="flex items-center gap-2">
                    <span>🚿</span>
                    عدد الحمامات (اختياري)
                  </Label>
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
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full btn-construction text-lg py-6"
                >
                  {isCalculating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                      <span>🧮</span>
                      جاري الحساب...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CalculatorIcon className="h-5 w-5" />
                      <span>🚀</span>
                      احسب المواد والتكلفة
                    </div>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Construction Visuals */}
        {formData.length && formData.width && (
          <ConstructionVisuals
            length={parseFloat(formData.length)}
            width={parseFloat(formData.width)}
            floors={parseInt(formData.floors)}
            rooms={formData.rooms ? parseInt(formData.rooms) : undefined}
            bathrooms={formData.bathrooms ? parseInt(formData.bathrooms) : undefined}
          />
        )}

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-construction bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="font-bold mb-2">نصائح مهمة للحساب الدقيق:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• تأكد من دقة القياسات قبل البدء</li>
                    <li>• احرص على إضافة نسبة احتياطي للهدر</li>
                    <li>• راجع الأسعار مع الموردين المحليين</li>
                    <li>• استشر مهندس إنشائي للمشاريع الكبيرة</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Calculator;