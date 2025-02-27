import { FileUpload } from "@/components/file-upload";
import { DataTable } from "@/components/data-table";
import { ChartDisplay } from "@/components/chart-display";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { type Dataset } from "@shared/schema";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner"; 
export default function Home() {
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <TailSpin
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="w-[98vw] p-4 space-y-6 bg-green-900 mx-auto ">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-white">
        Data Visualization Platform
      </h1>

      <div className={`${selectedDataset ? ' grid grid-cols-1 md:grid-cols-2 gap-6 ' : 'mx-auto'}`}>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Data</h2>
          <FileUpload onUploadComplete={setSelectedDataset} />
        </Card>

        {selectedDataset && (
          <div className=" bg-white flex items-center justify-center">
            <Card className="p-6 w-full h-full">
              <h2 className="text-2xl font-semibold mb-4">Visualize Data</h2>
              <ChartDisplay dataset={selectedDataset} />
            </Card>
          </div>
        )}
      </div>

      {selectedDataset && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Data Table</h2>
          <DataTable dataset={selectedDataset} />
        </Card>
      )}
      <div className=" text-center bg-black bottom-0 w-full p-4">
        <p className="text-white text-sm ">
          © 2025 Data Visualization Platform by Raja Umer Saleem. All rights reserved.
        </p>
      </div>
    </div>
  );
}