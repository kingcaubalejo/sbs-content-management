import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 400px;
    }
  `]
})
export class LineChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: { date: Date; value: number }[] = [];
  @Input() width = 600;
  @Input() height = 400;

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(this.data, d => d.date);
    const yExtent = d3.extent(this.data, d => d.value);

    const x = d3.scaleTime()
      .rangeRound([0, width])
      .domain(xExtent[0] && xExtent[1] ? [xExtent[0], xExtent[1]] : [new Date(), new Date()]);

    const y = d3.scaleLinear()
      .rangeRound([height, 0])
      .domain(yExtent[0] !== undefined && yExtent[1] !== undefined ? [yExtent[0], yExtent[1]] : [0, 100]);

    const line = d3.line<{ date: Date; value: number }>()
      .x(d => x(d.date))
      .y(d => y(d.value));

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y));

    g.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2)
      .attr('d', line);
  }
}