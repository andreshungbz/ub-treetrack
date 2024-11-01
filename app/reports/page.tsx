import "@/styles/main.css";

import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Metadata } from "next";

// metadata
export const metadata: Metadata = {
  title: "System Reports",
  description: "Reports on the UB TreeTrack system",
};

export default async function Reports() {
  // report names and descriptions
  const reports = [
    {
      report_id: 1,
      report_name: "System Database Statistics",
      report_description: "General statistics about the system database",
      report_url: "/reports/database-statistics",
    },
    {
      report_id: 2,
      report_name: "Administrator Contributions",
      report_description:
        "Administrators by order of plants added and edits made",
      report_url: "/reports/admin-contributions",
    },
    {
      report_id: 3,
      report_name: "Plant Popularity Report",
      report_description: "Plants by order of rating average",
      report_url: "/reports/plant-popularity",
    },
    {
      report_id: 4,
      report_name: "Plant Ratings Trend",
      report_description:
        "Number of ratings entered into the system per month in the last 6 months",
      report_url: "/reports/plant-ratings-trend",
    },
  ];

  return (
    <>
      <h1 className="h1-main">System Reports</h1>
      <Table className="mx-auto mt-4 bg-white md:w-2/3">
        <TableCaption>
          List of available reports on the UB TreeTrack system.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Report</TableHead>
            <TableHead className="text-left">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports?.map((report) => (
            <TableRow key={report.report_id} className="even:bg-gray-100">
              <TableCell className="font-medium">
                <Link href={report.report_url}>
                  <span className="text-blue-600 hover:underline">
                    {report.report_name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-left">
                {`${report.report_description}`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
