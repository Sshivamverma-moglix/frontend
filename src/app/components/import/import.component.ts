import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee.service';
import { getIdbyName } from 'src/app/utils/idMapper';
import * as Papa from 'papaparse';
import { Employee } from 'src/app/models/employee.model';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  selectedFile: File | null = null;
  message = '';
  uploading = false;

  managers: any[] = [];
  departments: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadManagers();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data) => this.departments = data as any,
      error: (err) => console.error('Error loading departments', err)
    });
  }

  loadManagers() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.managers = data.data,
      error: (err) => console.log("error loading managers", err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    // this.uploading = true;

    Papa.parse(this.selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result: any) => {

        const updatedResult = result.data.map((row: any) => ({
          name: row.name,
          email: row.email,
          designation: row.designation,
          phone: row.phone,
          managerId: row.manager,
          departmentId: row.department
        }));

        const newCsv = Papa.unparse(updatedResult);
        const updatedFile = new File([newCsv], 'data.csv', { type: 'text/csv' });
        
        this.employeeService.createEmployees(updatedFile).subscribe({
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
    });
  }

  onCancel(): void {
    this.selectedFile = null;
  }
}
