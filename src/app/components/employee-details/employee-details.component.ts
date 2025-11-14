import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/models/department.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import { getIdbyName } from 'src/app/utils/idMapper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  id: number | null = null;

  departments!: Department[];
  managers!: Employee[]

  constructor(private route: ActivatedRoute,  private snackBar: MatSnackBar, private http: HttpClient, private employeeService: EmployeeService, private departmentService: DepartmentService) {
    this.id = Number(route.snapshot.paramMap.get('id'))
  }


  ngOnInit() {
    this.getEmployee(this.id as number);
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
      next: (data) => this.managers = data.data.filter((emp:any) => emp.id !== this.id) as any,
      error: (err) => console.log("error loading managers", err)
    })
  }

  employee: Employee = {
    id: 0,
    name: '',
    email: '',
    designation: '',
    phone: '',
    departmentName: '',
    managerName: '',
  }

  allowOnlyAlphabets(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!/[a-zA-Z\s]/.test(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const char = event.key;
    // Allow only digits
    if (!/^\d$/.test(char)) {
      event.preventDefault();
    }
  }

  validateEmail(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {
      console.log('Invalid email:', value);
    } else {
      console.log('Valid email:', value);
    }
  }


  getEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = {
          id: data.id,
          name: data.name,
          email: data.email,
          designation: data.designation,
          phone: data.phone,
          departmentName: data.department,
          managerName: data.manager,
        };
      },
      error: (err) => {
        alert('something went wrong');
      }
    })
  }

  updateEmployee() {
   
    this.employeeService.updateEmployee(this.id as number, {
      name: this.employee.name,
      email: this.employee.email,
      designation: this.employee.designation,
      phone: this.employee.phone,
      managerId: getIdbyName(this.employee.managerName, this.managers),
      departmentId: getIdbyName(this.employee.departmentName, this.departments)
    }
    ).subscribe({
      next: (data) => {
        this.snackBar.open('Employee updated successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to update Employee!', 'Close', { duration: 3000 });
      }
    })
  }

}
