import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from 'src/app/models/department.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import { getIdbyName } from 'src/app/utils/idMapper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { allowOnlyDigits, allowOnlyLetters, sanitizeEmail } from 'src/app/utils/parser';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  id!: number;

  departments: Department[] = [];
  managers: Employee[] = [];

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadDepartments();
    this.loadManagers();
    this.getEmployee(this.id);
  }

   restrictNameInput(event: any) {
    const sanitized = allowOnlyLetters(event);
    this.employeeForm.get('name')?.setValue(sanitized);
  }

  restrictPhoneInput(event: any) {
    const sanitized = allowOnlyDigits(event);
    this.employeeForm.get('phone')?.setValue(sanitized);
  }

  restrictEmailInput(event: any) {
    const sanitized = sanitizeEmail(event);
    this.employeeForm.get('email')?.setValue(sanitized);
  }


  employeeForm = new FormGroup({
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
    departmentId: new FormControl(null, Validators.required),
    managerId: new FormControl(null)
  });

  loadDepartments() {
    this.departments = this.departmentService.departments;
  }

  loadManagers() {
    this.managers = this.employeeService.employees;
  }

  getEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employeeForm.patchValue({
          name: data.name,
          email: data.email,
          designation: data.designation,
          phone: data.phone,
          departmentId: getIdbyName(data.department, this.departments),
          managerId: getIdbyName(data.manager, this.managers)
        });
      },
      error: () => alert('Something went wrong')
    });
  }

  updateEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.employeeService.updateEmployee(this.id, this.employeeForm.value).subscribe({
      next: () => {
        this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.snackBar.open('Failed to update employee!', 'Close', { duration: 3000 });
      }
    });
  }
}
