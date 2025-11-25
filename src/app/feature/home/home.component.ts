import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  fabOpen = false;
  
  dashboardStats = [
    { title: 'Volumes', count: 4, icon: 'library_books', color: '#8b4513' },
    { title: 'Books', count: 250, icon: 'book', color: '#6b3410' },
    { title: 'Languages', count: 2, icon: 'language', color: '#d2b48c' },
    { title: 'Users', count: 0, icon: 'people', color: '#3c2415' },
    { title: 'App Installations', count: 100, icon: 'get_app', color: '#c8a882' },
    { title: 'Countries Supported', count: 2, icon: 'public', color: '#a0522d' }
  ];

  monthlyData = [120, 190, 300, 500, 200, 300, 450, 380, 420, 350, 280, 320];
  languageData = [35, 25, 20, 15, 5];
  languageLabels = ['English', 'Spanish', 'French', 'German', 'Others'];
  lineData = [150, 180, 220, 280, 320, 380, 420, 450, 480, 520, 580, 620];
  worldRegions = [
    { name: 'Europe', users: 3200, color: '#6b3410' },
    { name: 'Asia', users: 6800, color: '#d2b48c' },
  ];

  toggleFab() {
    this.fabOpen = !this.fabOpen;
  }
}
