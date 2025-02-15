import { FileUpload } from "@/components/file-upload";
import { DataTable } from "@/components/data-table";
import { ChartDisplay } from "@/components/chart-display";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { type Dataset } from "@shared/schema";
import { useState } from "react";

export default function Home() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Data Visualization Platform
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Data</h2>
          <FileUpload onUploadComplete={setSelectedDataset} />
        </Card>

        {selectedDataset && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Visualize Data</h2>
            <ChartDisplay dataset={selectedDataset} />
          </Card>
        )}
      </div>

      {selectedDataset && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Data Table</h2>
          <DataTable dataset={selectedDataset} />
        </Card>
      )}
    </div>
  );
}
