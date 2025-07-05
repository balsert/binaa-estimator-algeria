import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  completed: boolean;
}

interface ConstructionStepsProps {
  currentStep?: number;
}

const ConstructionSteps = ({ currentStep = 1 }: ConstructionStepsProps) => {
  const steps: Step[] = [
    {
      id: 1,
      title: "التخطيط والتصميم",
      description: "وضع المخططات وحساب المواد",
      icon: "📐",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&h=100&fit=crop",
      completed: currentStep >= 1
    },
    {
      id: 2,
      title: "الحفر والأساسات",
      description: "حفر الأرض وصب الأساسات",
      icon: "🏗️",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=150&h=100&fit=crop",
      completed: currentStep >= 2
    },
    {
      id: 3,
      title: "البناء والجدران",
      description: "بناء الجدران والهيكل الأساسي",
      icon: "🧱",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=100&fit=crop",
      completed: currentStep >= 3
    },
    {
      id: 4,
      title: "السقف والتشطيبات",
      description: "إنجاز السقف والتشطيبات النهائية",
      icon: "🏠",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=150&h=100&fit=crop",
      completed: currentStep >= 4
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="card-construction">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-6 text-center">مراحل البناء</h3>
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  step.completed 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-muted/50'
                }`}
              >
                <div className="relative">
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-16 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute -top-2 -right-2">
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6 text-success bg-white rounded-full" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground bg-white rounded-full" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{step.icon}</span>
                    <h4 className={`font-semibold ${
                      step.completed ? 'text-success' : 'text-foreground'
                    }`}>
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                
                <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                  step.completed 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? 'مكتمل' : 'قادم'}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ConstructionSteps;