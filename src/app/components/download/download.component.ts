import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadFormatDownloadComponent } from '../download-format-download/download-format-download.component';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {

  constructor(private employeeService: EmployeeService, private dialog: MatDialog) { }

  generateCsv(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const replacer = (key: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    return csv.join('\r\n');
  }

  downloadCsvFile(csvContent: string, filename: string = 'data.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  downloadExcel(data: any[], fileName = 'employees.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  onDownload() {
    const dialogRef = this.dialog.open(DownloadFormatDownloadComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(format => {
      if (!format) return; // cancelled

      this.employeeService.getAllData().subscribe({
        next: (data: any[]) => {
          if (format === 'csv') {
            const csv = this.generateCsv(data);
            this.downloadCsvFile(csv);
          } else if (format === 'xlsx') {
            this.downloadExcel(data);
          }
        },
        error: () => console.log('Error fetching data')
      });
    });
  }
}
