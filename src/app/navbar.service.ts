import {Injectable, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';

@Injectable()
export class NavbarService {
    visible: boolean;
    isSlide: boolean;
    sidenav: MatSidenav;
    viewType: boolean;


    public setSidenav(sidenav: MatSidenav) {
        this.sidenav = sidenav;
        this.visible = true;
        this.viewType = false;
    }
    constructor() {
        this.visible = false;
        this.isSlide = true;
    }

    public sidenavToggle(): void {
        if (this.sidenav) {
        this.sidenav.toggle();
        }
    }
    public show(): void {
        this.visible = true;
    }
    public hide(): void {
        this.visible = false;
    }
    public changeView(type: number): void {
        if (type === 4) {
            this.viewType = true;
        } else {
            this.viewType = false;
        }
    }
}
