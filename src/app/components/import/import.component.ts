import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee.service';
import * as Papa from 'papaparse';
import { DepartmentService } from 'src/app/services/department.service';
import { parseCSV, parseXLSX } from '../../utils/parser'
import { MatDialog } from '@angular/material/dialog';
import { DownloadFormatDownloadComponent } from '../download-format-download/download-format-download.component';
import { validateCSV, validateExcel } from 'src/app/utils/validator';


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
  requiredColumns = ['name', 'email', 'designation', 'phone', 'createdDate', 'manager', 'department'];


  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService,
    private dialog: MatDialog
  ) { }

  async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];

    if (!file) {
      this.selectedFile = null;
      return;
    }

    const fileName = file.name.toLowerCase();

    if (this.selectedFormat === 'csv' && !fileName.endsWith('.csv')) {
      this.snackBar.open('You selected CSV but uploaded a non-CSV file!', 'Close', { duration: 5000 });
      this.selectedFile = null;
      event.target.value = "";
      return;
    }

    if (this.selectedFormat === 'xlsx' &&
      !(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      this.snackBar.open('You selected Excel but uploaded a non-Excel file!', 'Close', { duration: 5000 });
      this.selectedFile = null;
      event.target.value = "";
      return;
    }

    let isValid = false;
    if (this.selectedFormat === 'csv') {
      isValid = await validateCSV(file, this.requiredColumns, this.snackBar);
    } else if (this.selectedFormat === 'xlsx') {
      isValid = await validateExcel(file, this.requiredColumns, this.snackBar);
    }

    if (!isValid) {
      this.selectedFile = null;
      event.target.value = "";
      return;
    }
    
    this.selectedFile = file;
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
      width: '350px',
      data: {
        title: "Select upload format",
        message: "Please upload a file that includes all required columns: name, email, designation, phone, createdDate, managerId, departmentId. All fields are mandatory except managerId and createdDate."
      }
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

    if (fileName.endsWith('.csv')) {
      console.log(this.selectedFile);
      parseCSV(this.selectedFile, (json) => this.uploadToBackend(json));
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      console.log(this.selectedFile);
      parseXLSX(this.selectedFile, (json) => this.uploadToBackend(json));
    } else {
      this.snackBar.open('Unsupported file format!', 'Close', { duration: 3000 });
    }
  }


  onCancel(): void {
    this.selectedFile = null;
  }
}
