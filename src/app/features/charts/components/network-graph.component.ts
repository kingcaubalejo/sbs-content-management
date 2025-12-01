import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

interface Node {
  id: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
  value: number;
}

@Component({
  selector: 'app-network-graph',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 600px;
    }
    .node {
      cursor: pointer;
    }
    .link {
      stroke: #999;
      stroke-opacity: 0.6;
    }
  `]
})
export class NetworkGraphComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() nodes: Node[] = [];
  @Input() links: Link[] = [];
  @Input() width = 800;
  @Input() height = 600;

  ngOnInit() {
    // Set default data if none provided
    if (this.nodes.length === 0) {
      this.setDefaultData();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.createNetwork(), 100);
  }

  private setDefaultData() {
    this.nodes = [
      { id: 'A', group: 1 },
      { id: 'B', group: 1 },
      { id: 'C', group: 2 },
      { id: 'D', group: 2 },
      { id: 'E', group: 3 },
      { id: 'F', group: 3 }
    ];

    this.links = [
      { source: 'A', target: 'B', value: 1 },
      { source: 'B', target: 'C', value: 2 },
      { source: 'C', target: 'D', value: 1 },
      { source: 'D', target: 'E', value: 2 },
      { source: 'E', target: 'F', value: 1 },
      { source: 'F', target: 'A', value: 1 }
    ];
  }

  private createNetwork() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const simulation = d3.forceSimulation(this.nodes as any)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke-width', (d: any) => Math.sqrt(d.value) * 2);

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 15)
      .attr('fill', (d: any) => color(d.group.toString()))
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', (event, d) => this.dragstarted(event, d, simulation))
        .on('drag', (event, d) => this.dragged(event, d))
        .on('end', (event, d) => this.dragended(event, d, simulation)));

    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.nodes)
      .enter().append('text')
      .text((d: any) => d.id)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });
  }

  private dragstarted(event: any, d: Node, simulation: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: any, d: Node) {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragended(event: any, d: Node, simulation: any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = undefined;
    d.fy = undefined;
  }
}