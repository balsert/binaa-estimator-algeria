import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, Project } from "@/lib/database";

const ProjectComparison = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = await db.projects.toArray();
      setProjects(allProjects);
    };
    loadProjects();
  }, []);

  const compareProjects = projects.filter(p => 
    selectedProjects.includes(p.id?.toString() || '')
  );

  const getComparisonData = () => {
    if (compareProjects.length < 2) return null;

    const [project1, project2] = compareProjects;
    const costDiff = project2.finalCost - project1.finalCost;
    const costDiffPercent = ((costDiff / project1.finalCost) * 100).toFixed(1);
    const areaDiff = (project2.length * project2.width) - (project1.length * project1.width);

    return {
      project1,
      project2,
      costDiff,
      costDiffPercent: parseFloat(costDiffPercent),
      areaDiff
    };
  };

  const comparisonData = getComparisonData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="card-construction">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            مقارنة المشاريع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">المشروع الأول</label>
              <Select
                value={selectedProjects[0] || ""}
                onValueChange={(value) => 
                  setSelectedProjects(prev => [value, prev[1] || ""])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع الأول" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id?.toString() || ""}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">المشروع الثاني</label>
              <Select
                value={selectedProjects[1] || ""}
                onValueChange={(value) => 
                  setSelectedProjects(prev => [prev[0] || "", value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المشروع الثاني" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id?.toString() || ""}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {comparisonData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">{comparisonData.project1.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div>المساحة: {comparisonData.project1.length}×{comparisonData.project1.width}م</div>
                    <div>التكلفة: {comparisonData.project1.finalCost.toLocaleString('ar-DZ')} د.ج</div>
                    <div>التكلفة/م²: {(comparisonData.project1.finalCost / (comparisonData.project1.length * comparisonData.project1.width)).toLocaleString('ar-DZ', { maximumFractionDigits: 0 })} د.ج</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">{comparisonData.project2.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div>المساحة: {comparisonData.project2.length}×{comparisonData.project2.width}م</div>
                    <div>التكلفة: {comparisonData.project2.finalCost.toLocaleString('ar-DZ')} د.ج</div>
                    <div>التكلفة/م²: {(comparisonData.project2.finalCost / (comparisonData.project2.length * comparisonData.project2.width)).toLocaleString('ar-DZ', { maximumFractionDigits: 0 })} د.ج</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  {comparisonData.costDiffPercent > 0 ? (
                    <TrendingUp className="h-4 w-4 text-destructive" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-success" />
                  )}
                  نتائج المقارنة
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">فرق التكلفة</div>
                    <div className={`font-medium ${comparisonData.costDiff > 0 ? 'text-destructive' : 'text-success'}`}>
                      {comparisonData.costDiff > 0 ? '+' : ''}{comparisonData.costDiff.toLocaleString('ar-DZ')} د.ج
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">النسبة المئوية</div>
                    <div className={`font-medium ${comparisonData.costDiffPercent > 0 ? 'text-destructive' : 'text-success'}`}>
                      {comparisonData.costDiffPercent > 0 ? '+' : ''}{comparisonData.costDiffPercent}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">فرق المساحة</div>
                    <div className="font-medium">
                      {comparisonData.areaDiff > 0 ? '+' : ''}{comparisonData.areaDiff} م²
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!comparisonData && selectedProjects.filter(Boolean).length > 0 && (
            <div className="text-center text-muted-foreground py-8">
              يرجى اختيار مشروعين للمقارنة
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectComparison;