import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define a type for the data rows
export type DataRow = Record<string, string | number>;

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  headers: text("headers").array().notNull(),
  data: jsonb("data").$type<DataRow[]>().notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;

export const chartConfigSchema = z.object({
  type: z.enum(["bar", "line", "pie"]),
  xAxis: z.string(),
  yAxis: z.string(),
});

export type ChartConfig = z.infer<typeof chartConfigSchema>;