import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

interface ForceNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  size: number;
}

interface ForceLink extends d3.SimulationLinkDatum<ForceNode> {
  source: string | ForceNode;
  target: string | ForceNode;
  value: number;
}

@Component({
  selector: 'app-force-directed-graph',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 700px;
      border: 1px solid #ddd;
    }
    .node {
      cursor: pointer;
      stroke: #fff;
      stroke-width: 2px;
    }
    .link {
      stroke: #333;
      stroke-opacity: 0.8;
      stroke-width: 2px;
    }
    .node-label {
      font-family: Arial, sans-serif;
      font-size: 12px;
      pointer-events: none;
      text-anchor: middle;
      dominant-baseline: middle;
    }
  `]
})
export class ForceDirectedGraphComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() nodes: ForceNode[] = [];
  @Input() links: ForceLink[] = [];
  @Input() width = 900;
  @Input() height = 700;

  private simulation!: d3.Simulation<ForceNode, ForceLink>;

  ngOnInit() {
    if (this.nodes.length === 0) {
      this.setDefaultData();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.createForceDirectedGraph(), 100);
  }

  private setDefaultData() {
    this.nodes = [
      { id: 'Central Hub', group: 1, size: 20 },
      { id: 'Node A', group: 2, size: 15 },
      { id: 'Node B', group: 2, size: 15 },
      { id: 'Node C', group: 3, size: 12 },
      { id: 'Node D', group: 3, size: 12 },
      { id: 'Node E', group: 4, size: 10 },
      { id: 'Node F', group: 4, size: 10 },
      { id: 'Node G', group: 5, size: 8 },
      { id: 'Node H', group: 5, size: 8 }
    ];

    this.links = [
      { source: 'Central Hub', target: 'Node A', value: 5 },
      { source: 'Central Hub', target: 'Node B', value: 4 },
      { source: 'Node A', target: 'Node C', value: 3 },
      { source: 'Node B', target: 'Node D', value: 3 },
      { source: 'Node C', target: 'Node E', value: 2 },
      { source: 'Node D', target: 'Node F', value: 2 },
      { source: 'Node E', target: 'Node G', value: 1 },
      { source: 'Node F', target: 'Node H', value: 1 },
      { source: 'Node A', target: 'Node B', value: 2 },
      { source: 'Node C', target: 'Node D', value: 1 }
    ];
  }

  private createForceDirectedGraph() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    console.log('Creating force graph with:', this.nodes.length, 'nodes and', this.links.length, 'links');

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
      .style('background', '#f9f9f9');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create force simulation
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink<ForceNode, ForceLink>(this.links)
        .id(d => d.id)
        .distance(d => 100 - d.value * 10)
        .strength(0.5))
      .force('charge', d3.forceManyBody()
        .strength(-400)
        .distanceMax(300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => (d as ForceNode).size + 5));

    // Create links
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.8)
      .attr('stroke-width', d => Math.max(2, Math.sqrt(d.value) * 2));

    // Create nodes
    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => d.size)
      .attr('fill', d => color(d.group.toString()))
      .call(d3.drag<SVGCircleElement, ForceNode>()
        .on('start', (event, d) => this.dragstarted(event, d))
        .on('drag', (event, d) => this.dragged(event, d))
        .on('end', (event, d) => this.dragended(event, d)));

    // Add labels
    const label = svg.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(this.nodes)
      .enter().append('text')
      .attr('class', 'node-label')
      .text(d => d.id)
      .style('fill', 'white')
      .style('font-weight', 'bold');

    // Add tooltips
    node.append('title')
      .text(d => `${d.id}\nGroup: ${d.group}\nSize: ${d.size}`);

    // Update positions on tick
    this.simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as ForceNode).x!)
        .attr('y1', d => (d.source as ForceNode).y!)
        .attr('x2', d => (d.target as ForceNode).x!)
        .attr('y2', d => (d.target as ForceNode).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });

    svg.call(zoom);
  }

  private dragstarted(event: d3.D3DragEvent<SVGCircleElement, ForceNode, ForceNode>, d: ForceNode) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(event: d3.D3DragEvent<SVGCircleElement, ForceNode, ForceNode>, d: ForceNode) {
    d.fx = event.x;
    d.fy = event.y;
  }

  private dragended(event: d3.D3DragEvent<SVGCircleElement, ForceNode, ForceNode>, d: ForceNode) {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = undefined;
    d.fy = undefined;
  }
}