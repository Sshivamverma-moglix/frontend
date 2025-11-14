import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public barChartLabels: string[] = [];
  public barChartType: any = 'bar';
  public barChartLegend = true;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { data: [], label: 'Employees Created' }
    ]
  };

  constructor(private http: HttpClient, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    // Fetch employee data from backend
    this.employeeService.getAllData().subscribe((data: any) => {
      const groupedData: { [key: string]: number } = {};

      // Count employees per createdDate
      data.forEach((emp: any) => {
        const date = emp.createdDate;
        groupedData[date] = (groupedData[date] || 0) + 1;
      });

      // const groupedData = {
      //   "2025-11-01": 2,
      //   "2025-11-02": 3,
      //   "2025-11-03": 1,
      //   "2025-11-04": 4,
      //   "2025-11-05": 2,
      //   "2025-11-06": 5,
      //   "2025-11-07": 3,
      //   "2025-11-08": 2,
      //   "2025-11-09": 4,
      //   "2025-11-10": 1,
      //   "2025-11-11": 3,
      //   "2025-11-12": 2,
      //   "2025-11-13": 5,
      //   "2025-11-14": 3,
      //   "2025-11-15": 2,
      //   "2025-11-16": 4,
      //   "2025-11-17": 3,
      //   "2025-11-18": 2,
      //   "2025-11-19": 1,
      //   "2025-11-20": 3,
      //   "2025-11-21": 4,
      //   "2025-11-22": 2,
      //   "2025-11-23": 5,
      //   "2025-11-24": 3,
      //   "2025-11-25": 2,
      //   "2025-11-26": 1,
      //   "2025-11-27": 4,
      //   "2025-11-28": 3,
      //   "2025-11-29": 2,
      //   "2025-11-30": 5
      // };

      // Set labels and data dynamically
      this.barChartLabels = Object.keys(groupedData);
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          {
            data: Object.values(groupedData),
            label: 'Employees Created',
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          }
        ]
      };
    });
  }
}
