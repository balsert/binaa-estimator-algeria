import Dexie, { Table } from 'dexie';
import { FloorPlan } from '@/types/floorPlan';

export class FloorPlanDB extends Dexie {
  floorPlans!: Table<FloorPlan>;

  constructor() {
    super('FloorPlanDB');
    
    this.version(1).stores({
      floorPlans: '++id, name, createdAt, updatedAt'
    });
  }
}

export const floorPlanDB = new FloorPlanDB();

// Auto-save functionality
export class AutoSave {
  private static instance: AutoSave;
  private saveTimer: NodeJS.Timeout | null = null;
  private pendingFloorPlan: FloorPlan | null = null;

  static getInstance(): AutoSave {
    if (!AutoSave.instance) {
      AutoSave.instance = new AutoSave();
    }
    return AutoSave.instance;
  }

  scheduleAutoSave(floorPlan: FloorPlan) {
    this.pendingFloorPlan = floorPlan;
    
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(async () => {
      if (this.pendingFloorPlan) {
        await this.saveFloorPlan(this.pendingFloorPlan);
        this.pendingFloorPlan = null;
      }
    }, 30000); // 30 seconds
  }

  async saveFloorPlan(floorPlan: FloorPlan) {
    try {
      const updatedFloorPlan = {
        ...floorPlan,
        updatedAt: new Date()
      };

      if (floorPlan.id) {
        await floorPlanDB.floorPlans.update(floorPlan.id, updatedFloorPlan);
      } else {
        await floorPlanDB.floorPlans.add(updatedFloorPlan);
      }
      
      console.log('Floor plan auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  async forceSave() {
    if (this.pendingFloorPlan) {
      await this.saveFloorPlan(this.pendingFloorPlan);
      this.pendingFloorPlan = null;
      
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
    }
  }
}