import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map-chart',
  standalone: true,
  template: `<div #chartContainer class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 500px;
    }
    .country {
      cursor: pointer;
      transition: fill 0.3s ease;
    }
  `]
})
export class MapChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() data: { country: string; value: number }[] = [];
  @Input() width = 800;
  @Input() height = 500;

  ngOnInit() {
    console.log('MapChart ngOnInit called', this.data);
  }

  ngAfterViewInit() {
    console.log('MapChart ngAfterViewInit called');
    setTimeout(() => this.createMap(), 100);
  }

  private createMap() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();
    
    const svg = d3.select(element)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const projection = d3.geoNaturalEarth1()
      .scale(130)
      .translate([this.width / 2, this.height / 2]);

    const path = d3.geoPath().projection(projection);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(this.data, d => d.value) || 100]);

    // Simplified world countries as GeoJSON
    const worldCountries = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "USA" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-125, 50], [-125, 25], [-65, 25], [-65, 50], [-125, 50]
            ]]
          }
        },
        {
          type: "Feature",
          properties: { name: "Canada" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-140, 70], [-140, 50], [-50, 50], [-50, 70], [-140, 70]
            ]]
          }
        },
        {
          type: "Feature",
          properties: { name: "Brazil" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-75, 5], [-75, -35], [-30, -35], [-30, 5], [-75, 5]
            ]]
          }
        },
        {
          type: "Feature",
          properties: { name: "Russia" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [20, 80], [20, 50], [180, 50], [180, 80], [20, 80]
            ]]
          }
        },
        {
          type: "Feature",
          properties: { name: "China" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [70, 50], [70, 20], [135, 20], [135, 50], [70, 50]
            ]]
          }
        },
        {
          type: "Feature",
          properties: { name: "Australia" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [110, -10], [110, -45], [155, -45], [155, -10], [110, -10]
            ]]
          }
        }
      ]
    };

    svg.selectAll('.country')
      .data(worldCountries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryData = this.data.find(item => item.country === d.properties.name);
        return countryData ? colorScale(countryData.value) : '#e0e0e0';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget).attr('fill', '#3f51b5');
      })
      .on('mouseout', (event, d: any) => {
        const countryData = this.data.find(item => item.country === d.properties.name);
        d3.select(event.currentTarget).attr('fill', countryData ? colorScale(countryData.value) : '#e0e0e0');
      });
  }
}