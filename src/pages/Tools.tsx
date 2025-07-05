import { motion } from "framer-motion";
import { ArrowLeft, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MaterialCalculator from "@/components/MaterialCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConstructionSteps from "@/components/ConstructionSteps";
import MaterialGallery from "@/components/MaterialGallery";
import BackupRestore from "@/components/BackupRestore";

const Tools = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-subtle">
      {/* Header */}
      <motion.header 
        className="bg-construction text-primary-foreground shadow-construction"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Wrench className="h-6 w-6" />
              <h1 className="text-xl font-bold">أدوات البناء</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator">الحاسبات</TabsTrigger>
            <TabsTrigger value="steps">خطوات البناء</TabsTrigger>
            <TabsTrigger value="gallery">معرض المواد</TabsTrigger>
            <TabsTrigger value="backup">النسخ الاحتياطي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <MaterialCalculator />
          </TabsContent>
          
          <TabsContent value="steps">
            <ConstructionSteps />
          </TabsContent>
          
          <TabsContent value="gallery">
            <MaterialGallery />
          </TabsContent>
          
          <TabsContent value="backup">
            <BackupRestore />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tools;