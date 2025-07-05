import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

const MaterialCalculator = () => {
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
            <Calculator className="h-6 w-6" />
            حاسبة المواد المتخصصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            أدوات حساب دقيقة لمختلف مواد البناء - قريباً
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialCalculator;