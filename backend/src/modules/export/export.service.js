import ExcelJS from "exceljs";
import { getFeeCollectionCursor } from "./export.repository.js";

export const streamFeeCollectionExcel = async (filters, res) => {
  // Resolve the query before beginning the response, so invalid filters still
  // receive the application's regular JSON error response.
  const cursor = await getFeeCollectionCursor(filters);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=fee-collection-report.xlsx",
  );

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: res });
  const sheet = workbook.addWorksheet("Fee Collection");

  sheet.columns = [
    { header: "Student Name", key: "studentName", width: 25 },
    { header: "Roll Number", key: "rollNumber", width: 15 },
    { header: "Academic Year", key: "academicYear", width: 15 },
    { header: "Total Amount", key: "totalAmount", width: 15 },
    { header: "Discount", key: "discountAmount", width: 12 },
    { header: "Scholarship", key: "scholarshipAmount", width: 12 },
    { header: "Fine", key: "fineAmount", width: 12 },
    { header: "Net Amount", key: "netAmount", width: 15 },
    { header: "Paid Amount", key: "paidAmount", width: 15 },
    { header: "Due Amount", key: "dueAmount", width: 15 },
    { header: "Due Date", key: "dueDate", width: 15 },
    { header: "Status", key: "status", width: 12 },
  ];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    sheet
      .addRow({
        studentName: doc.studentId?.name ?? "N/A",
        rollNumber: doc.studentId?.admissionNumber ?? "N/A",
        academicYear: doc.academicYearId?.name ?? "N/A",
        totalAmount: doc.totalAmount,
        discountAmount: doc.discountAmount,
        scholarshipAmount: doc.scholarshipAmount,
        fineAmount: doc.fineAmount,
        netAmount: doc.netAmount,
        paidAmount: doc.paidAmount,
        dueAmount: doc.dueAmount,
        dueDate: doc.dueDate ? doc.dueDate.toISOString().split("T")[0] : "N/A",
        status: doc.status,
      })
      .commit(); 
  }

  await workbook.commit(); 
};
