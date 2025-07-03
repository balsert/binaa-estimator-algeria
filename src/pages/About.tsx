import { motion } from "framer-motion";
import { ArrowLeft, Info, Calculator, HelpCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🏗️",
      title: "حساب دقيق",
      description: "حساب كميات المواد بناءً على معادلات هندسية معتمدة"
    },
    {
      icon: "💰",
      title: "تقدير التكلفة",
      description: "حساب التكلفة الإجمالية مع إمكانية تعديل الأسعار"
    },
    {
      icon: "📱",
      title: "يعمل بدون إنترنت",
      description: "تطبيق PWA يعمل بدون اتصال بالإنترنت"
    },
    {
      icon: "💾",
      title: "حفظ المشاريع",
      description: "حفظ واستعراض المشاريع السابقة في أي وقت"
    },
    {
      icon: "🇩🇿",
      title: "مصمم للجزائر",
      description: "أسعار وطرق حساب مخصصة للسوق الجزائري"
    },
    {
      icon: "📊",
      title: "تقارير مفصلة",
      description: "عرض تفصيلي للكميات والتكاليف مع إمكانية المشاركة"
    }
  ];

  const materials = [
    { name: "الطوب/البلوك", formula: "حجم الجدران × 400 وحدة/م³" },
    { name: "الإسمنت", formula: "حجم الخرسانة والمونة × 7 أكياس/م³" },
    { name: "الرمل", formula: "حجم الإسمنت × 0.5 م³" },
    { name: "الحديد", formula: "حجم الخرسانة × 80 كغ/م³" },
    { name: "الحصى", formula: "حجم الخرسانة × 0.8 م³" }
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
        <div className="container mx-auto px-4 py-4">
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
              <Info className="h-6 w-6" />
              <h1 className="text-xl font-bold">عن التطبيق</h1>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="card-construction">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <CardTitle className="text-2xl">حاسبة مواد البناء</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground mb-4">
                تطبيق مجاني ومتطور لحساب كميات وتكاليف مواد البناء
              </p>
              <p className="text-muted-foreground">
                صُمم خصيصاً للمقاولين والمهندسين والأشخاص الذين يخططون لبناء منازلهم في الجزائر والمنطقة العربية.
                يوفر التطبيق حسابات دقيقة ومفصلة لجميع المواد المطلوبة بناءً على أبعاد البناء ومواصفاته.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle>المميزات الرئيسية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start gap-3 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle>كيف يعمل التطبيق؟</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl mb-2">📏</div>
                  <h4 className="font-semibold mb-1">1. أدخل الأبعاد</h4>
                  <p className="text-sm text-muted-foreground">طول وعرض الأرض وعدد الطوابق</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl mb-2">⚙️</div>
                  <h4 className="font-semibold mb-1">2. اختر الخيارات</h4>
                  <p className="text-sm text-muted-foreground">نوع السقف والجدران والإضافات</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl mb-2">🧮</div>
                  <h4 className="font-semibold mb-1">3. احسب المواد</h4>
                  <p className="text-sm text-muted-foreground">الحصول على الكميات المطلوبة</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl mb-2">💾</div>
                  <h4 className="font-semibold mb-1">4. احفظ المشروع</h4>
                  <p className="text-sm text-muted-foreground">حفظ واستعراض النتائج لاحقاً</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Calculation Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="card-construction">
            <CardHeader>
              <CardTitle>طرق الحساب</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                يستخدم التطبيق معادلات هندسية معتمدة لحساب كميات المواد:
              </p>
              <div className="space-y-3">
                {materials.map((material, index) => (
                  <motion.div
                    key={material.name}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <span className="font-medium">{material.name}</span>
                    <span className="text-sm text-muted-foreground font-mono">
                      {material.formula}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="card-construction bg-warning/10 border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                نصائح مهمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-warning">⚠️</span>
                <p className="text-sm">
                  هذه الحسابات تقديرية وقد تختلف حسب طبيعة الأرض وطريقة البناء
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary">💡</span>
                <p className="text-sm">
                  ننصح بإضافة نسبة احتياطي 10-15% لتغطية الهدر والطوارئ
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-success">✅</span>
                <p className="text-sm">
                  تأكد من مراجعة الأسعار مع الموردين المحليين قبل الشراء
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent">🔧</span>
                <p className="text-sm">
                  يمكنك تعديل الأسعار من الإعدادات لتناسب السوق المحلي
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="card-construction">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                الإصدار 1.0 • تطبيق ويب تقدمي (PWA)
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                تم التطوير بحب للمجتمع العربي 🇩🇿❤️
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default About;