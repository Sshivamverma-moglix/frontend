import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';


const routes: Routes = [
    // { path: 'about', component: AboutComponent },
    { path: 'employees', component: EmployeesListComponent },
    { path: 'employees/add', component: EmployeeFormComponent},
    { path: 'employees/:id', component: EmployeeDetailsComponent},
    
];

@NgModule({
    imports: [CommonModule, RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
