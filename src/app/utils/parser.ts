import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Convert value to number or null
function toNumber(val: any): number | null {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

export function parseCSV(file: File, callback: (data: any[]) => void) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const cleaned = result.data.map((row: any) => ({
        name: row.name?.trim(),
        email: row.email?.trim(),
        designation: row.designation?.trim(),
        phone: row.phone?.trim(),
        managerId: toNumber(row.managerId),
        departmentId: toNumber(row.departmentId)
      }));

      callback(cleaned);
    }
  });
}

export function parseXLSX(file: File, callback: (data: any[]) => void) {
    console.log(file);
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const workbook = XLSX.read(e.target.result, { type: 'binary' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    console.log(json);

    const cleaned = json.map((row: any) => ({
      name: row.name,
      email: row.email,
      designation: row.designation,
      phone: row.phone,
      managerId: toNumber(row.manager),
      departmentId: toNumber(row.departmentId)
    }));

    callback(cleaned);
  };

  reader.readAsBinaryString(file);
}
