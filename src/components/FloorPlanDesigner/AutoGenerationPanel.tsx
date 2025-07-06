import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Wand2, Home, Building, Castle, Home as Apartment } from 'lucide-react';
import { generateProfessionalFloorPlan } from '@/utils/automaticFloorPlanGenerator';
import { useFloorPlanStore } from '@/stores/floorPlanStore';
import { useToast } from '@/hooks/use-toast';

interface AutoGenerationPanelProps {
  onGenerate?: () => void;
}

export const AutoGenerationPanel: React.FC<AutoGenerationPanelProps> = ({ onGenerate }) => {
  const { setFloorPlan } = useFloorPlanStore();
  const { toast } = useToast();
  
  const [dimensions, setDimensions] = useState({ width: 12, height: 10 });
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [includeKitchen, setIncludeKitchen] = useState(true);
  const [includeLiving, setIncludeLiving] = useState(true);
  const [includeDining, setIncludeDining] = useState(true);
  const [includeOffice, setIncludeOffice] = useState(false);
  const [includeStorage, setIncludeStorage] = useState(true);
  const [style, setStyle] = useState<'modern' | 'traditional' | 'villa' | 'apartment'>('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const generatedPlan = generateProfessionalFloorPlan({
        dimensions,
        bedrooms,
        bathrooms,
        includeKitchen,
        includeLiving,
        includeDining,
        includeOffice,
        includeStorage,
        style
      });
      
      setFloorPlan(generatedPlan);
      onGenerate?.();
      
      toast({
        title: "تم إنشاء المخطط بنجاح",
        description: `تم إنشاء مخطط احترافي للمنزل بأبعاد ${dimensions.width}×${dimensions.height} متر`,
      });
    } catch (error) {
      toast({
        title: "خطأ في إنشاء المخطط",
        description: "حدث خطأ أثناء إنشاء المخطط. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const styleOptions = [
    { value: 'modern', label: 'عصري', icon: Building },
    { value: 'traditional', label: 'تقليدي', icon: Home },
    { value: 'villa', label: 'فيلا', icon: Castle },
    { value: 'apartment', label: 'شقة', icon: Apartment }
  ];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          إنشاء مخطط تلقائي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dimensions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">أبعاد المنزل (متر)</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="width" className="text-xs text-muted-foreground">العرض</Label>
              <Input
                id="width"
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                min={6}
                max={30}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs text-muted-foreground">الطول</Label>
              <Input
                id="height"
                type="number"
                value={dimensions.height}
                onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                min={6}
                max={30}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Rooms Count */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">عدد الغرف</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bedrooms" className="text-xs text-muted-foreground">غرف النوم</Label>
              <Input
                id="bedrooms"
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                min={1}
                max={6}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="text-xs text-muted-foreground">الحمامات</Label>
              <Input
                id="bathrooms"
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                min={1}
                max={4}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Rooms */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">الغرف الإضافية</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="kitchen" className="text-sm">مطبخ</Label>
              <Switch
                id="kitchen"
                checked={includeKitchen}
                onCheckedChange={setIncludeKitchen}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="living" className="text-sm">صالة معيشة</Label>
              <Switch
                id="living"
                checked={includeLiving}
                onCheckedChange={setIncludeLiving}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dining" className="text-sm">غرفة طعام</Label>
              <Switch
                id="dining"
                checked={includeDining}
                onCheckedChange={setIncludeDining}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="office" className="text-sm">مكتب</Label>
              <Switch
                id="office"
                checked={includeOffice}
                onCheckedChange={setIncludeOffice}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="storage" className="text-sm">مخزن</Label>
              <Switch
                id="storage"
                checked={includeStorage}
                onCheckedChange={setIncludeStorage}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Style Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">نمط التصميم</Label>
          <Select value={style} onValueChange={(value: any) => setStyle(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Generation Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• المساحة الإجمالية: {dimensions.width * dimensions.height} م²</p>
          <p>• عدد الغرف: {bedrooms + bathrooms + (includeKitchen ? 1 : 0) + (includeLiving ? 1 : 0) + (includeDining ? 1 : 0) + (includeOffice ? 1 : 0) + (includeStorage ? 1 : 0)}</p>
          <p>• النمط: {styleOptions.find(s => s.value === style)?.label}</p>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              جاري الإنشاء...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              إنشاء مخطط احترافي
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};