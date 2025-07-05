import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, FolderOpen, Settings, Info, Plus, BarChart3, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { db, Project } from "@/lib/database";
import { useCapacitor } from "@/hooks/useCapacitor";
import MaterialGallery from "@/components/MaterialGallery";
import ConstructionSteps from "@/components/ConstructionSteps";

const Home = () => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const { hapticFeedback } = useCapacitor();

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
      color: "btn-construction",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=100&h=60&fit=crop"
    },
    {
      title: "مشاريعي",
      description: "استعرض المشاريع المحفوظة",
      icon: FolderOpen,
      to: "/projects",
      color: "btn-earth",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100&h=60&fit=crop"
    },
    {
      title: "التحليلات",
      description: "إحصائيات ومقارنات المشاريع",
      icon: BarChart3,
      to: "/analytics",
      color: "bg-success text-success-foreground hover:bg-success/80",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=60&fit=crop"
    },
    {
      title: "أدوات البناء",
      description: "حاسبات متخصصة للمواد",
      icon: Wrench,
      to: "/tools",
      color: "bg-warning text-warning-foreground hover:bg-warning/80",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=100&h=60&fit=crop"
    },
    {
      title: "الإعدادات",
      description: "تعديل أسعار المواد والخيارات",
      icon: Settings,
      to: "/settings",
      color: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=60&fit=crop"
    },
    {
      title: "عن التطبيق",
      description: "تعليمات ونصائح البناء",
      icon: Info,
      to: "/about",
      color: "bg-muted text-muted-foreground hover:bg-muted/80",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=60&fit=crop"
    }
  ];

  const handleMenuClick = () => {
    hapticFeedback();
  };

  return (
    <div className="min-h-screen bg-subtle safe-area-top">
      {/* Header */}
      <motion.header 
        className="bg-construction text-primary-foreground shadow-construction relative overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-4xl">🏗️</div>
          <div className="absolute top-8 right-12 text-3xl">🧱</div>
          <div className="absolute bottom-4 left-16 text-2xl">🔨</div>
          <div className="absolute bottom-6 right-8 text-3xl">📐</div>
        </div>
        
        <div className="container mx-auto px-4 py-8 safe-area-left safe-area-right relative">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              className="animate-bounce-gentle"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Calculator className="h-8 w-8" />
              </div>
            </motion.div>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">حاسبة مواد البناء</h1>
              <p className="text-primary-foreground/90 text-lg">مقدر التكلفة والكميات الاحترافي</p>
              <p className="text-primary-foreground/70 text-sm mt-1">🇩🇿 مصمم خصيصاً للسوق الجزائري</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 safe-area-left safe-area-right space-y-8">
        {/* Welcome Card with Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-construction overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-primary to-primary-glow">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=200&fit=crop"
                alt="Construction site"
                className="w-full h-full object-cover opacity-30"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <h2 className="text-2xl font-bold mb-2">أهلاً وسهلاً</h2>
                  <p className="text-primary-foreground/90">
                    احسب كميات وتكاليف مواد البناء بدقة وسهولة
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Menu */}
        <motion.div 
          className="grid gap-4"
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
              <Link to={item.to} onClick={handleMenuClick}>
                <Card className="card-construction hover:shadow-construction transition-all duration-300 touch-target overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      <div className="relative w-24 h-20 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <div className={`hidden w-full h-full ${item.color} flex items-center justify-center`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className={`absolute top-2 right-2 p-1 rounded ${item.color}`}>
                          <item.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 p-4 text-right">
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
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
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📋</span>
              المشاريع الأخيرة
            </h3>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link to={`/project/${project.id}`} onClick={handleMenuClick}>
                    <Card className="card-construction hover:shadow-card transition-all duration-200 touch-target">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="text-right flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">🏠</span>
                              <h4 className="font-medium">{project.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              📐 {project.length}م × {project.width}م - 🏢 {project.floors} طوابق
                            </p>
                            <p className="text-xs text-muted-foreground">
                              📅 {new Date(project.updatedAt).toLocaleDateString('ar-DZ')}
                            </p>
                          </div>
                          <div className="text-left mr-4">
                            <p className="text-xl font-bold text-primary">
                              {project.finalCost.toLocaleString('ar-DZ')}
                            </p>
                            <p className="text-xs text-muted-foreground">دينار جزائري</p>
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

        {/* Construction Steps */}
        <ConstructionSteps currentStep={1} />

        {/* Material Gallery */}
        <MaterialGallery />

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <Card className="card-construction bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-bold mb-2">نصيحة اليوم</h3>
              <p className="text-muted-foreground">
                احرص على إضافة نسبة احتياطي 10-15% من المواد لتغطية الهدر والطوارئ
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;