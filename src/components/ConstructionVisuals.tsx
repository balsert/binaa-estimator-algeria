import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ConstructionVisualsProps {
  length: number;
  width: number;
  floors: number;
  includeWall: boolean;
  includeSlab: boolean;
}

const ConstructionVisuals = ({ 
  length, 
  width, 
  floors, 
  includeWall, 
  includeSlab 
}: ConstructionVisualsProps) => {
  const area = length * width;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-construction">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-4 text-center">مخطط المشروع</h3>
          
          {/* 3D Building Visualization */}
          <div className="relative bg-gradient-to-b from-sky-200 to-sky-100 rounded-lg p-8 mb-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-2 left-4">
              <div className="text-yellow-400 text-2xl">☀️</div>
            </div>
            <div className="absolute top-4 right-8">
              <div className="text-white text-lg">☁️</div>
            </div>
            
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-400 to-green-300"></div>
            
            {/* Building Structure */}
            <div className="relative flex items-end justify-center h-40">
              {/* Perimeter Wall */}
              {includeWall && (
                <div className="absolute bottom-8 left-4 right-4 h-6 bg-gray-400 rounded-sm opacity-60 border-2 border-gray-500"></div>
              )}
              
              {/* Main Building */}
              <div className="relative">
                {/* Foundation/Slab */}
                {includeSlab && (
                  <div className="absolute bottom-0 w-24 h-2 bg-gray-600 rounded-sm transform translate-y-1"></div>
                )}
                
                {/* Building Floors */}
                {Array.from({ length: floors }, (_, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-12 bg-gradient-to-r from-orange-200 to-orange-300 border-2 border-orange-400 mb-1"
                    style={{
                      transform: `translateY(-${i * 2}px) translateX(-${i * 1}px)`,
                      zIndex: floors - i
                    }}
                  >
                    {/* Windows */}
                    <div className="absolute top-2 left-2 w-3 h-3 bg-sky-300 border border-sky-400"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-sky-300 border border-sky-400"></div>
                    
                    {/* Door (only on ground floor) */}
                    {i === 0 && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-brown-600 border border-brown-700"></div>
                    )}
                  </div>
                ))}
                
                {/* Roof */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-12 border-r-12 border-b-6 border-l-transparent border-r-transparent border-b-red-600"></div>
              </div>
            </div>
            
            {/* Construction Equipment */}
            <div className="absolute bottom-8 left-8">
              <div className="text-2xl">🚛</div>
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="text-2xl">🏗️</div>
            </div>
          </div>
          
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl mb-1">📐</div>
              <div className="text-sm text-muted-foreground">المساحة</div>
              <div className="font-bold">{area} م²</div>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-2xl mb-1">🏢</div>
              <div className="text-sm text-muted-foreground">الطوابق</div>
              <div className="font-bold">{floors}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConstructionVisuals;