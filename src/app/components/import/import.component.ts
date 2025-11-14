import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from 'src/app/services/employee.service';
import { getIdbyName } from 'src/app/utils/idMapper';
import * as Papa from 'papaparse';
import { Employee } from 'src/app/models/employee.model';
import { Department } from 'src/app/models/department.model';
import { DepartmentService } from 'src/app/services/department.service';
import { parseCSV, parseXLSX } from '../../utils/parser'

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
  ) { }

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



 onUpload(): void {
  if (!this.selectedFile) return;

  const fileName = this.selectedFile.name.toLowerCase();

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
