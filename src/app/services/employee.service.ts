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

  employees!: Employee[];

  constructor(private http: HttpClient) { }

  // GET all employees
  getEmployees(): Observable<any> {
    const emp = this.http.get(this.apiUrl);
    return emp;
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
