import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
// import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesListComponent } from '../app/components/employees-list/employees-list.component';
import { EmployeeDetailsComponent } from '../app/components/employee-details/employee-details.component';
import { EmployeeFormComponent } from '../app/components/employee-form/employee-form.component';

@NgModule({
  declarations: [
    AppComponent,
    EmployeesListComponent,
    EmployeeDetailsComponent,
    EmployeeFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    // HttpClient,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
