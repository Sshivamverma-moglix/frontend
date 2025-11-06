import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
      }
    });
  }

  deleteEmployee(id: number, event: MouseEvent) {
    event.stopPropagation(); // stop the click from triggering routerLink
    this.employeeService.deleteEmployee(id).subscribe({
      next: (data) => {
        console.log(data);
        this.employees = this.employees.filter(emp => emp.id !== id)
      },
      error: (error) => {
        console.log(error)
      }
    })
    // your delete logic here
  }

}
