import { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { type Dataset, type ChartConfig, type DataRow } from "@shared/schema";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartType,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  dataset: Dataset;
}

export function ChartDisplay({ dataset }: ChartDisplayProps) {
  const [config, setConfig] = useState<ChartConfig>({
    type: "bar",
    xAxis: dataset.headers[0],
    yAxis: dataset.headers[1],
  });

  const chartRef = useRef<ChartJS>(null);

  const chartData = {
    labels: dataset.data.map((row: DataRow) => row[config.xAxis]),
    datasets: [
      {
        label: config.yAxis,
        data: dataset.data.map((row: DataRow) => Number(row[config.yAxis]) || 0),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
    ],
  };

  const handleExport = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = url;
      link.click();
    }
  };

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
  }[config.type];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Select
          value={config.type}
          onValueChange={(value: ChartType) =>
            setConfig({ ...config, type: value as ChartConfig["type"] })
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar</SelectItem>
            <SelectItem value="line">Line</SelectItem>
            <SelectItem value="pie">Pie</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={config.xAxis}
          onValueChange={(value) => setConfig({ ...config, xAxis: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="X Axis" />
          </SelectTrigger>
          <SelectContent>
            {dataset.headers.map((header) => (
              <SelectItem key={header} value={header}>
                {header}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={config.yAxis}
          onValueChange={(value) => setConfig({ ...config, yAxis: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Y Axis" />
          </SelectTrigger>
          <SelectContent>
            {dataset.headers.map((header) => (
              <SelectItem key={header} value={header}>
                {header}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card className="p-4">
        <ChartComponent
          ref={chartRef}
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top" as const,
              },
            },
          }}
          className="h-[400px]"
        />
      </Card>
    </div>
  );
}