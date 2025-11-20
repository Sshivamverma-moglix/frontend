import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import { FunnelData } from 'src/app/models/funnel-data.model';

// Register funnel plugin once. Prefer to move this registration to app.module.ts.
// If you keep it here, it's fine but ensure it runs only once.
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
try {
  // Chart.register throws if already registered with same id in some environments; guard it.
  // This try/catch prevents duplicate registration errors in dev/hmr modes.
  Chart.register(FunnelController, TrapezoidElement);
} catch (e) {
  // ignore duplicate registration
  // console.warn('Funnel plugin registration skipped:', e);
}

@Component({
  selector: 'app-funnel-chart',
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.css']
})
export class FunnelChartComponent implements OnChanges {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @Input() funnelData!: FunnelData | null;
  @Output() segmentChanged = new EventEmitter<string>();

  segments = ["All", "Online", "Enterprise", "Both"];
  selectedSegment = "All";

  chartTitle = 'Supplier Funnel';
  // type must match registered funnel type
  chartType: ChartType = 'funnel';
  chartLegend = false;

  // initial labels (can be overwritten by API)
  labels = ['signUp', 'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'activated'];

  // initialize chartData similar to your working component
  chartData: ChartData<'funnel'> = {
    labels: this.labels,
    datasets: []
  };

  chartOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}`
        }
      },
      title: {
        display: true,
        text: this.chartTitle
      }
    },
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['funnelData'] && this.funnelData) {
      this.updateChart(this.funnelData);
    }
  }

  onSegmentChange(segment: string) {
    this.selectedSegment = segment;
    this.segmentChanged.emit(segment);
  }

  updateChart(data: FunnelData) {
    const labels = data.stages?.map((s: any) => s.name) ?? this.labels;
    const counts = data.stages?.map((s: any) => s.count) ?? [];

    this.chartData.labels = labels;
    this.chartData.datasets = [
      {
        data: counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderWidth: 1,
        shrinkAnchor: 'none',
        shrinkFraction: 0
      } as any
    ];

    if (this.chart) {
      this.chart.update();
    }
  }
}
