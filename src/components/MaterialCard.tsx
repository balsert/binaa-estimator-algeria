import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface MaterialCardProps {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  totalCost: number;
  image: string;
  icon: string;
  color: string;
  index: number;
}

const MaterialCard = ({ 
  name, 
  quantity, 
  unit, 
  price, 
  totalCost, 
  image, 
  icon, 
  color, 
  index 
}: MaterialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <Card className="card-construction overflow-hidden hover:shadow-construction transition-all duration-300">
        <div className={`h-2 ${color}`}></div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full ${color} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <img 
                  src={image} 
                  alt={name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.textContent = icon;
                  }}
                />
                <span className="text-2xl hidden">{icon}</span>
              </div>
              <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${color} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-foreground">{name}</h3>
              <p className="text-muted-foreground text-sm">مادة بناء أساسية</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">الكمية المطلوبة:</span>
              <span className="font-semibold">
                {quantity.toLocaleString('ar-DZ', { maximumFractionDigits: 1 })} {unit}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">السعر لكل وحدة:</span>
              <span className="font-semibold">
                {price.toLocaleString('ar-DZ')} د.ج
              </span>
            </div>
            
            <div className={`flex justify-between items-center p-3 rounded-lg ${color} bg-opacity-10`}>
              <span className="font-bold">التكلفة الإجمالية:</span>
              <span className="font-bold text-lg">
                {totalCost.toLocaleString('ar-DZ')} د.ج
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialCard;