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

    constructor(private http: HttpClient) { }

    getDepartments(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
}