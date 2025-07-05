import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const BackupRestore = () => {
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
            <Shield className="h-6 w-6" />
            النسخ الاحتياطي واستعادة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            احمي بياناتك من الفقدان - قريباً
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BackupRestore;