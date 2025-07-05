import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

const MaterialGallery = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Package className="h-6 w-6" />
            معرض مواد البناء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            استعرض أسعار ومواصفات مواد البناء - قريباً
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MaterialGallery;