import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { materialAssets } from "./MaterialIcons";

const MaterialCalculator = () => {
  const [wallData, setWallData] = useState({
    length: "",
    height: "",
    thickness: "20"
  });

  const [slabData, setSlabData] = useState({
    length: "",
    width: "",
    thickness: "15"
  });

  const [foundationData, setFoundationData] = useState({
    length: "",
    width: "",
    depth: "1.5"
  });

  const calculateWallMaterials = () => {
    const length = parseFloat(wallData.length) || 0;
    const height = parseFloat(wallData.height) || 0;
    const thickness = parseFloat(wallData.thickness) || 20;
    
    const area = length * height;
    const volume = area * (thickness / 100);
    
    return {
      bricks: Math.ceil(area * 50), // 50 طوبة لكل متر مربع
      cement: Math.ceil(volume * 7), // 7 أكياس لكل متر مكعب
      sand: volume * 0.5, // 0.5 متر مكعب رمل
      mortar: volume * 0.3 // 0.3 متر مكعب مونة
    };
  };

  const calculateSlabMaterials = () => {
    const length = parseFloat(slabData.length) || 0;
    const width = parseFloat(slabData.width) || 0;
    const thickness = parseFloat(slabData.thickness) || 15;
    
    const volume = length * width * (thickness / 100);
    
    return {
      cement: Math.ceil(volume * 7), // 7 أكياس لكل متر مكعب
      sand: volume * 0.5, // 0.5 متر مكعب رمل
      gravel: volume * 0.8, // 0.8 متر مكعب حصى
      steel: Math.ceil(volume * 80) // 80 كغ حديد لكل متر مكعب
    };
  };

  const calculateFoundationMaterials = () => {
    const length = parseFloat(foundationData.length) || 0;
    const width = parseFloat(foundationData.width) || 0;
    const depth = parseFloat(foundationData.depth) || 1.5;
    
    const volume = length * width * depth;
    
    return {
      cement: Math.ceil(volume * 6), // 6 أكياس لكل متر مكعب للأساسات
      sand: volume * 0.6, // 0.6 متر مكعب رمل
      gravel: volume * 0.9, // 0.9 متر مكعب حصى
      steel: Math.ceil(volume * 60) // 60 كغ حديد لكل متر مكعب
    };
  };

  const wallMaterials = calculateWallMaterials();
  const slabMaterials = calculateSlabMaterials();
  const foundationMaterials = calculateFoundationMaterials();

  const MaterialResult = ({ title, materials, icon }: { title: string, materials: any, icon: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-muted rounded-lg p-4 space-y-3"
    >
      <h4 className="font-medium flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(materials).map(([key, value]: [string, any]) => {
          const materialKey = key === 'bricks' ? 'bricks' : 
                             key === 'cement' ? 'cement' :
                             key === 'sand' ? 'sand' :
                             key === 'steel' ? 'steel' :
                             key === 'gravel' ? 'gravel' : null;
          
          const asset = materialKey ? materialAssets[materialKey as keyof typeof materialAssets] : null;
          
          return (
            <div key={key} className="flex items-center gap-2 p-2 bg-white rounded">
              {asset && (
                <img 
                  src={asset.image} 
                  alt={key}
                  className="w-8 h-8 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.classList.remove('hidden');
                  }}
                />
              )}
              {asset && (
                <span className="hidden text-lg">{asset.icon}</span>
              )}
              <div className="flex-1 text-xs">
                <div className="font-medium">
                  {key === 'bricks' ? 'الطوب' :
                   key === 'cement' ? 'الإسمنت' :
                   key === 'sand' ? 'الرمل' :
                   key === 'steel' ? 'الحديد' :
                   key === 'gravel' ? 'الحصى' :
                   key === 'mortar' ? 'المونة' : key}
                </div>
                <div className="text-muted-foreground">
                  {typeof value === 'number' ? value.toLocaleString('ar-DZ', { maximumFractionDigits: 1 }) : value}
                  {key === 'bricks' ? ' وحدة' :
                   key === 'cement' ? ' كيس' :
                   key === 'steel' ? ' كغ' : ' م³'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <span>🔧</span>
            حاسبة المواد المتقدمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wall" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wall" className="flex items-center gap-2">
                <span>🧱</span>
                الجدران
              </TabsTrigger>
              <TabsTrigger value="slab" className="flex items-center gap-2">
                <span>🏗️</span>
                البلاطات
              </TabsTrigger>
              <TabsTrigger value="foundation" className="flex items-center gap-2">
                <span>🏗️</span>
                الأساسات
              </TabsTrigger>
            </TabsList>

            {/* Wall Calculator */}
            <TabsContent value="wall" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📏</span>
                    الطول (متر)
                  </Label>
                  <Input
                    type="number"
                    value={wallData.length}
                    onChange={(e) => setWallData(prev => ({ ...prev, length: e.target.value }))}
                    className="input-arabic"
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📐</span>
                    الارتفاع (متر)
                  </Label>
                  <Input
                    type="number"
                    value={wallData.height}
                    onChange={(e) => setWallData(prev => ({ ...prev, height: e.target.value }))}
                    className="input-arabic"
                    placeholder="3"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📏</span>
                    السمك (سم)
                  </Label>
                  <Input
                    type="number"
                    value={wallData.thickness}
                    onChange={(e) => setWallData(prev => ({ ...prev, thickness: e.target.value }))}
                    className="input-arabic"
                    placeholder="20"
                  />
                </div>
              </div>

              <MaterialResult 
                title="المواد المطلوبة للجدار"
                materials={wallMaterials}
                icon="🧱"
              />
            </TabsContent>

            {/* Slab Calculator */}
            <TabsContent value="slab" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📏</span>
                    الطول (متر)
                  </Label>
                  <Input
                    type="number"
                    value={slabData.length}
                    onChange={(e) => setSlabData(prev => ({ ...prev, length: e.target.value }))}
                    className="input-arabic"
                    placeholder="8"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📐</span>
                    العرض (متر)
                  </Label>
                  <Input
                    type="number"
                    value={slabData.width}
                    onChange={(e) => setSlabData(prev => ({ ...prev, width: e.target.value }))}
                    className="input-arabic"
                    placeholder="6"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📏</span>
                    السمك (سم)
                  </Label>
                  <Input
                    type="number"
                    value={slabData.thickness}
                    onChange={(e) => setSlabData(prev => ({ ...prev, thickness: e.target.value }))}
                    className="input-arabic"
                    placeholder="15"
                  />
                </div>
              </div>

              <MaterialResult 
                title="المواد المطلوبة للبلاطة"
                materials={slabMaterials}
                icon="🏗️"
              />
            </TabsContent>

            {/* Foundation Calculator */}
            <TabsContent value="foundation" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📏</span>
                    الطول (متر)
                  </Label>
                  <Input
                    type="number"
                    value={foundationData.length}
                    onChange={(e) => setFoundationData(prev => ({ ...prev, length: e.target.value }))}
                    className="input-arabic"
                    placeholder="12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📐</span>
                    العرض (متر)
                  </Label>
                  <Input
                    type="number"
                    value={foundationData.width}
                    onChange={(e) => setFoundationData(prev => ({ ...prev, width: e.target.value }))}
                    className="input-arabic"
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>📏</span>
                    العمق (متر)
                  </Label>
                  <Input
                    type="number"
                    value={foundationData.depth}
                    onChange={(e) => setFoundationData(prev => ({ ...prev, depth: e.target.value }))}
                    className="input-arabic"
                    placeholder="1.5"
                  />
                </div>
              </div>

              <MaterialResult 
                title="المواد المطلوبة للأساسات"
                materials={foundationMaterials}
                icon="🏗️"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-info/10 border border-info rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-info mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-info flex items-center gap-1">
                  <span>💡</span>
                  ملاحظة مهمة
                </p>
                <p className="text-muted-foreground mt-1">
                  هذه الحسابات تقديرية وقد تختلف حسب نوع المواد وطريقة التنفيذ. 
                  ننصح بإضافة 10-15% كاحتياطي للهدر واستشارة مهندس مختص.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialCalculator;