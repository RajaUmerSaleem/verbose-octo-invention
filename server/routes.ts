import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import multer from "multer";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { insertDatasetSchema } from "@shared/schema";
import { log } from "./vite";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export async function registerRoutes(app: Express) {
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      log(`Received file: ${req.file.originalname}`);

      let data: any[] = [];
      let headers: string[] = [];

      // Handle based on file type
      if (req.file.originalname.endsWith('.csv')) {
        // Parse CSV
        const fileContent = req.file.buffer.toString();
        const result = Papa.parse(fileContent, { 
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });

        if (result.errors.length > 0) {
          log(`Parse errors: ${JSON.stringify(result.errors)}`);
          return res.status(400).json({ 
            message: "Invalid CSV file",
            errors: result.errors
          });
        }

        data = result.data;
        if (data.length > 0) {
          headers = Object.keys(data[0]);
        }
      } else if (req.file.originalname.match(/\.xlsx?$/)) {
        // Parse Excel
        const workbook = XLSX.read(req.file.buffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert Excel data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        if (jsonData.length > 0) {
          headers = Object.keys(jsonData[0]);
          data = jsonData.map(row => {
            const processedRow: Record<string, string | number> = {};
            headers.forEach(header => {
              const value = row[header];
              // Try to convert to number if possible
              processedRow[header] = !isNaN(Number(value)) ? Number(value) : value;
            });
            return processedRow;
          });
        }
      } else {
        return res.status(400).json({ 
          message: "Unsupported file format. Please upload a CSV or Excel file."
        });
      }

      if (data.length === 0) {
        return res.status(400).json({ message: "File contains no data" });
      }

      const dataset = {
        fileName: req.file.originalname,
        headers,
        data,
      };

      const parsedData = insertDatasetSchema.safeParse(dataset);
      if (!parsedData.success) {
        log(`Validation errors: ${JSON.stringify(parsedData.error)}`);
        return res.status(400).json({ 
          message: "Invalid data format",
          errors: parsedData.error.errors
        });
      }

      const savedDataset = await storage.createDataset(parsedData.data);
      res.json(savedDataset);
    } catch (error) {
      log(`Upload error: ${error}`);
      res.status(500).json({ 
        message: "Server error while processing file",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
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