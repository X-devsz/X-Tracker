import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { format } from "date-fns";
import * as XLSX from "xlsx-js-style";
import type { ExpenseWithCategory } from "../../repositories";
import { formatAmountMinor } from "../../utils/formatters";

export interface ExportExpensesResult {
  fileUri: string;
  rowCount: number;
  shared: boolean;
}

export const filterExpensesByQuery = (
  expenses: ExpenseWithCategory[],
  query: string
): ExpenseWithCategory[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return expenses;

  return expenses.filter((expense) => {
    const categoryName = expense.categoryName ?? "";
    const merchant = expense.merchant ?? "";
    const note = expense.note ?? "";
    return (
      categoryName.toLowerCase().includes(normalizedQuery) ||
      merchant.toLowerCase().includes(normalizedQuery) ||
      note.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const exportExpensesXlsx = async (
  expenses: ExpenseWithCategory[],
  currency: string
): Promise<ExportExpensesResult> => {
  type ExportRow = {
    date: string;
    amount: number;
    category: string;
    merchant: string;
    note: string;
    paymentMethod: string;
  };

  const rows: ExportRow[] = expenses.map((expense) => ({
    date: format(expense.occurredAt, "yyyy-MM-dd"),
    amount: Number((expense.amountMinor / 100).toFixed(2)),
    category: expense.categoryName ?? "Uncategorized",
    merchant: expense.merchant ?? "",
    note: expense.note ?? "",
    paymentMethod: expense.paymentMethod ?? "",
  }));

  const columns: { key: keyof ExportRow; label: string }[] = [
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "category", label: "Category" },
    { key: "merchant", label: "Merchant" },
    { key: "note", label: "Note" },
    { key: "paymentMethod", label: "Payment Method" },
  ];

  const totalMinor = expenses.reduce(
    (sum, expense) => sum + expense.amountMinor,
    0
  );
  const generatedAt = format(new Date(), "yyyy-MM-dd HH:mm");
  const totalAmount = Number((totalMinor / 100).toFixed(2));

  const metadataRows = [
    ["Expense Tracker"],
    ["Generated", generatedAt],
    ["Total", totalAmount],
    ["Currency", currency.toUpperCase()],
  ];

  const tableHeader = columns.map((column) => column.label);
  const dataRows = rows.map((row) => columns.map((column) => row[column.key]));

  const sheetData = [...metadataRows, [], tableHeader, ...dataRows];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  const columnCount = columns.length;
  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: columnCount - 1 },
    },
    {
      s: { r: 1, c: 0 },
      e: { r: 1, c: columnCount - 1 },
    },
  ];

  const headerRowIndex = metadataRows.length + 1;
  const dataStartRowIndex = headerRowIndex + 1;
  const dataEndRowIndex = dataStartRowIndex + dataRows.length - 1;

  const borderStyle: XLSX.CellStyle["border"] = {
    top: { style: "thin", color: { rgb: "D1D5DB" } },
    bottom: { style: "thin", color: { rgb: "D1D5DB" } },
    left: { style: "thin", color: { rgb: "D1D5DB" } },
    right: { style: "thin", color: { rgb: "D1D5DB" } },
  };

  const setCellStyle = (row: number, col: number, style: XLSX.CellStyle) => {
    const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = worksheet[cellRef];
    if (cell) {
      cell.s = style;
    }
  };

  setCellStyle(0, 0, {
    font: { bold: true, sz: 18, color: { rgb: "111827" } },
    alignment: { horizontal: "left", vertical: "center" },
  });
  setCellStyle(1, 0, {
    font: { bold: true, sz: 12, color: { rgb: "6B7280" } },
    alignment: { horizontal: "left", vertical: "center" },
  });

  for (let i = 2; i < metadataRows.length; i += 1) {
    const isTotalRow = i === 3;
    setCellStyle(i, 0, {
      font: { bold: true, color: { rgb: "374151" } },
      alignment: { horizontal: "left", vertical: "center" },
    });
    setCellStyle(i, 1, {
      font: { color: { rgb: "111827" } },
      alignment: { horizontal: "left", vertical: "center" },
      numFmt: isTotalRow ? "#,##0.00" : "@",
    });
  }

  for (let col = 0; col < columnCount; col += 1) {
    setCellStyle(headerRowIndex, col, {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "1F2937" } },
      border: borderStyle,
      alignment: { horizontal: "left", vertical: "center" },
    });
  }

  for (let row = dataStartRowIndex; row <= dataEndRowIndex; row += 1) {
    for (let col = 0; col < columnCount; col += 1) {
      const isAmount = col === 1;
      setCellStyle(row, col, {
        border: borderStyle,
        alignment: {
          horizontal: isAmount ? "right" : "left",
          vertical: "center",
        },
        numFmt: isAmount ? "#,##0.00" : undefined,
      });
    }
  }

  const columnWidths = columns.map((column, index) => {
    let maxLength = column.label.length;

    if (index === 0) {
      for (let i = 2; i < metadataRows.length; i += 1) {
        const labelValue = metadataRows[i]?.[0];
        if (labelValue) {
          maxLength = Math.max(maxLength, String(labelValue).length);
        }
      }
    }

    if (index === 1) {
      for (let i = 2; i < metadataRows.length; i += 1) {
        const rowValue = metadataRows[i]?.[1];
        if (rowValue != null) {
          const displayValue =
            i === 3 ? formatAmountMinor(totalMinor) : String(rowValue);
          maxLength = Math.max(maxLength, displayValue.length);
        }
      }
    }

    for (const row of dataRows) {
      const value = row[index];
      if (value == null) continue;
      const displayValue =
        index === 1
          ? formatAmountMinor(Math.round(Number(value) * 100))
          : String(value);
      maxLength = Math.max(maxLength, displayValue.length);
    }

    maxLength = Math.max(maxLength, 8);
    return { wch: Math.min(40, maxLength + 2) };
  });
  worksheet["!cols"] = columnWidths;

  const rowHeights: XLSX.RowInfo[] = [];
  rowHeights[0] = { hpt: 28 };
  rowHeights[1] = { hpt: 20 };
  for (let i = 2; i < metadataRows.length; i += 1) {
    rowHeights[i] = { hpt: 18 };
  }
  rowHeights[headerRowIndex] = { hpt: 20 };
  for (let i = dataStartRowIndex; i <= dataEndRowIndex; i += 1) {
    rowHeights[i] = { hpt: 18 };
  }
  worksheet["!rows"] = rowHeights;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

  const fileName = `expenses-${format(new Date(), "yyyyMMdd-HHmmss")}.xlsx`;
  const directory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  if (!directory) {
    throw new Error("Unable to access a writable directory.");
  }

  const fileUri = `${directory}${fileName}`;
  const workbookBase64 = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });
  await FileSystem.writeAsStringAsync(fileUri, workbookBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const shared = await Sharing.isAvailableAsync();
  if (shared) {
    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Export expenses",
    });
  }

  return { fileUri, rowCount: rows.length, shared };
};
