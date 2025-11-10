import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee.model';
import { Department } from '../models/department.model';

@Injectable({
    providedIn: 'root'
})

export class DepartmentService {

    apiUrl = environment.apiDepartmentUrl;

    departments!: Department[]

    constructor(private http: HttpClient) {
        const department = this.getDepartments().subscribe({
            next: (data) => {
                console.log(data);
                this.departments = data as any;
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    getDepartments() {
        return this.http.get(this.apiUrl);
    }
}