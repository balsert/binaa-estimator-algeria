import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  Grid3X3, 
  Download,
  Save,
  Undo,
  Redo
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FloorPlanControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  showDimensions: boolean;
  onShowDimensionsChange: (show: boolean) => void;
  onSave: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const FloorPlanControls: React.FC<FloorPlanControlsProps> = ({
  zoom,
  onZoomChange,
  showGrid,
  onShowGridChange,
  showDimensions,
  onShowDimensionsChange,
  onSave,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <Card className="card-construction">
      <CardContent className="p-4 space-y-4">
        {/* Zoom Controls */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">التكبير: {Math.round(zoom * 100)}%</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => onZoomChange(value)}
              min={0.5}
              max={2}
              step={0.1}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
              disabled={zoom >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Display Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="showGrid" className="text-sm">عرض الشبكة</Label>
            <Switch
              id="showGrid"
              checked={showGrid}
              onCheckedChange={onShowGridChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="showDimensions" className="text-sm">عرض الأبعاد</Label>
            <Switch
              id="showDimensions"
              checked={showDimensions}
              onCheckedChange={onShowDimensionsChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-2"
          >
            <Undo className="h-4 w-4" />
            تراجع
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-2"
          >
            <Redo className="h-4 w-4" />
            إعادة
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            حفظ
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• انقر واسحب لتحريك الغرف</div>
            <div>• انقر على الزاوية لتغيير الحجم</div>
            <div>• انقر على المساحة الفارغة لإلغاء التحديد</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};