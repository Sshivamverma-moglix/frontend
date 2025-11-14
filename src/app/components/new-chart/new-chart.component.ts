import { Component, OnInit, Input } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions,  } from 'chart.js';

@Component({
  selector: 'app-new-chart',
  templateUrl: './new-chart.component.html',
  styleUrls: ['./new-chart.component.css']
})
export class NewChartComponent implements OnInit {
  @Input() chartLabels: string[] = [];
  @Input() chartDatasets: any[] = [];
  @Input() chartType: any = 'bar';
  @Input() chartLegend: boolean = true;
  @Input() chartTitle: string = '';
  @Input() responsive: boolean = true;

 chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  chartData: ChartData = {
    labels: [],
    datasets: []
  };

  ngOnInit(): void {
    this.chartData = {
      labels: this.chartLabels,
      datasets: this.chartDatasets
    };
  }
}
