import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}`;

  employees: Employee[] = [];

  constructor(private http: HttpClient) {
    const emp = this.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  // GET all employees
  getEmployees(managerId: null | number = null, departmentId: null | number = null, pageIndex: number = 0, pageSize: number = 0): Observable<any> {
    const emp = this.http.get(`${this.apiUrl}?page=${pageIndex}&limit=${pageSize}&managerId=${managerId ? managerId: ''}&departmentId=${departmentId ? departmentId : ''}`);
    return emp;
  }

  getAllData() {
    const data = this.http.get(this.apiUrl);
    return data;
  }

  getAllManagers() {
    const managers = this.http.get(`${this.apiUrl}/managers`);
    return managers;
  }

  // GET single employee by ID
  getEmployeeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // POST create new employee
  createEmployee(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  // PUT update employee
  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // DELETE employee
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
