import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Stone {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  clicked?: boolean;
}

@Component({
  selector: 'app-page-not-found',
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})

export class PageNotFoundComponent {
  stones: Stone[] = Array(12).fill(0).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 20,
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
    clicked: false
  }));



  onStoneClick(stone: Stone) {
    stone.clicked = true;
    setTimeout(() => stone.clicked = false, 600);
  }
}
