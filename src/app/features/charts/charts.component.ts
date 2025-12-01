import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { BarChartComponent } from './components/bar-chart.component';
import { LineChartComponent } from './components/line-chart.component';
import { PieChartComponent } from './components/pie-chart.component';
import { MapChartComponent } from './components/map-chart.component';
import { NetworkGraphComponent } from './components/network-graph.component';
import { ForceDirectedGraphComponent } from './components/force-directed-graph.component';
import { OrgChartComponent } from './components/org-chart.component';
import { PhilippinesMapComponent } from './components/philippines-map.component';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    MapChartComponent,
    NetworkGraphComponent,
    ForceDirectedGraphComponent,
    OrgChartComponent,
    PhilippinesMapComponent
  ],
  template: `
    <div class="charts-container">
      <h1>Analytics Dashboard</h1>
      
      <mat-tab-group>
        <mat-tab label="Bar Chart">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Monthly Sales</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-bar-chart [data]="barChartData"></app-bar-chart>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Line Chart">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Growth Trend</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-line-chart [data]="lineChartData"></app-line-chart>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Pie Chart">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Market Share</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-pie-chart [data]="pieChartData"></app-pie-chart>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Geographic Map">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Global Distribution</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-map-chart [data]="mapChartData"></app-map-chart>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Network Graph">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Network Relationships</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-network-graph [nodes]="networkNodes" [links]="networkLinks"></app-network-graph>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Force-Directed Graph">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Advanced Force Simulation</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-force-directed-graph></app-force-directed-graph>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Organization Chart">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Company Hierarchy</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-org-chart></app-org-chart>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        
        <mat-tab label="Philippines Map">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Philippines Regional Data</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-philippines-map [data]="philippinesData"></app-philippines-map>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .charts-container {
      padding: 20px;
    }
    
    mat-card {
      margin: 20px 0;
    }
  `]
})
export class ChartsComponent {
  barChartData = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 45 },
    { label: 'Mar', value: 35 },
    { label: 'Apr', value: 50 },
    { label: 'May', value: 40 }
  ];

  lineChartData = [
    { date: new Date('2024-01-01'), value: 100 },
    { date: new Date('2024-02-01'), value: 120 },
    { date: new Date('2024-03-01'), value: 110 },
    { date: new Date('2024-04-01'), value: 140 },
    { date: new Date('2024-05-01'), value: 130 }
  ];

  pieChartData = [
    { label: 'Desktop', value: 45 },
    { label: 'Mobile', value: 35 },
    { label: 'Tablet', value: 20 }
  ];

  mapChartData = [
    { country: 'USA', value: 85 },
    { country: 'Canada', value: 65 },
    { country: 'Brazil', value: 45 },
    { country: 'Russia', value: 70 },
    { country: 'China', value: 90 },
    { country: 'Australia', value: 55 }
  ];

  networkNodes = [
    { id: 'User', group: 1 },
    { id: 'Admin', group: 1 },
    { id: 'Database', group: 2 },
    { id: 'API', group: 2 },
    { id: 'Frontend', group: 3 },
    { id: 'Backend', group: 3 },
    { id: 'Cache', group: 4 }
  ];

  networkLinks = [
    { source: 'User', target: 'Frontend', value: 3 },
    { source: 'Admin', target: 'Frontend', value: 2 },
    { source: 'Frontend', target: 'API', value: 4 },
    { source: 'API', target: 'Backend', value: 3 },
    { source: 'Backend', target: 'Database', value: 5 },
    { source: 'Backend', target: 'Cache', value: 2 },
    { source: 'API', target: 'Cache', value: 1 }
  ];

  philippinesData = [
    { province: 'Metro Manila', value: 95 },
    { province: 'Cebu', value: 85 },
    { province: 'Davao', value: 75 },
    { province: 'Iloilo', value: 65 },
    { province: 'Baguio', value: 70 }
  ];
}