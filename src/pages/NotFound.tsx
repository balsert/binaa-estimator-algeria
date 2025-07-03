import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-subtle flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-4"
      >
        <Card className="card-construction text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6">
              عذراً، الصفحة غير موجودة
            </p>
            <p className="text-muted-foreground mb-6">
              الصفحة التي تبحث عنها قد تكون محذوفة أو غير متاحة
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 ml-2" />
                العودة
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex-1 btn-construction"
              >
                <Home className="h-4 w-4 ml-2" />
                الرئيسية
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
