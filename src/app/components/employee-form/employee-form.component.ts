import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  constructor(private employeeService: EmployeeService, private http: HttpClient) { }

  newEmployee: Employee = {
    id: 0,
    name: '',
    email: '',
    designation: '',
    phone: ''
  }

  addEmployee() {
    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

}
