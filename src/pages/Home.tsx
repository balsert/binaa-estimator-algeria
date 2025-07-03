import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, FolderOpen, Settings, Info, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { db, Project } from "@/lib/database";

const Home = () => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadRecentProjects = async () => {
      try {
        const projects = await db.projects
          .orderBy('updatedAt')
          .reverse()
          .limit(3)
          .toArray();
        setRecentProjects(projects);
      } catch (error) {
        console.error('خطأ في تحميل المشاريع:', error);
      }
    };

    loadRecentProjects();
  }, []);

  const menuItems = [
    {
      title: "مشروع جديد",
      description: "ابدأ حساب تكلفة مواد البناء",
      icon: Plus,
      to: "/calculator",
      color: "btn-construction"
    },
    {
      title: "مشاريعي",
      description: "استعرض المشاريع المحفوظة",
      icon: FolderOpen,
      to: "/projects",
      color: "btn-earth"
    },
    {
      title: "الإعدادات",
      description: "تعديل أسعار المواد والخيارات",
      icon: Settings,
      to: "/settings",
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    },
    {
      title: "عن التطبيق",
      description: "تعليمات ونصائح البناء",
      icon: Info,
      to: "/about",
      color: "bg-muted text-muted-foreground hover:bg-muted/80"
    }
  ];

  return (
    <div className="min-h-screen bg-subtle">
      {/* Header */}
      <motion.header 
        className="bg-construction text-primary-foreground shadow-construction"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="animate-bounce-gentle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Calculator className="h-8 w-8" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">حاسبة مواد البناء</h1>
              <p className="text-primary-foreground/80 text-sm">مقدر التكلفة والكميات</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-construction mb-8">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">أهلاً وسهلاً</h2>
              <p className="text-muted-foreground">
                احسب كميات وتكاليف مواد البناء بدقة وسهولة
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Menu */}
        <motion.div 
          className="grid gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={item.to}>
                <Card className="card-construction hover:shadow-construction transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.color}`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold mb-4">المشاريع الأخيرة</h3>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link to={`/project/${project.id}`}>
                    <Card className="card-construction hover:shadow-card transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-right">
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {project.length}م × {project.width}م - {project.floors} طوابق
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-semibold text-primary">
                              {project.finalCost.toLocaleString('ar-DZ')} د.ج
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(project.updatedAt).toLocaleDateString('ar-DZ')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;