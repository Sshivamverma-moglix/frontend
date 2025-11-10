import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Department } from 'src/app/enums/department.enum';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'designation', 'department', 'manager', 'phone', 'actions'];
  data = new MatTableDataSource<Employee>();

  departmentEnum = Department;

  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => this.data.data = data,
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page event:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getDepartmentName(departmentId: number): string {
    return Department[departmentId] || 'Unknown';
  }

  getManagerName(managerId: number): string {
    return this.data.data.find(emp => emp.id === managerId)?.name as string;
  }

  deleteEmployee(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.data.data = this.data.data.filter(emp => emp.id !== id);
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter(filter: any) {
    console.log('Filters from child:', filter);
    // Use filter.name, filter.departmentId, filter.managerId to filter employees
  }

}
