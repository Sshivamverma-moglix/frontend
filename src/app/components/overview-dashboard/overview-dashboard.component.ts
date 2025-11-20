import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { ChartConfiguration, ChartOptions, ChartType, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-overview-dashboard',
  templateUrl: './overview-dashboard.component.html',
  styleUrls: ['./overview-dashboard.component.css']
})
export class OverviewDashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  segments = ["All", "Online", "Enterprise", "Both"];
  selectedSegment = "All";

  chartTitle = 'Supplier Overview';
  chartType: ChartType = 'bar';
  chartLegend = true;

  labels = [
    'Total Suppliers',
    'Active Suppliers',
    'Disabled Suppliers',
    'Profile Incomplete'
  ];

  chartData: ChartData<'bar'> = {
    labels: this.labels,
    datasets: []
  };

  chartOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,

      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadData(this.selectedSegment);
  }

  onSegmentChange(segment: string) {
    this.selectedSegment = segment;
    this.loadData(segment);
  }

  loadData(segment: string) {
    this.employeeService.getTabContent(segment).subscribe({
      next: (data: any) => {
        const values = [
          data.totalSuppliers,
          data.activeSuppliers,
          data.disabledSuppliers,
          data.profileIncomplete
        ];

        this.chartData.datasets = [
          {
            label: 'Suppliers Overview',
            data: values,
            backgroundColor: [
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
            ],
            borderWidth: 1
          }
        ];

        // Force chart to refresh
        setTimeout(() => {
          if (this.chart) this.chart.update();
        }, 0);
      },

      error: (err) => {
        console.log("Failed to fetch API →", err.message);
      }
    });
  }
}
