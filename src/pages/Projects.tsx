import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FolderOpen, Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { db, Project } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await db.projects
          .orderBy('updatedAt')
          .reverse()
          .toArray();
        setProjects(allProjects);
      } catch (error) {
        console.error('خطأ في تحميل المشاريع:', error);
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل المشاريع",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [toast]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProject = async (projectId: number, projectName: string) => {
    if (window.confirm(`هل تريد حذف المشروع "${projectName}"؟`)) {
      try {
        await db.projects.delete(projectId);
        setProjects(prev => prev.filter(p => p.id !== projectId));
        toast({
          title: "تم الحذف",
          description: "تم حذف المشروع بنجاح",
          variant: "default"
        });
      } catch (error) {
        console.error('خطأ في الحذف:', error);
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف المشروع",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
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
                <FolderOpen className="h-6 w-6" />
                <h1 className="text-xl font-bold">مشاريعي</h1>
              </div>
            </div>
            <Button
              onClick={() => navigate('/calculator')}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المشاريع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-arabic pr-10"
            />
          </div>
        </motion.div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "لا توجد نتائج" : "لا توجد مشاريع محفوظة"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "جرب البحث بكلمات أخرى" 
                : "ابدأ بإنشاء مشروع جديد لحساب مواد البناء"
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => navigate('/calculator')}
                className="btn-construction"
              >
                <Plus className="h-4 w-4 ml-2" />
                مشروع جديد
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card className="card-construction hover:shadow-construction transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <Link 
                        to={`/project/${project.id}`}
                        className="flex-1"
                      >
                        <div className="text-right">
                          <h3 className="font-semibold text-lg mb-1">{project.name}</h3>
                          <div className="text-sm text-muted-foreground mb-2">
                            <div>المساحة: {project.length}م × {project.width}م</div>
                            <div>الطوابق: {project.floors} - المواد: {project.bricks.toLocaleString('ar-DZ')} طوبة</div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            آخر تحديث: {new Date(project.updatedAt).toLocaleDateString('ar-DZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </Link>
                      
                      <div className="flex items-center gap-4 mr-4">
                        <div className="text-left">
                          <div className="text-2xl font-bold text-primary">
                            {project.finalCost.toLocaleString('ar-DZ')}
                          </div>
                          <div className="text-sm text-muted-foreground">د.ج</div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteProject(project.id!, project.name);
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;