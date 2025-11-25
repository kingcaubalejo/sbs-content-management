import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../models';

@Component({
  selector: 'app-menu-item',
  imports: [RouterModule, MatListModule, MatIconModule],
  template: `
  <a
      mat-list-item
      [routerLink]="item().route"
      #link="routerLinkActive"
      routerLinkActive="active"
      [routerLinkActiveOptions]="{exact: !item().subItems}"
      [activated]="link.isActive"
      style="margin-bottom: 5px;"
      (click)="toggleNested()"
    >
      <mat-icon matListItemIcon>{{ item().icon }}</mat-icon>
        <span matListItemTitle>{{ item().label }}</span>

      @if(item().subItems){
       <span matListItemMeta style="margin-top: 5px;">
       @if(nestedMenuOpen()) {
        <mat-icon>expand_less</mat-icon>
       } @else{
        <mat-icon>expand_more</mat-icon>
       }
       </span>
      }
    </a>

    @if(item().subItems && nestedMenuOpen()) {
      @for(subItem of item().subItems; track subItem.label){
        <a
      mat-list-item
      [routerLink]="item().route + '/' + subItem.route"
      #link="routerLinkActive"
      routerLinkActive
      [activated]="link.isActive"
      style="margin-bottom: 5px;"
      class="indented"
    >
      <mat-icon matListItemIcon>{{ subItem.icon }}</mat-icon>
      <span matListItemTitle>{{ subItem.label }}</span>
    </a>
      }
    }
`,
  styles: [
    `
      .indented {
        --mat-list-list-item-leading-icon-start-space: 48px;
      }
    `,
  ],
})
export class MenuItemComponent {
  item = input.required<MenuItem>();
  nestedMenuOpen = signal(false);

  toggleNested() {
    if (!this.item().subItems) return;

    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }
}
