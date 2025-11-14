import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-new-chart',
  templateUrl: './new-chart.component.html',
  styleUrls: ['./new-chart.component.css']
})
export class NewChartComponent implements OnInit, OnChanges {

  @Input() chartLabels: string[] = [];
  @Input() chartDatasets: ChartConfiguration['data']['datasets'] = [];
  @Input() chartType: any = 'bar';
  @Input() chartLegend: boolean = true;
  @Input() chartTitle: string = '';
  @Input() responsive: boolean = true;

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartLabels'] || changes['chartDatasets']) {
      this.chartData = {
        labels: this.chartLabels,
        datasets: this.chartDatasets
      };

      console.log("Updated chartData:", this.chartData);
    }
  }
}
