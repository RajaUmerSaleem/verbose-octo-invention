import { datasets, type Dataset, type InsertDataset } from "@shared/schema";

export interface IStorage {
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  listDatasets(): Promise<Dataset[]>;
}

export class MemStorage implements IStorage {
  private datasets: Map<number, Dataset>;
  private currentId: number;

  constructor() {
    this.datasets = new Map();
    this.currentId = 1;
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = this.currentId++;
    const dataset: Dataset = {
      ...insertDataset,
      id,
      uploadedAt: new Date().toISOString(),
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async listDatasets(): Promise<Dataset[]> {
    return Array.from(this.datasets.values());
  }
}

export const storage = new MemStorage();
