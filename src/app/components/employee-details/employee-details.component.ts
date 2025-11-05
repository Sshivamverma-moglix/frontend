import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  id: number | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private employeeService: EmployeeService) { 
    this.id = Number(route.snapshot.paramMap.get('id'))
  }

  ngOnInit(): void {
    this.getEmployee(this.id as number);
  }

  employee: Employee = {
    id: 0,
    name: '',
    email: '',
    designation: '',
    phone: ''
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

}
