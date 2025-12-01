import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 400px;
    }
  `]
})
export class PieChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: { label: string; value: number }[] = [];
  @Input() width = 400;
  @Input() height = 400;

  ngOnInit() {
    this.createChart();
  }

  private createChart() {
    const element = this.chartContainer.nativeElement;
    const radius = Math.min(this.width, this.height) / 2;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<{ label: string; value: number }>()
      .value(d => d.value);

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const arcs = g.selectAll('.arc')
      .data(pie(this.data))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()));

    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(d => d.data.label);
  }
}