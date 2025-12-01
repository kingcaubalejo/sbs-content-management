import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

interface OrgNode {
  id: string;
  name: string;
  title: string;
  level: number;
  parentId?: string;
  children?: OrgNode[];
}

@Component({
  selector: 'app-org-chart',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 600px;
      overflow: auto;
    }
    .node {
      cursor: pointer;
    }
    .node rect {
      fill: #fff;
      stroke: #3f51b5;
      stroke-width: 2px;
    }
    .node text {
      font-family: Arial, sans-serif;
      font-size: 12px;
      text-anchor: middle;
    }
    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }
  `]
})
export class OrgChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: OrgNode[] = [];
  @Input() width = 1000;
  @Input() height = 600;

  ngOnInit() {
    if (this.data.length === 0) {
      this.setDefaultData();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.createOrgChart(), 100);
  }

  private setDefaultData() {
    this.data = [
      { id: '1', name: 'John Smith', title: 'CEO', level: 0 },
      { id: '2', name: 'Sarah Johnson', title: 'CTO', level: 1, parentId: '1' },
      { id: '3', name: 'Mike Davis', title: 'CFO', level: 1, parentId: '1' },
      { id: '4', name: 'Lisa Wilson', title: 'VP Engineering', level: 2, parentId: '2' },
      { id: '5', name: 'Tom Brown', title: 'VP Product', level: 2, parentId: '2' },
      { id: '6', name: 'Anna Garcia', title: 'Finance Manager', level: 2, parentId: '3' },
      { id: '7', name: 'David Lee', title: 'Senior Developer', level: 3, parentId: '4' },
      { id: '8', name: 'Emma Taylor', title: 'UX Designer', level: 3, parentId: '5' }
    ];
  }

  private createOrgChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    // Convert flat data to hierarchy
    const root = this.buildHierarchy(this.data);

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background', '#f9f9f9');

    const g = svg.append('g')
      .attr('transform', 'translate(50,50)');

    // Create tree layout
    const tree = d3.tree<OrgNode>()
      .size([this.width - 100, this.height - 100])
      .separation((a, b) => a.parent === b.parent ? 1 : 2);

    const treeData = tree(root);

    // Create links
    g.selectAll('.link')
      .data(treeData.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical<any, any>()
        .x(d => d.x)
        .y(d => d.y));

    // Create nodes
    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add rectangles for nodes
    node.append('rect')
      .attr('width', 120)
      .attr('height', 60)
      .attr('x', -60)
      .attr('y', -30)
      .attr('rx', 5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#3f51b5')
      .attr('stroke-width', 2);

    // Add names
    node.append('text')
      .attr('dy', '-5')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('font-size', '12px')
      .text(d => d.data.name);

    // Add titles
    node.append('text')
      .attr('dy', '10')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text(d => d.data.title);

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', `translate(50,50) ${event.transform}`);
      });

    svg.call(zoom);
  }

  private buildHierarchy(flatData: OrgNode[]): d3.HierarchyNode<OrgNode> {
    // Find root node (no parentId)
    const rootData = flatData.find(d => !d.parentId)!;
    
    // Build children recursively
    const buildChildren = (parentId: string): OrgNode[] => {
      return flatData
        .filter(d => d.parentId === parentId)
        .map(d => ({
          ...d,
          children: buildChildren(d.id)
        }));
    };

    const hierarchyData: OrgNode = {
      ...rootData,
      children: buildChildren(rootData.id)
    };

    return d3.hierarchy(hierarchyData) as d3.HierarchyNode<OrgNode>;
  }
}