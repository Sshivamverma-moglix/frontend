import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/models/department.model';
import { getIdbyName } from 'src/app/utils/idMapper';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent {

  departments!: Department[]
  managers!: Employee[]

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService, private router: Router) { }

  newEmployee: Employee = {
    name: '',
    email: '',
    designation: '',
    phone: '',
    departmentName: '',
    managerName: '',
  } as Employee; // 👈 no id field here

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

  addEmployee() {
    const emp = {
      name: this.newEmployee.name,
      email: this.newEmployee.email,
      designation: this.newEmployee.designation,
      phone: this.newEmployee.phone,
      managerId: getIdbyName(this.newEmployee.managerName, this.managers),
      departmentId: getIdbyName(this.newEmployee.departmentName, this.departments)
    }
    console.log(emp);
    this.employeeService.createEmployee(emp).subscribe({
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
