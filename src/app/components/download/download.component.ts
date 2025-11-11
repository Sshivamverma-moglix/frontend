import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {

  constructor(private employeeService: EmployeeService) { }

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

  onDownload() {
    console.log("download is clicked!");
    this.employeeService.getAllData().subscribe({
      next: (data: any) => {
        const csv = this.generateCsv(data);
        this.downloadCsvFile(csv);
      },
      error: (error) => console.log('error occured while fetching data')
    })
  }
}
