import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidationRule } from '../models/employee.model';


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

export function validateRow(row: any, rules: ValidationRule[]): string[] {
  const errors: string[] = [];

  rules.forEach(rule => {
    const val = row[rule.column];

    // Required check
    if (rule.required && (val === undefined || val === null || val.toString().trim() === '')) {
      errors.push(`${rule.column} is required`);
      return;
    }

    if (!val) return;

    switch (rule.type) {
      case 'email':
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val)) errors.push(`${rule.column} is not a valid email`);
        break;
      case 'phone':
        if (!/^\+?\d{7,15}$/.test(val)) errors.push(`${rule.column} is not a valid phone number`);
        break;
      case 'number':
        if (isNaN(Number(val))) errors.push(`${rule.column} must be a number`);
        break;
      case 'date':
        if (isNaN(Date.parse(val))) errors.push(`${rule.column} must be a valid date`);
        break;
      case 'string':
        if (typeof val !== 'string') errors.push(`${rule.column} must be a string`);
        break;
    }
  });

  return errors;
}

// Validate all rows
export function validateData(data: any[], rules: ValidationRule[]): { validData: any[], errors: string[] } {
  const validData: any[] = [];
  const errors: string[] = [];

  data.forEach((row, index) => {
    const rowErrors = validateRow(row, rules);
    if (rowErrors.length) {
      errors.push(`Row ${index + 2}: ${rowErrors.join(', ')}`);
    } else {
      validData.push(row);
    }
  });

  return { validData, errors };
}

