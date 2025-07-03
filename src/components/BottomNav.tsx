import { motion } from "framer-motion";
import { Home, Calculator, FolderOpen, Settings, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCapacitor } from "@/hooks/useCapacitor";

const BottomNav = () => {
  const location = useLocation();
  const { hapticFeedback } = useCapacitor();

  const navItems = [
    {
      icon: Home,
      label: "الرئيسية",
      path: "/",
    },
    {
      icon: Calculator,
      label: "حاسبة",
      path: "/calculator",
    },
    {
      icon: BarChart3,
      label: "التحليلات",
      path: "/analytics",
    },
    {
      icon: FolderOpen,
      label: "مشاريعي",
      path: "/projects",
    },
    {
      icon: Settings,
      label: "الإعدادات",
      path: "/settings",
    },
  ];

  const handleNavClick = () => {
    hapticFeedback();
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-construction z-50 safe-area-bottom"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 touch-target",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "scale-110"
                )} 
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;