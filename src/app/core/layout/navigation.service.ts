import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private sidenavOpen = new BehaviorSubject<boolean>(true);
    sidenavOpen$ = this.sidenavOpen.asObservable();

    toggleSidenav() {
        console.info(`INFO] toggleSidenav() ${!this.sidenavOpen.value}`);
        this.sidenavOpen.next(!this.sidenavOpen.value);
    }

    setSidenavState(isOpen: boolean) {
        console.info(`INFO] setSidenavState() ${isOpen}`);
        this.sidenavOpen.next(isOpen);
    }
}
