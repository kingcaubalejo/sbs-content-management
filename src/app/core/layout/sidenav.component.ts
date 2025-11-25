import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavigationService } from './navigation.service';
import { MenuItem } from '../../shared/models';
import { MenuItemComponent } from '../../shared/menu-item/menu-item.component';

@Component({
  selector: 'app-sidenav',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, MenuItemComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidenavComponent implements OnInit {
  isOpened = signal(true);

  constructor(private navService: NavigationService) {}

  ngOnInit() {
    this.navService.sidenavOpen$.subscribe(isOpen => {
      this.isOpened.set(isOpen);
    });
  }

  sidebarItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/',
    }, {
      icon: 'local_library',
      label: 'Library',
      route: '/library',
      subItems: [
        { icon: 'library_books', label: 'Volumes', route: '/volumes'},
        { icon: 'book', label: 'Books', route: '/books'},
        { icon: 'language', label: 'Languages', route: '/languages'},
      ]
    }, {
      icon: 'manage_accounts',
      label: 'User Management',
      route: '/user',
    }, {
      icon: 'edit_note',
      label: 'SBS Studio',
      route: '/editor',
    }
  ]
}