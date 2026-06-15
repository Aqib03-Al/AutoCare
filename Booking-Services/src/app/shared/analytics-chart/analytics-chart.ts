import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export type ChartKind = 'bar' | 'line' | 'doughnut';

@Component({
  selector: 'app-analytics-chart',
  template: `<div class="chart-wrap"><canvas #canvas></canvas></div>`,
  styles: `
    .chart-wrap {
      position: relative;
      height: 280px;
      width: 100%;
    }
  `,
})
export class AnalyticsChart implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) kind!: ChartKind;
  @Input({ required: true }) labels: string[] = [];
  @Input({ required: true }) values: number[] = [];
  @Input() label = 'Count';
  @Input() colors: string[] = [];
  @Input() fill = false;

  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;
  private viewReady = false;

  ngAfterViewInit() {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(_changes: SimpleChanges) {
    if (this.viewReady) {
      this.renderChart();
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private renderChart() {
    const canvasEl = this.canvas()?.nativeElement;
    if (!canvasEl || !this.labels.length) {
      return;
    }

    const palette =
      this.colors.length > 0
        ? this.colors
        : ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

    const backgroundColor =
      this.kind === 'line'
        ? 'rgba(37, 99, 235, 0.15)'
        : this.labels.map((_, index) => palette[index % palette.length]);

    const borderColor =
      this.kind === 'line'
        ? '#2563eb'
        : this.labels.map((_, index) => palette[index % palette.length]);

    const config: ChartConfiguration = {
      type: this.kind,
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            data: this.values,
            backgroundColor,
            borderColor,
            borderWidth: this.kind === 'line' ? 2 : 1,
            borderRadius: this.kind === 'bar' ? 8 : 0,
            fill: this.kind === 'line' ? this.fill : undefined,
            tension: this.kind === 'line' ? 0.35 : undefined,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.kind === 'doughnut',
            position: 'bottom',
          },
        },
        scales:
          this.kind === 'doughnut'
            ? undefined
            : {
                x: {
                  grid: { display: false },
                  ticks: { color: '#6b7280' },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: '#f3f4f6' },
                  ticks: {
                    color: '#6b7280',
                    precision: 0,
                  },
                },
              },
      },
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvasEl, config);
  }
}
