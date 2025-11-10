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


  managerId = 0;
  departmentId = 0;
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;


  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(managerId: number | null = null, departmentId: number | null = null, pageIndex: number = 0, pageSize: number = 10) {
    console.log(pageIndex, pageSize);
    this.employeeService.getEmployees(managerId, departmentId, pageIndex, pageSize).subscribe({
      next: (data) => {
        this.data.data = data
        this.totalItems = data.length;
        console.log(data, data.length);
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEmployees(this.managerId, this.departmentId, this.pageIndex, this.pageSize);
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
    this.managerId = filter.managerId;
    this.departmentId = filter.departmentId;
    this.getEmployees(this.managerId, this.departmentId, this.pageIndex, this.pageSize);
    // Use filter.name, filter.departmentId, filter.managerId to filter employees
  }

}
