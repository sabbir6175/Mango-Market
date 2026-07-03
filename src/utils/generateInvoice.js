import { jsPDF } from "jspdf";

export function generateInvoice(order) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  let y = 20;

  // Header
  doc.setFillColor(46, 125, 50);
  doc.rect(0, 0, W, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Fresh Food Rangpur", W / 2, 16, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Cash on Delivery | Phone: 01310101661", W / 2, 28, { align: "center" });

  y = 50;

  // Invoice title
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", W / 2, y, { align: "center" });
  y += 7;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const date = order.createdAt?.toDate?.() || new Date();
  doc.text(`Order ID: #${order.id?.slice(-8).toUpperCase()}   |   Date: ${date.toLocaleDateString("en-GB")}`, W / 2, y, { align: "center" });

  y += 14;

  // Customer info
  doc.setFillColor(246, 248, 244);
  doc.roundedRect(14, y, W - 28, 28, 3, 3, "F");
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Information", 20, y + 7);
  doc.setFont("helvetica", "normal");
  doc.text(`Name   : ${order.customerName || "-"}`, 20, y + 14);
  doc.text(`Phone  : ${order.phone || "-"}`, 20, y + 20);
  doc.text(`District: ${order.district || "-"}`, 110, y + 14);
  doc.text(`Address : ${(order.address || "-").substring(0, 38)}`, 110, y + 20);

  y += 36;

  // Table header
  doc.setFillColor(46, 125, 50);
  doc.rect(14, y, W - 28, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Product", 18, y + 5.5);
  doc.text("Qty", 132, y + 5.5);
  doc.text("Unit Price", 148, y + 5.5);
  doc.text("Total", 175, y + 5.5);
  y += 8;

  // Table rows
  doc.setFont("helvetica", "normal");
  (order.items || []).forEach((item, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 246, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 244);
    doc.rect(14, y, W - 28, 8, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8.5);
    doc.text((item.name || "-").substring(0, 48), 18, y + 5.5);
    doc.text(String(item.qty), 134, y + 5.5);
    doc.text(`${(item.price || 0).toLocaleString("en")} BDT`, 148, y + 5.5);
    doc.text(`${((item.price || 0) * item.qty).toLocaleString("en")} BDT`, 172, y + 5.5);
    y += 8;
  });

  y += 6;

  // Summary rows
  const addSummaryRow = (label, value, green = false) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", green ? "bold" : "normal");
    doc.setTextColor(green ? 46 : 80, green ? 125 : 80, green ? 50 : 80);
    doc.text(label, 130, y);
    doc.setTextColor(green ? 46 : 30, green ? 125 : 30, green ? 50 : 30);
    doc.text(value, W - 14, y, { align: "right" });
    y += 6;
  };

  addSummaryRow("Subtotal:", `${(order.subtotal || order.total || 0).toLocaleString("en")} BDT`);
  addSummaryRow("Shipping:", `${(order.shippingCharge || 0).toLocaleString("en")} BDT`);
  if (order.couponDiscount > 0) {
    addSummaryRow("Coupon Discount:", `-${order.couponDiscount.toLocaleString("en")} BDT`);
  }

  doc.setDrawColor(46, 125, 50);
  doc.line(130, y, W - 14, y);
  y += 5;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(46, 125, 50);
  doc.text("Total:", 130, y);
  doc.text(`${(order.total || 0).toLocaleString("en")} BDT`, W - 14, y, { align: "right" });

  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Payment: Cash on Delivery", 14, y);

  // Footer
  doc.setFillColor(46, 125, 50);
  doc.rect(0, 280, W, 17, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Thank you for your order! | Fresh Food Rangpur", W / 2, 290, { align: "center" });

  doc.save(`invoice-${order.id?.slice(-8).toUpperCase() || "order"}.pdf`);
}
