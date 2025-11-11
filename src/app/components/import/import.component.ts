import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent {
  selectedFile: File | null = null;
  message = '';
  uploading = false;

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.uploading = true;

    this.employeeService.createEmployees(this.selectedFile).subscribe({
      next: (res) => {
        this.uploading = false;
        this.message = res.message;
        this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.uploading = false;
        this.message = 'Upload failed: ' + (err.error || 'Server error');
        this.snackBar.open('Upload failed!', 'Close', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.selectedFile = null;
  }
}
