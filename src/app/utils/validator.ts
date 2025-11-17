import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';


export function validateCSV(
  file: File,
  requiredColumns: string[],
  snackBar?: MatSnackBar
): Promise<boolean> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      preview: 1,
      header: true,
      complete: (result) => {
      const headers = Object.keys(result.data[0] as Record<string, any> || {});
        const missing = requiredColumns.filter(col => !headers.includes(col));

        if (missing.length > 0) {
          if (snackBar) {
            snackBar.open(
              `Missing required fields: ${missing.join(', ')}`,
              'Close',
              { duration: 5000 }
            );
          }
          resolve(false);
        } else {
          resolve(true);
        }
      },
      error: () => resolve(false)
    });
  });
}

export async function validateExcel(
  file: File,
  requiredColumns: string[],
  snackBar?: MatSnackBar
): Promise<boolean> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (!json || json.length === 0) {
      if (snackBar) {
        snackBar.open('Excel file is empty', 'Close', { duration: 5000 });
      }
      return false;
    }

    const headers: string[] = json[0].map(String);
    const missing = requiredColumns.filter(col => !headers.includes(col));

    if (missing.length > 0) {
      if (snackBar) {
        snackBar.open(
          `Missing required fields: ${missing.join(', ')}`,
          'Close',
          { duration: 5000 }
        );
      }
      return false;
    }

    return true;
  } catch (error) {
    if (snackBar) {
      snackBar.open('Error reading Excel file', 'Close', { duration: 5000 });
    }
    return false;
  }
}
