import { Component, ViewChild, OnInit } from '@angular/core';
import { HeaderComponent } from './../header.component';
import { SidenavComponent } from './../sidenav.component';
import { FooterComponent } from './../footer.component';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, HeaderComponent, SidenavComponent, FooterComponent, MatSidenavModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private navService: NavigationService) {}

  ngOnInit() {
    this.navService.sidenavOpen$.subscribe(isOpen => {
      if (this.sidenav) {
        if (isOpen) {
          this.sidenav.open();
        } else {
          this.sidenav.close();
        }
      }
    });
  }
}
