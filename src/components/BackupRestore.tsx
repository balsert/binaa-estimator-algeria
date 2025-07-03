import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Upload, Database, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/database";

const BackupRestore = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const projects = await db.projects.toArray();
      const settings = await db.settings.toArray();
      
      const backup = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: {
          projects,
          settings
        }
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-construction-calculator-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير النسخة الاحتياطية من البيانات",
        variant: "default"
      });
    } catch (error) {
      console.error('خطأ في التصدير:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.data || !backup.version) {
        throw new Error('ملف النسخة الاحتياطية غير صالح');
      }

      // Clear existing data
      await db.projects.clear();
      await db.settings.clear();

      // Import projects
      if (backup.data.projects?.length > 0) {
        await db.projects.bulkAdd(backup.data.projects);
      }

      // Import settings
      if (backup.data.settings?.length > 0) {
        await db.settings.bulkAdd(backup.data.settings);
      }

      toast({
        title: "تم الاستيراد بنجاح",
        description: `تم استيراد ${backup.data.projects?.length || 0} مشروع`,
        variant: "default"
      });

      // Refresh page to reload data
      window.location.reload();
    } catch (error) {
      console.error('خطأ في الاستيراد:', error);
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد البيانات. تأكد من صحة الملف.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            النسخ الاحتياطي والاستعادة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-warning/10 border border-warning rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">تنبيه مهم</p>
                <p className="text-muted-foreground mt-1">
                  عملية الاستيراد ستحذف جميع البيانات الحالية وتستبدلها بالبيانات المستوردة.
                  تأكد من عمل نسخة احتياطية قبل الاستيراد.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={exportData}
              disabled={isExporting}
              className="h-auto p-4 flex flex-col gap-2"
              variant="outline"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              ) : (
                <Download className="h-6 w-6" />
              )}
              <div className="text-center">
                <div className="font-medium">تصدير البيانات</div>
                <div className="text-xs text-muted-foreground">
                  حفظ نسخة احتياطية من جميع المشاريع والإعدادات
                </div>
              </div>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                disabled={isImporting}
                className="w-full h-auto p-4 flex flex-col gap-2"
                variant="outline"
              >
                {isImporting ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                ) : (
                  <Upload className="h-6 w-6" />
                )}
                <div className="text-center">
                  <div className="font-medium">استيراد البيانات</div>
                  <div className="text-xs text-muted-foreground">
                    استعادة البيانات من نسخة احتياطية
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BackupRestore;