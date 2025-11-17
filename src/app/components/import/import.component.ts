import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee.service';
import * as Papa from 'papaparse';
import { DepartmentService } from 'src/app/services/department.service';
import { parseCSV, parseXLSX } from '../../utils/parser'
import { MatDialog } from '@angular/material/dialog';
import { DownloadFormatDownloadComponent } from '../download-format-download/download-format-download.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;
  selectedFormat: string | null = null;
  uploading = false;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService,
    private dialog: MatDialog
  ) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      this.selectedFile = null;
      return;
    }

    const fileName = file.name.toLowerCase();

    // Validate CSV
    if (this.selectedFormat === 'csv' && !fileName.endsWith('.csv')) {
      this.snackBar.open('You selected CSV but uploaded a non-CSV file!', 'Close', { duration: 5000 });
      this.selectedFile = null;
      event.target.value = "";
      return;
    }

    // Validate Excel
    if (this.selectedFormat === 'xlsx' &&
      !(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      this.snackBar.open('You selected Excel but uploaded a non-Excel file!', 'Close', { duration: 5000 });
      this.selectedFile = null;
      event.target.value = "";
      return;
    }

    // If valid →
    this.selectedFile = file;
    console.log("Valid file selected:", this.selectedFile);
  }



  uploadToBackend(data: any[]) {
    console.log("Parsed data:", data);

    const csv = Papa.unparse(data);
    const file = new File([csv], "data.csv", { type: "text/csv" });

    this.employeeService.createEmployees(file).subscribe({
      next: (res) => {
        this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.log(err);
        this.snackBar.open('Upload failed', 'Close', { duration: 3000 });
      }
    });
  }

  openChooseFormatDialog() {
    const dialogRef = this.dialog.open(DownloadFormatDownloadComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe((format: string) => {
      if (!format) return;

      this.selectedFormat = format;

      if (format === 'csv') {
        this.fileInput.nativeElement.accept = ".csv";
      } else {
        this.fileInput.nativeElement.accept = ".xls,.xlsx";
      }

      this.fileInput.nativeElement.click();
    });
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    const fileName = this.selectedFile.name.toLowerCase();

    // ---- Existing format handling ----
    if (fileName.endsWith('.csv')) {
      parseCSV(this.selectedFile, (json) => this.uploadToBackend(json));
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      parseXLSX(this.selectedFile, (json) => this.uploadToBackend(json));
    } else {
      this.snackBar.open('Unsupported file format!', 'Close', { duration: 3000 });
    }
  }


  onCancel(): void {
    this.selectedFile = null;
  }
}
