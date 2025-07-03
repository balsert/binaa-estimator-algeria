import Dexie, { Table } from 'dexie';

export interface Project {
  id?: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Input data
  length: number; // الطول
  width: number; // العرض
  floors: number; // عدد الطوابق
  includeWall: boolean; // يشمل سور
  includeSlab: boolean; // يشمل بلاطة خرسانية
  roofType: 'concrete' | 'tiles' | 'none'; // نوع السقف
  wallThickness: number; // سمك الجدران (سم)
  ceilingHeight: number; // ارتفاع السقف (متر)
  
  // Optional fields
  rooms?: number; // عدد الغرف
  bathrooms?: number; // عدد الحمامات
  
  // Calculated quantities
  bricks: number; // الطوب/البلوك (عدد الوحدات)
  cement: number; // الإسمنت (عدد الأكياس 50 كغ)
  sand: number; // الرمل (متر مكعب)
  steel: number; // الحديد (كيلوغرام)
  gravel: number; // الحصى (متر مكعب)
  
  // Pricing
  brickPrice: number; // سعر الطوبة
  cementPrice: number; // سعر كيس الإسمنت
  sandPrice: number; // سعر متر مكعب الرمل
  steelPrice: number; // سعر كيلوغرام الحديد
  gravelPrice: number; // سعر متر مكعب الحصى
  
  // Total costs
  totalMaterialCost: number; // مجموع تكلفة المواد
  contingencyPercent: number; // نسبة الاحتياطي
  finalCost: number; // التكلفة النهائية
}

export interface AppSettings {
  id?: number;
  
  // Default prices (Algerian Dinar)
  defaultBrickPrice: number;
  defaultCementPrice: number;
  defaultSandPrice: number;
  defaultSteelPrice: number;
  defaultGravelPrice: number;
  
  // Default construction parameters
  defaultWallThickness: number;
  defaultCeilingHeight: number;
  defaultContingencyPercent: number;
  
  // App preferences
  showTutorial: boolean;
  lastBackupDate?: Date;
  
  updatedAt: Date;
}

export class ConstructionDB extends Dexie {
  projects!: Table<Project>;
  settings!: Table<AppSettings>;

  constructor() {
    super('ConstructionEstimatorDB');
    
    this.version(1).stores({
      projects: '++id, name, createdAt, updatedAt',
      settings: '++id, updatedAt'
    });
  }
}

export const db = new ConstructionDB();

// Initialize default settings
export const initializeSettings = async (): Promise<AppSettings> => {
  const existingSettings = await db.settings.orderBy('id').first();
  
  if (existingSettings) {
    return existingSettings;
  }
  
  const defaultSettings: AppSettings = {
    // Default Algerian prices (approximate as of 2024)
    defaultBrickPrice: 15, // DZD per brick
    defaultCementPrice: 800, // DZD per 50kg bag
    defaultSandPrice: 3500, // DZD per cubic meter
    defaultSteelPrice: 180, // DZD per kg
    defaultGravelPrice: 4000, // DZD per cubic meter
    
    // Construction defaults
    defaultWallThickness: 20, // cm
    defaultCeilingHeight: 3.0, // meters
    defaultContingencyPercent: 10, // 10%
    
    showTutorial: true,
    updatedAt: new Date()
  };
  
  await db.settings.add(defaultSettings);
  return defaultSettings;
};

// Material calculation formulas
export const calculateMaterials = (input: Partial<Project>): Partial<Project> => {
  const {
    length = 0,
    width = 0,
    floors = 1,
    wallThickness = 20,
    ceilingHeight = 3.0,
    includeWall = false,
    includeSlab = false,
    roofType = 'concrete'
  } = input;
  
  const area = length * width; // مساحة الأرض
  const wallThicknessM = wallThickness / 100; // Convert cm to meters
  
  // Calculate wall area (approximate)
  const perimeterLength = 2 * (length + width);
  const wallArea = perimeterLength * ceilingHeight * floors;
  
  // Add perimeter wall if selected
  const totalWallArea = includeWall 
    ? wallArea + (perimeterLength * 2.5) // Assume 2.5m height for perimeter wall
    : wallArea;
  
  // Calculate material quantities (basic formulas)
  const brickVolume = totalWallArea * wallThicknessM;
  const bricks = Math.ceil(brickVolume * 400); // Approximately 400 bricks per cubic meter
  
  // Cement calculation (for mortar and concrete)
  const mortarVolume = brickVolume * 0.3; // 30% mortar
  const concreteVolume = includeSlab ? area * floors * 0.15 : 0; // 15cm slab thickness
  const totalCementVolume = mortarVolume + concreteVolume;
  const cement = Math.ceil(totalCementVolume * 7); // 7 bags per cubic meter
  
  // Sand calculation
  const sand = totalCementVolume * 0.5; // 0.5 cubic meters sand per cubic meter cement
  
  // Steel calculation
  const steel = Math.ceil(concreteVolume * 80); // 80 kg steel per cubic meter concrete
  
  // Gravel calculation
  const gravel = concreteVolume * 0.8; // 0.8 cubic meters gravel per cubic meter concrete
  
  return {
    bricks,
    cement,
    sand,
    steel,
    gravel
  };
};