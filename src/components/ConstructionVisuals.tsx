import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Maximize2, Users, Bath, ChefHat, Bed, Sofa, Car } from "lucide-react";
import { useState } from "react";

interface FloorPlanProps {
  length: number;
  width: number;
  floors: number;
  rooms?: number;
  bathrooms?: number;
  includeWall?: boolean;
  includeSlab?: boolean;
}

interface Room {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const ConstructionVisuals = ({ length, width, floors, rooms, bathrooms, includeWall, includeSlab }: FloorPlanProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  // Calculate scale for responsive display
  const maxDisplaySize = 400;
  const actualScale = Math.min(maxDisplaySize / Math.max(length, width), 20);
  const displayLength = length * actualScale;
  const displayWidth = width * actualScale;

  // Generate room layout based on dimensions
  const generateRoomLayout = (): Room[] => {
    const roomList: Room[] = [];
    const totalRooms = rooms || 4;
    const totalBathrooms = bathrooms || 1;
    
    // Main living room (30% of area)
    const livingWidth = displayLength * 0.6;
    const livingHeight = displayWidth * 0.5;
    roomList.push({
      id: 'living',
      name: 'الصالون',
      icon: '🛋️',
      x: 10,
      y: 10,
      width: livingWidth,
      height: livingHeight,
      color: 'bg-blue-100 border-blue-300'
    });

    // Kitchen (15% of area)
    const kitchenWidth = displayLength * 0.35;
    const kitchenHeight = displayWidth * 0.3;
    roomList.push({
      id: 'kitchen',
      name: 'المطبخ',
      icon: '🍳',
      x: livingWidth + 20,
      y: 10,
      width: kitchenWidth,
      height: kitchenHeight,
      color: 'bg-orange-100 border-orange-300'
    });

    // Master bedroom (20% of area)
    const masterWidth = displayLength * 0.4;
    const masterHeight = displayWidth * 0.4;
    roomList.push({
      id: 'master',
      name: 'غرفة النوم الرئيسية',
      icon: '🛏️',
      x: 10,
      y: livingHeight + 20,
      width: masterWidth,
      height: masterHeight,
      color: 'bg-purple-100 border-purple-300'
    });

    // Additional bedrooms
    const bedroomWidth = displayLength * 0.3;
    const bedroomHeight = displayWidth * 0.35;
    if (totalRooms > 1) {
      roomList.push({
        id: 'bedroom2',
        name: 'غرفة نوم 2',
        icon: '🛏️',
        x: masterWidth + 20,
        y: livingHeight + 20,
        width: bedroomWidth,
        height: bedroomHeight,
        color: 'bg-green-100 border-green-300'
      });
    }

    if (totalRooms > 2) {
      roomList.push({
        id: 'bedroom3',
        name: 'غرفة نوم 3',
        icon: '🛏️',
        x: masterWidth + bedroomWidth + 30,
        y: livingHeight + 20,
        width: bedroomWidth,
        height: bedroomHeight,
        color: 'bg-pink-100 border-pink-300'
      });
    }

    // Bathrooms
    const bathroomWidth = displayLength * 0.15;
    const bathroomHeight = displayWidth * 0.2;
    for (let i = 0; i < totalBathrooms; i++) {
      roomList.push({
        id: `bathroom${i + 1}`,
        name: `حمام ${i + 1}`,
        icon: '🚿',
        x: kitchenWidth + 30 + (i * (bathroomWidth + 10)),
        y: kitchenHeight + 20,
        width: bathroomWidth,
        height: bathroomHeight,
        color: 'bg-cyan-100 border-cyan-300'
      });
    }

    return roomList;
  };

  const roomLayout = generateRoomLayout();
  const totalArea = length * width;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Home className="h-5 w-5" />
            معلومات المشروع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{length}×{width}</div>
              <div className="text-sm text-muted-foreground">الأبعاد (متر)</div>
            </div>
            
            <div className="text-center p-3 bg-secondary/10 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{totalArea}</div>
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

      {/* Interactive Floor Plan */}
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Maximize2 className="h-5 w-5" />
            مخطط الطابق التفاعلي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Floor Plan Viewer */}
          <div className="relative bg-gray-50 rounded-lg p-6 overflow-auto" style={{ minHeight: '400px' }}>
            <div className="relative mx-auto" style={{ 
              width: `${displayLength + 40}px`, 
              height: `${displayWidth + 40}px`,
              minWidth: '300px',
              minHeight: '300px'
            }}>
              {/* House outline */}
              <div 
                className="absolute border-4 border-gray-800 bg-white/80 rounded-lg shadow-lg"
                style={{
                  width: `${displayLength}px`,
                  height: `${displayWidth}px`,
                  left: '20px',
                  top: '20px'
                }}
              >
                {/* Rooms */}
                {roomLayout.map((room) => (
                  <motion.div
                    key={room.id}
                    className={`absolute cursor-pointer border-2 rounded-md ${room.color} ${
                      selectedRoom === room.id ? 'ring-4 ring-primary ring-opacity-50 scale-105' : ''
                    } transition-all duration-300 hover:shadow-lg flex items-center justify-center text-center p-2`}
                    style={{
                      left: `${room.x}px`,
                      top: `${room.y}px`,
                      width: `${room.width}px`,
                      height: `${room.height}px`
                    }}
                    onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: roomLayout.indexOf(room) * 0.1 }}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{room.icon}</div>
                      <div className="text-xs font-semibold text-gray-700 leading-tight">
                        {room.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((room.width * room.height) / (actualScale * actualScale))} م²
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Doors indicators */}
                <div className="absolute w-3 h-8 bg-yellow-400 rounded-full left-1/2 -translate-x-1/2" 
                     style={{ bottom: '-4px' }} 
                     title="المدخل الرئيسي" />
                
                {/* Windows indicators */}
                <div className="absolute w-8 h-2 bg-blue-400 rounded-full top-1/4" 
                     style={{ right: '-4px' }} 
                     title="نافذة" />
                <div className="absolute w-8 h-2 bg-blue-400 rounded-full top-3/4" 
                     style={{ left: '-4px' }} 
                     title="نافذة" />
              </div>

              {/* Compass */}
              <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                <div className="text-xs text-center">
                  <div className="font-bold text-red-500">↑</div>
                  <div className="text-gray-600">شمال</div>
                </div>
              </div>

              {/* Scale indicator */}
              <div className="absolute bottom-2 left-2 bg-white rounded-lg p-2 shadow-md text-xs">
                <div className="text-gray-600">المقياس: 1:{Math.round(1/actualScale * 100)}</div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          {selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-primary/5 rounded-lg p-4 border border-primary/20"
            >
              {(() => {
                const room = roomLayout.find(r => r.id === selectedRoom);
                if (!room) return null;
                const roomArea = Math.round((room.width * room.height) / (actualScale * actualScale));
                return (
                  <div className="text-center">
                    <div className="text-2xl mb-2">{room.icon}</div>
                    <h3 className="font-bold text-lg mb-2">{room.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">المساحة:</span>
                        <span className="font-semibold mr-2">{roomArea} م²</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">النسبة:</span>
                        <span className="font-semibold mr-2">{Math.round((roomArea / totalArea) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span>المدخل الرئيسي</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span>النوافذ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-800"></div>
              <span>الجدران الخارجية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-400"></div>
              <span>الجدران الداخلية</span>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 text-xl">💡</div>
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">نصائح للمخطط:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>انقر على أي غرفة لعرض تفاصيلها</li>
                  <li>المقاسات تقريبية وتعتمد على التصميم المعياري</li>
                  <li>يمكن تعديل التصميم حسب احتياجاتك</li>
                  <li>استشر مهندساً معمارياً للتصميم النهائي</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConstructionVisuals;