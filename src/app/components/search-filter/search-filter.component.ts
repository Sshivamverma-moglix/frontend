import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Department } from 'src/app/models/department.model';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {

  departments!: Department[];
  managers!: Employee[];

  // Object to hold form values
  filter = {
    name: '',
    departmentId: 0,
    managerId: 0
  };

  // Emit the whole filter object to parent
  @Output() filterChanged = new EventEmitter<any>();

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.getDepartments();
    this.getManagers();
  }

  getDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: data => this.departments = data as any,
      error: () => console.log('Error fetching departments')
    });
  }

  getManagers() {
    this.employeeService.getEmployees().subscribe({
      next: (data: Employee[]) => this.managers = data.filter(emp => emp.managerId === 0),
      error: () => console.log('Error fetching managers')
    });
  }

  // Called when form is submitted
  onSearch() {
    this.filterChanged.emit(this.filter);
  }
}
