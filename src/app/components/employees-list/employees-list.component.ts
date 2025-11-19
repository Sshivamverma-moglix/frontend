import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';
import { Department } from 'src/app/enums/department.enum';
import { PageEvent } from '@angular/material/paginator';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'designation', 'department', 'manager', 'phone', 'actions'];
  data = new MatTableDataSource<Employee>();

  departmentEnum = Department;

  charType = "line"
  barChartLabels: string[] = [];
  barChartDatasets: ChartConfiguration<ChartType>['data']['datasets'] = [];



  managerName = '';
  departmentName = '';
  name = '';
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;


  constructor(private employeeService: EmployeeService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.employeeService.getAllData().subscribe((data: any[]) => {
      const groupedData: { [key: string]: number } = {};

      data.forEach(emp => {
        const date = emp.createdDate;
        groupedData[date] = (groupedData[date] || 0) + 1;
      });

      this.barChartLabels = Object.keys(groupedData);

      this.barChartDatasets = [
        {
          data: Object.values(groupedData),
          label: 'Employees Created',
          backgroundColor: 'rgba(54, 162, 235)'
        }
      ];
    });
    this.getEmployees();
  }

  getEmployees(manager: string | null = null, department: string | null = null, name: string | null = null, pageIndex: number = 0, pageSize: number = 10) {
    this.employeeService.getEmployees(manager, department, name, pageIndex, pageSize).subscribe({
      next: (data) => {
        this.data.data = data.data.map((emp: any) => ({ ...emp, managerName: emp.manager, departmentName: emp.department }));
        this.totalItems = data.totalRecords;
        this.pageIndex = data.page;
        this.pageSize = data.limit;
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEmployees(this.managerName, this.departmentName, this.name, this.pageIndex, this.pageSize);
  }

  openDeleteDialog(id: number, name: string, event: MouseEvent) {
  event.stopPropagation();  // prevent row click

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: { name }  // passing employee name in dialog
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.deleteEmployee(id);
    }
  });
}

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.data.data = this.data.data.filter(emp => {
          emp.id !== id;
        });
        this.snackBar.open("Employee deleted successfully", "Close", { duration: 3000 })
      },
      error: (err) => {
        this.snackBar.open("Failed to delete Employee", "Close", { duration: 3000 })
      }
    });
  }

  applyFilter(filter: any) {
    this.managerName = filter.managerName;
    this.departmentName = filter.departmentName;
    this.name = filter.name;
    this.getEmployees(this.managerName, this.departmentName, this.name, this.pageIndex, this.pageSize);
  }

}
