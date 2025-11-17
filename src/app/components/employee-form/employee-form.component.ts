import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/models/department.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { allowOnlyDigits, allowOnlyLetters, sanitizeEmail } from 'src/app/utils/parser';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  departments!: Department[]
  managers!: Employee[]

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService, private router: Router, private snackBar: MatSnackBar,) { }

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
      next: (data) => this.managers = data.data as any,
      error: (err) => console.log("error loading managers", err)
    })
  }

  restrictNameInput(event: any) {
    const sanitized = allowOnlyLetters(event);
    this.newEmployee.get('name')?.setValue(sanitized);
  }

  restrictPhoneInput(event: any) {
    const sanitized = allowOnlyDigits(event);
    this.newEmployee.get('phone')?.setValue(sanitized);
  }

  restrictEmailInput(event: any) {
    const sanitized = sanitizeEmail(event);
    this.newEmployee.get('email')?.setValue(sanitized);
  }

  newEmployee = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]+$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    designation: new FormControl('', [
      Validators.required,
      Validators.pattern(/\S+/)
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),
    // address: new FormControl('', Validators.required),
    departmentId: new FormControl(null, Validators.required),
    managerId: new FormControl(null),
  })

  submitForm() {
    if (this.newEmployee.invalid) return;

    console.log("Submitted:", this.newEmployee.value);
    this.employeeService.createEmployee(this.newEmployee.value).subscribe({
      next: (data) => {
        console.log('Employee added:', data);
        this.snackBar.open('New employee added successfully!', 'Close', { duration: 3000 })
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error adding employee:', error);
      }
    });
  }
}
