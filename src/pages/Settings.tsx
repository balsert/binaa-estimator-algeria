import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Settings as SettingsIcon, Save, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { db, AppSettings, initializeSettings } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import BackupRestore from "@/components/BackupRestore";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const appSettings = await initializeSettings();
        setSettings(appSettings);
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل الإعدادات",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        updatedAt: new Date()
      };

      await db.settings.update(settings.id!, updatedSettings);
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("هل تريد إعادة ضبط جميع الإعدادات للقيم الافتراضية؟")) {
      try {
        const defaultSettings: Partial<AppSettings> = {
          defaultBrickPrice: 15,
          defaultCementPrice: 800,
          defaultSandPrice: 3500,
          defaultSteelPrice: 180,
          defaultGravelPrice: 4000,
          defaultWallThickness: 20,
          defaultCeilingHeight: 3.0,
          defaultContingencyPercent: 10,
          updatedAt: new Date()
        };

        if (settings?.id) {
          await db.settings.update(settings.id, defaultSettings);
          setSettings(prev => prev ? { ...prev, ...defaultSettings } : null);
        }

        toast({
          title: "تم إعادة الضبط",
          description: "تم إعادة ضبط الإعدادات للقيم الافتراضية",
          variant: "default"
        });
      } catch (error) {
        console.error('خطأ في إعادة الضبط:', error);
        toast({
          title: "خطأ في إعادة الضبط",
          description: "حدث خطأ أثناء إعادة ضبط الإعدادات",
          variant: "destructive"
        });
      }
    }
  };

  const updateSetting = (field: keyof AppSettings, value: number) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <p>خطأ في تحميل الإعدادات</p>
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
              <SettingsIcon className="h-6 w-6" />
              <h1 className="text-xl font-bold">الإعدادات</h1>
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
          <Tabs defaultValue="prices" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prices">الأسعار والإعدادات</TabsTrigger>
              <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
            </TabsList>

            <TabsContent value="prices" className="space-y-6">
              {/* Default Prices */}
              <Card className="card-construction">
                <CardHeader>
                  <CardTitle>الأسعار الافتراضية (دينار جزائري)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brickPrice">سعر الطوبة الواحدة</Label>
                      <Input
                        id="brickPrice"
                        type="number"
                        value={settings.defaultBrickPrice}
                        onChange={(e) => updateSetting('defaultBrickPrice', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cementPrice">سعر كيس الإسمنت (50 كغ)</Label>
                      <Input
                        id="cementPrice"
                        type="number"
                        value={settings.defaultCementPrice}
                        onChange={(e) => updateSetting('defaultCementPrice', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sandPrice">سعر متر مكعب الرمل</Label>
                      <Input
                        id="sandPrice"
                        type="number"
                        value={settings.defaultSandPrice}
                        onChange={(e) => updateSetting('defaultSandPrice', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="steelPrice">سعر كيلوغرام الحديد</Label>
                      <Input
                        id="steelPrice"
                        type="number"
                        value={settings.defaultSteelPrice}
                        onChange={(e) => updateSetting('defaultSteelPrice', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gravelPrice">سعر متر مكعب الحصى</Label>
                      <Input
                        id="gravelPrice"
                        type="number"
                        value={settings.defaultGravelPrice}
                        onChange={(e) => updateSetting('defaultGravelPrice', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Construction Defaults */}
              <Card className="card-construction">
                <CardHeader>
                  <CardTitle>الإعدادات الافتراضية للبناء</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallThickness">سمك الجدران الافتراضي (سم)</Label>
                      <Input
                        id="wallThickness"
                        type="number"
                        value={settings.defaultWallThickness}
                        onChange={(e) => updateSetting('defaultWallThickness', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ceilingHeight">ارتفاع السقف الافتراضي (متر)</Label>
                      <Input
                        id="ceilingHeight"
                        type="number"
                        step="0.1"
                        value={settings.defaultCeilingHeight}
                        onChange={(e) => updateSetting('defaultCeilingHeight', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contingencyPercent">نسبة الاحتياطي الافتراضية (%)</Label>
                      <Input
                        id="contingencyPercent"
                        type="number"
                        value={settings.defaultContingencyPercent}
                        onChange={(e) => updateSetting('defaultContingencyPercent', parseFloat(e.target.value) || 0)}
                        className="input-arabic arabic-numbers"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 btn-construction"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      جاري الحفظ...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ الإعدادات
                    </div>
                  )}
                </Button>
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 ml-2" />
                  إعادة الضبط
                </Button>
              </div>

              {/* Info */}
              <Card className="card-construction bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    💡 نصيحة: يمكنك تعديل هذه الأسعار حسب السوق المحلي في منطقتك. 
                    ستُستخدم هذه القيم كأسعار افتراضية للمشاريع الجديدة.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup">
              <BackupRestore />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;