import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { materialAssets, constructionTools } from "./MaterialIcons";

const MaterialGallery = () => {
  const materials = [
    { key: 'bricks', name: 'الطوب والبلوك', description: 'مواد البناء الأساسية' },
    { key: 'cement', name: 'الإسمنت', description: 'مادة الربط الرئيسية' },
    { key: 'sand', name: 'الرمل', description: 'للخلطات والمونة' },
    { key: 'steel', name: 'الحديد', description: 'التسليح والهيكل' },
    { key: 'gravel', name: 'الحصى', description: 'للخرسانة والأساسات' }
  ];

  const tools = [
    { key: 'hammer', name: 'المطرقة', description: 'أداة البناء الأساسية' },
    { key: 'drill', name: 'المثقاب', description: 'للحفر والتثبيت' },
    { key: 'level', name: 'الميزان', description: 'للقياس والضبط' },
    { key: 'crane', name: 'الرافعة', description: 'لرفع المواد الثقيلة' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Materials Section */}
      <Card className="card-construction">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-6 text-center">مواد البناء</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {materials.map((material, index) => {
              const asset = materialAssets[material.key as keyof typeof materialAssets];
              return (
                <motion.div
                  key={material.key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="relative mb-3">
                      <img 
                        src={asset.image} 
                        alt={material.name}
                        className="w-16 h-16 object-cover rounded-lg mx-auto group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-16 h-16 flex items-center justify-center text-3xl mx-auto">
                        {asset.icon}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${asset.color} flex items-center justify-center`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{material.name}</h4>
                    <p className="text-xs text-muted-foreground">{material.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tools Section */}
      <Card className="card-construction">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold mb-6 text-center">أدوات البناء</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map((tool, index) => {
              const asset = constructionTools[tool.key as keyof typeof constructionTools];
              return (
                <motion.div
                  key={tool.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                >
                  <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                    <div className="mb-3">
                      <img 
                        src={asset.image} 
                        alt={tool.name}
                        className="w-12 h-12 object-cover rounded-lg mx-auto group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-12 h-12 flex items-center justify-center text-2xl mx-auto">
                        {asset.icon}
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{tool.name}</h4>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialGallery;