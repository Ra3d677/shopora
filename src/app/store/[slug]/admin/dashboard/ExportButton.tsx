"use client";

import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface ExportProps {
  storeName: string;
  dateRange: string;
  metrics: {
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    totalVisits: number;
    conversionRate: string;
    uniqueCustomers: number;
    averageOrderValue: number;
    abandonmentRate: string;
    retentionRate: string;
    inStockProducts: number;
  };
  topProducts: { name: string; salesCount: number; price: number; image?: string }[];
  recentOrders: { customerName: string; totalAmount: number; status: string; createdAt: string }[];
  lowStockProducts: { name: string; stock_quantity: number }[];
}

export default function ExportButton(props: ExportProps) {
  const exportPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const { metrics, topProducts, recentOrders, lowStockProducts, storeName, dateRange } = props;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFillColor(10, 12, 20);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(storeName, 20, 28);
    doc.setFontSize(10);
    doc.setTextColor(6, 182, 212);
    doc.text("Analytics Report", pageWidth - 20, 28, { align: "right" });

    y = 50;
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(`Period: ${dateRange}`, 20, y);

    y += 14;
    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);

    y += 10;
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(26, 29, 45);
    doc.rect(20, y, pageWidth - 40, 8, "F");
    doc.text("Key Metrics", 24, y + 6);

    y += 16;
    (doc as any).autoTable({
      startY: y,
      head: [["Metric", "Value", "Detail"]],
      body: [
        ["Revenue", `$${metrics.totalRevenue.toFixed(0)}`, `Growth: ${metrics.revenueGrowth.toFixed(1)}%`],
        ["Orders", `${metrics.totalOrders}`, `Avg Value: $${metrics.averageOrderValue.toFixed(0)}`],
        ["Visits", `${metrics.totalVisits}`, `Conversion: ${metrics.conversionRate}%`],
        ["Customers", `${metrics.uniqueCustomers}`, `Retention: ${metrics.retentionRate}%`],
        ["Abandonment", `${metrics.abandonmentRate}%`, `In Stock: ${metrics.inStockProducts}`],
      ],
      theme: "grid",
      headStyles: { fillColor: [6, 182, 212], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 9 },
      bodyStyles: { fillColor: [26, 29, 45], textColor: [255, 255, 255], fontSize: 9 },
      alternateRowStyles: { fillColor: [15, 17, 26] },
      margin: { left: 20, right: 20 },
    });

    y = (doc as any).lastAutoTable.finalY + 14;

    if (topProducts.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(26, 29, 45);
      doc.rect(20, y, pageWidth - 40, 8, "F");
      doc.text("Top Products", 24, y + 6);

      y += 16;
      (doc as any).autoTable({
        startY: y,
        head: [["Rank", "Product", "Sales", "Revenue"]],
        body: topProducts.map((p, i) => [`#${i + 1}`, p.name, `${p.salesCount} sold`, `$${(p.salesCount * p.price).toFixed(0)}`]),
        theme: "grid",
        headStyles: { fillColor: [168, 85, 247], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fillColor: [26, 29, 45], textColor: [255, 255, 255], fontSize: 9 },
        alternateRowStyles: { fillColor: [15, 17, 26] },
        margin: { left: 20, right: 20 },
      });

      y = (doc as any).lastAutoTable.finalY + 14;
    }

    if (recentOrders.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(26, 29, 45);
      doc.rect(20, y, pageWidth - 40, 8, "F");
      doc.text("Recent Orders", 24, y + 6);

      y += 16;
      (doc as any).autoTable({
        startY: y,
        head: [["Customer", "Amount", "Status", "Date"]],
        body: recentOrders.map((o) => [o.customerName, `$${o.totalAmount.toFixed(0)}`, o.status, new Date(o.createdAt).toLocaleDateString()]),
        theme: "grid",
        headStyles: { fillColor: [236, 72, 153], textColor: [0, 0, 0], fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fillColor: [26, 29, 45], textColor: [255, 255, 255], fontSize: 9 },
        alternateRowStyles: { fillColor: [15, 17, 26] },
        margin: { left: 20, right: 20 },
      });

      y = (doc as any).lastAutoTable.finalY + 14;
    }

    if (lowStockProducts.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(239, 68, 68);
      doc.rect(20, y, pageWidth - 40, 8, "F");
      doc.text("Low Stock Alerts", 24, y + 6);

      y += 16;
      (doc as any).autoTable({
        startY: y,
        head: [["Product", "Stock"]],
        body: lowStockProducts.map((p) => [p.name, `${p.stock_quantity} units`]),
        theme: "grid",
        headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fillColor: [26, 29, 45], textColor: [255, 255, 255], fontSize: 9 },
        alternateRowStyles: { fillColor: [15, 17, 26] },
        margin: { left: 20, right: 20 },
      });
    }

    doc.setFillColor(10, 12, 20);
    doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, "F");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated by Shopora Analytics • ${new Date().toLocaleDateString()}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 6, { align: "center" });

    doc.save(`${storeName.replace(/\s+/g, "_")}_Report.pdf`);
  };

  return (
    <button
      onClick={exportPDF}
      className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(6,182,212,0.2)] flex items-center gap-3 print:hidden"
    >
      <FileDown className="w-4 h-4" /> Export PDF
    </button>
  );
}
