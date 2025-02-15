import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import multer from "multer";
import Papa from "papaparse";
import { insertDatasetSchema } from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express) {
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileContent = req.file.buffer.toString();
    const result = Papa.parse(fileContent, { header: true });

    if (result.errors.length > 0) {
      return res.status(400).json({ message: "Invalid CSV file" });
    }

    const headers = Object.keys(result.data[0]);
    const dataset = {
      fileName: req.file.originalname,
      headers,
      data: result.data,
    };

    const parsedData = insertDatasetSchema.safeParse(dataset);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const savedDataset = await storage.createDataset(parsedData.data);
    res.json(savedDataset);
  });

  app.get("/api/datasets", async (_req, res) => {
    const datasets = await storage.listDatasets();
    res.json(datasets);
  });

  app.get("/api/datasets/:id", async (req, res) => {
    const dataset = await storage.getDataset(Number(req.params.id));
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }
    res.json(dataset);
  });

  return createServer(app);
}