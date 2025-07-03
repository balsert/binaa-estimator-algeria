# حاسبة مواد البناء - تطبيق Android

تطبيق موبايل لحساب كميات وتكاليف مواد البناء مصمم خصيصاً للسوق الجزائري والعربي.

## المميزات

- 📱 تطبيق Android أصلي باستخدام Capacitor
- 🏗️ حساب دقيق لكميات مواد البناء
- 💰 تقدير التكلفة مع أسعار قابلة للتعديل
- 💾 حفظ المشاريع محلياً
- 🌐 يعمل بدون إنترنت
- 🇩🇿 مصمم للسوق الجزائري
- 📊 تقارير مفصلة قابلة للتصدير

## متطلبات التطوير

- Node.js 18+
- Android Studio
- Java Development Kit (JDK) 11+
- Android SDK

## التثبيت والتطوير

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. بناء التطبيق للويب

```bash
npm run build
```

### 3. إضافة منصة Android (مرة واحدة فقط)

```bash
npm run capacitor:add
```

### 4. مزامنة الملفات مع Android

```bash
npm run capacitor:sync
```

### 5. فتح Android Studio

```bash
npm run android:open
```

### 6. تطوير مع إعادة التحميل التلقائي

```bash
npm run android:dev
```

## بناء APK للإنتاج

### 1. بناء التطبيق

```bash
npm run android:build
```

### 2. في Android Studio:

1. اذهب إلى `Build` > `Generate Signed Bundle / APK`
2. اختر `APK`
3. قم بإنشاء أو اختيار keystore
4. اختر `release` build variant
5. انقر على `Finish`

## الميزات التقنية

### Capacitor Plugins المستخدمة

- **@capacitor/app**: إدارة دورة حياة التطبيق
- **@capacitor/status-bar**: تخصيص شريط الحالة
- **@capacitor/splash-screen**: شاشة البداية
- **@capacitor/keyboard**: إدارة لوحة المفاتيح
- **@capacitor/haptics**: ردود الفعل اللمسية

### تحسينات الموبايل

- تصميم متجاوب للشاشات المختلفة
- دعم الأجهزة ذات الشق (notch)
- منع التكبير عند التركيز على الحقول
- تحسين اللمس والتفاعل
- إدارة لوحة المفاتيح

### قاعدة البيانات المحلية

- استخدام Dexie.js مع IndexedDB
- تخزين محلي بدون إنترنت
- نسخ احتياطي وإستعادة البيانات

## هيكل المشروع

```
├── android/                 # ملفات Android الأصلية
├── src/
│   ├── components/          # مكونات React
│   ├── pages/              # صفحات التطبيق
│   ├── hooks/              # React Hooks مخصصة
│   ├── lib/                # مكتبات ووظائف مساعدة
│   └── utils/              # أدوات مساعدة
├── public/                 # ملفات عامة
├── capacitor.config.ts     # إعدادات Capacitor
└── package.json           # تبعيات المشروع
```

## الأوامر المفيدة

```bash
# تطوير الويب
npm run dev

# بناء للويب
npm run build

# مزامنة مع Android
npm run capacitor:sync

# فتح Android Studio
npm run android:open

# بناء APK
npm run android:build

# تشغيل على جهاز/محاكي
npm run android:dev
```

## نشر التطبيق

### Google Play Store

1. قم بإنشاء حساب مطور على Google Play Console
2. قم ببناء APK موقع للإنتاج
3. ارفع APK إلى Play Console
4. املأ معلومات التطبيق والوصف
5. اتبع إرشادات المراجعة

### التوزيع المباشر

يمكن توزيع ملف APK مباشرة للمستخدمين لتثبيته يدوياً.

## الدعم والمساهمة

- تم تطوير التطبيق بحب للمجتمع العربي 🇩🇿❤️
- يمكن المساهمة في تطوير التطبيق عبر GitHub
- للدعم الفني، يرجى فتح issue في المستودع

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام المجاني.