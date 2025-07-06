import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2 } from 'lucide-react';
import { Layer } from '@/types/floorPlan';

interface LayerManagerProps {
  layers: Layer[];
  onLayerUpdate: (layerId: string, updates: Partial<Layer>) => void;
  onLayerAdd: () => void;
  onLayerDelete: (layerId: string) => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  onLayerUpdate,
  onLayerAdd,
  onLayerDelete
}) => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Layers</span>
          <Button variant="outline" size="sm" onClick={onLayerAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.id} className="space-y-2 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{layer.name}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLayerUpdate(layer.id, { visible: !layer.visible })}
                >
                  {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLayerUpdate(layer.id, { locked: !layer.locked })}
                >
                  {layer.locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLayerDelete(layer.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Opacity</span>
                <span className="text-xs">{Math.round(layer.opacity * 100)}%</span>
              </div>
              <Slider
                value={[layer.opacity]}
                onValueChange={([value]) => onLayerUpdate(layer.id, { opacity: value })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};