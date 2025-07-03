import { motion } from "framer-motion";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import CostAnalytics from "@/components/CostAnalytics";
import ProjectComparison from "@/components/ProjectComparison";

const Analytics = () => {
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
              <BarChart3 className="h-6 w-6" />
              <h1 className="text-xl font-bold">التحليلات والإحصائيات</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
              <TabsTrigger value="comparison">مقارنة المشاريع</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics">
              <CostAnalytics />
            </TabsContent>
            
            <TabsContent value="comparison">
              <ProjectComparison />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;