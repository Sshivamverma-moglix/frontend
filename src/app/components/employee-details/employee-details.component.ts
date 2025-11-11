import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Department } from 'src/app/models/department.model';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  id: number | null = null;

  departments!: Department[];
  managers!: Employee[]

  constructor(private route: ActivatedRoute, private http: HttpClient, private employeeService: EmployeeService, private departmentService: DepartmentService) {
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
    this.employeeService.getAllManagers().subscribe({
      next: (data) => this.managers = data as any,
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
        this.employee = data
      },
      error: (err) => {
        alert('something went wrong');
      }
    })
  }

  updateEmployee() {
    this.employeeService.updateEmployee(this.id as number, this.employee).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
