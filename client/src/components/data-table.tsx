import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { type Dataset, type DataRow } from "@shared/schema";

interface DataTableProps {
  dataset: Dataset;
}

export function DataTable({ dataset }: DataTableProps) {
  const [filter, setFilter] = useState("");

  const filteredData = dataset.data.filter((row: DataRow) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter data..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {dataset.headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row: DataRow, index: number) => (
              <TableRow key={index}>
                {dataset.headers.map((header) => (
                  <TableCell key={header}>{row[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}