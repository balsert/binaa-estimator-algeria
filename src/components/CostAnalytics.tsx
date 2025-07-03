import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Package, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db, Project } from "@/lib/database";

const CostAnalytics = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const allProjects = await db.projects.toArray();
      setProjects(allProjects);
      
      if (allProjects.length > 0) {
        calculateAnalytics(allProjects);
      }
    };
    loadAnalytics();
  }, []);

  const calculateAnalytics = (projects: Project[]) => {
    const totalProjects = projects.length;
    const totalCost = projects.reduce((sum, p) => sum + p.finalCost, 0);
    const avgCost = totalCost / totalProjects;
    const avgArea = projects.reduce((sum, p) => sum + (p.length * p.width), 0) / totalProjects;
    const avgCostPerSqm = avgCost / avgArea;

    // Material cost breakdown
    const materialBreakdown = [
      {
        name: "الطوب",
        value: projects.reduce((sum, p) => sum + (p.bricks * p.brickPrice), 0),
        color: "#8884d8"
      },
      {
        name: "الإسمنت",
        value: projects.reduce((sum, p) => sum + (p.cement * p.cementPrice), 0),
        color: "#82ca9d"
      },
      {
        name: "الرمل",
        value: projects.reduce((sum, p) => sum + (p.sand * p.sandPrice), 0),
        color: "#ffc658"
      },
      {
        name: "الحديد",
        value: projects.reduce((sum, p) => sum + (p.steel * p.steelPrice), 0),
        color: "#ff7300"
      },
      {
        name: "الحصى",
        value: projects.reduce((sum, p) => sum + (p.gravel * p.gravelPrice), 0),
        color: "#00ff88"
      }
    ];

    // Monthly trends (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthProjects = projects.filter(p => {
        const projectDate = new Date(p.createdAt);
        return projectDate.getMonth() === date.getMonth() && 
               projectDate.getFullYear() === date.getFullYear();
      });
      
      monthlyData.push({
        month: date.toLocaleDateString('ar-DZ', { month: 'short' }),
        projects: monthProjects.length,
        cost: monthProjects.reduce((sum, p) => sum + p.finalCost, 0)
      });
    }

    setAnalytics({
      totalProjects,
      totalCost,
      avgCost,
      avgCostPerSqm,
      materialBreakdown,
      monthlyData
    });
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-construction">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المشاريع</p>
                <p className="text-2xl font-bold">{analytics.totalProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-construction">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التكلفة</p>
                <p className="text-lg font-bold">
                  {analytics.totalCost.toLocaleString('ar-DZ', { maximumFractionDigits: 0 })} د.ج
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-construction">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">متوسط التكلفة</p>
                <p className="text-lg font-bold">
                  {analytics.avgCost.toLocaleString('ar-DZ', { maximumFractionDigits: 0 })} د.ج
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-construction">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">التكلفة/م²</p>
                <p className="text-lg font-bold">
                  {analytics.avgCostPerSqm.toLocaleString('ar-DZ', { maximumFractionDigits: 0 })} د.ج
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Material Cost Breakdown */}
        <Card className="card-construction">
          <CardHeader>
            <CardTitle>توزيع تكلفة المواد</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.materialBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.materialBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value.toLocaleString('ar-DZ')} د.ج`, 'التكلفة']}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="card-construction">
          <CardHeader>
            <CardTitle>الاتجاهات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'projects' ? `${value} مشروع` : `${value.toLocaleString('ar-DZ')} د.ج`,
                    name === 'projects' ? 'عدد المشاريع' : 'التكلفة الإجمالية'
                  ]}
                />
                <Bar dataKey="projects" fill="#8884d8" name="projects" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default CostAnalytics;