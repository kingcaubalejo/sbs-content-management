import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { NavigationService } from './navigation.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderComponent {
  isDarkTheme = signal(false);
  notificationCount = signal(3);
  currentUser = signal({ name: 'Admin User', email: 'admin@sbs.com' });

  constructor(private navService: NavigationService) {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('sbs-theme');
    if (savedTheme === 'dark') {
      this.isDarkTheme.set(true);
      document.body.classList.add('dark-theme');
    }
  }

  onHamburgerClick() {
    this.navService.toggleSidenav();
  }

  toggleTheme() {
    const newTheme = !this.isDarkTheme();
    this.isDarkTheme.set(newTheme);
    document.body.classList.toggle('dark-theme', newTheme);
    localStorage.setItem('sbs-theme', newTheme ? 'dark' : 'light');
  }

  onNotificationClick() {
    console.log('Notifications clicked');
    // Reset notification count when clicked
    this.notificationCount.set(0);
  }

  onProfileClick() {
    console.log('Profile clicked');
  }

  onLogout() {
    console.log('Logout clicked');
    // Add logout logic here
  }

  onSettings() {
    console.log('Settings clicked');
  }
}
