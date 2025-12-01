import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-philippines-map',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 600px;
    }
    .province {
      fill: #e8f4f8;
      stroke: #2196f3;
      stroke-width: 1px;
      cursor: pointer;
    }
    .province:hover {
      fill: #2196f3;
    }
  `]
})
export class PhilippinesMapComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: { province: string; value: number }[] = [];
  @Input() width = 600;
  @Input() height = 600;

  ngOnInit() {
    if (this.data.length === 0) {
      this.setDefaultData();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.createPhilippinesMap(), 100);
  }

  private setDefaultData() {
    this.data = [
      { province: 'Metro Manila', value: 95 },
      { province: 'Cebu', value: 85 },
      { province: 'Davao', value: 75 },
      { province: 'Iloilo', value: 65 },
      { province: 'Baguio', value: 70 }
    ];
  }

  private createPhilippinesMap() {
    console.log('Creating Philippines map...');
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('background', '#e3f2fd')
      .style('border', '2px solid #2196f3');

    const projection = d3.geoMercator()
      .center([122, 12])
      .scale(2000)
      .translate([this.width / 2, this.height / 2]);

    const path = d3.geoPath().projection(projection);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(this.data, d => d.value) || 100]);

    // Philippines islands with more realistic shapes using SVG paths
    const islands = [
      {
        name: 'Luzon',
        path: 'M200,100 Q180,120 190,160 Q200,200 220,240 Q240,260 260,240 Q280,220 270,180 Q260,140 240,120 Q220,100 200,100 Z',
        color: colorScale(80)
      },
      {
        name: 'Mindanao', 
        path: 'M320,350 Q300,370 310,410 Q330,450 360,460 Q390,450 400,420 Q390,390 370,370 Q350,350 320,350 Z',
        color: colorScale(70)
      },
      {
        name: 'Samar',
        path: 'M290,250 Q280,260 285,280 Q295,300 310,295 Q320,285 315,270 Q305,255 290,250 Z',
        color: colorScale(60)
      },
      {
        name: 'Negros',
        path: 'M270,280 Q260,290 265,310 Q275,330 285,325 Q295,315 290,300 Q280,285 270,280 Z',
        color: colorScale(65)
      },
      {
        name: 'Cebu',
        path: 'M300,290 Q295,300 298,320 Q305,340 312,335 Q318,325 315,310 Q308,295 300,290 Z',
        color: colorScale(85)
      },
      {
        name: 'Bohol',
        path: 'M310,320 Q305,325 308,335 Q315,345 322,340 Q328,335 325,330 Q318,325 310,320 Z',
        color: colorScale(55)
      },
      {
        name: 'Leyte',
        path: 'M320,270 Q315,280 320,300 Q330,320 340,315 Q345,305 340,290 Q335,275 320,270 Z',
        color: colorScale(58)
      },
      {
        name: 'Panay',
        path: 'M250,300 Q240,310 245,330 Q255,350 270,345 Q280,335 275,320 Q265,305 250,300 Z',
        color: colorScale(62)
      },
      {
        name: 'Palawan',
        path: 'M150,250 Q140,270 145,320 Q150,370 155,350 Q160,300 165,270 Q170,250 150,250 Z',
        color: colorScale(50)
      }
    ];

    // Draw islands
    svg.selectAll('.island')
      .data(islands)
      .enter()
      .append('path')
      .attr('class', 'island')
      .attr('d', d => d.path)
      .attr('fill', d => d.color)
      .attr('stroke', '#2196f3')
      .attr('stroke-width', 1.5)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#1976d2');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', d.color);
      });

    // Add island labels
    const labelPositions = [
      { name: 'Luzon', x: 230, y: 170 },
      { name: 'Mindanao', x: 360, y: 400 },
      { name: 'Samar', x: 300, y: 270 },
      { name: 'Negros', x: 280, y: 300 },
      { name: 'Cebu', x: 308, y: 315 },
      { name: 'Bohol', x: 318, y: 332 },
      { name: 'Leyte', x: 332, y: 290 },
      { name: 'Panay', x: 260, y: 325 },
      { name: 'Palawan', x: 155, y: 300 }
    ];

    svg.selectAll('.island-label')
      .data(labelPositions)
      .enter()
      .append('text')
      .attr('class', 'island-label')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .text(d => d.name);

    // Add title
    svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#1976d2')
      .text('Republic of the Philippines');

    console.log('Map creation completed');


  }
}