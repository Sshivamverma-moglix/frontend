import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import { EmployeeService } from 'src/app/services/employee.service';

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
export class FunnelChartComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

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
    // funnel-specific options (you can tune these)
    // funnel: {
    //   dynamicHeight: false,
    //   dynamicSlope: false,
    //   sort: 'none'
    // }
  };

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.getFunnelData();
  }

  getFunnelData() {
    this.employeeService.getFunnelData().subscribe({
      next: (data: any) => {
        // use API-provided labels if available
        const labels = data.stages?.map((s: any) => s.name) ?? this.labels;
        const counts = data.stages?.map((s: any) => s.count) ?? [];

        // Update the existing chartData object rather than replacing it
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
            // make rectangular layers
            shrinkAnchor: 'none',
            shrinkFraction: 0
          } as any // cast so ng2-charts / Chart types accept funnel-specific props
        ];

        // Force chart to refresh (same pattern as your working component)
        setTimeout(() => {
          if (this.chart) this.chart.update();
        }, 0);
      },
      error: (err) => {
        console.log("Error fetching funnel data →", err);
      }
    });
  }
}
