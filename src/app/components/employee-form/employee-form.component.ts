import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  constructor(private employeeService: EmployeeService, private router: Router) {}

  newEmployee: Employee = {
    name: '',
    email: '',
    designation: '',
    phone: ''
  } as Employee; // 👈 no id field here

  addEmployee() {
    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: (data) => {
        console.log('Employee added:', data);
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        console.error('Error adding employee:', error);
      }
    });
  }
}
