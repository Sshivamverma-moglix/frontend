import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
 getEmployees(
  manager: string | null = null,
  department: string | null = null,
  name: string | null = null,
  pageIndex: number = 0,
  pageSize: number = 0
): Observable<any> {
  let params = new HttpParams()
    .set('page', pageIndex.toString())
    .set('limit', pageSize.toString());

  if (manager) {
    params = params.set('manager', manager);
  }

  if (department) {
    params = params.set('department', department);
  }

  if (name) {
    params = params.set('name', name);
  }

  return this.http.get(`${this.apiUrl}`, { params });
}


  getAllData() : Observable<any> {
    const data = this.http.get(`${this.apiUrl}/all-employees`);
    return data;
  }

  getAllManagers() : Observable<any> {
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

  createEmployees(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/add-bulk`, formData);
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
