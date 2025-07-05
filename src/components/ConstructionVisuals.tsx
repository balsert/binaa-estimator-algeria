import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

interface FloorPlanProps {
  length: number;
  width: number;
  floors: number;
  rooms?: number;
  bathrooms?: number;
  includeWall?: boolean;
  includeSlab?: boolean;
}

const ConstructionVisuals = ({ length, width, floors, rooms, bathrooms, includeWall, includeSlab }: FloorPlanProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Home className="h-5 w-5" />
            مخطط المنزل التفاعلي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{length}×{width}</div>
              <div className="text-sm text-muted-foreground">الأبعاد (متر)</div>
            </div>
            
            <div className="text-center p-3 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{length * width}</div>
              <div className="text-sm text-muted-foreground">المساحة (م²)</div>
            </div>
            
            <div className="text-center p-3 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">{floors}</div>
              <div className="text-sm text-muted-foreground">الطوابق</div>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{rooms || 0}</div>
              <div className="text-sm text-muted-foreground">الغرف</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConstructionVisuals;