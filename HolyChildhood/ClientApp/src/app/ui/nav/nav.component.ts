import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import {Page} from '../../shared/models/page';
import {NavService} from '../../shared/services/nav.service';
import {AuthService} from '../../shared/services/auth.service';
import {Menu} from '../../shared/models/menu';
import { Confirm } from '../../shared/models/confirm';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    @ViewChild('pageDialog') pageDialog: ElementRef;
    @ViewChild('menuDialog') menuDialog: ElementRef;
    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    editModeOn = false;
    page: Page = {} as Page;
    menu: Menu = {} as Menu;

    constructor(private authService: AuthService,
                private modalService: BsModalService,
                public navService: NavService) { }

    ngOnInit() {
        this.getMenu();
        this.editModeOn = this.isEdit();
    }

    getMenu() {
        this.navService.loadMenu();
    }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    hasPages(menu) {
        if (menu.pages.length > 0) {
            return true;
        }
    }

    logout() {
        this.authService.logout();
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    getFullName(): string {
        const auth = this.authService.getAuth();
        return auth.fullName;
    }

    showMenuDialog(menuItem) {
        this.menu = {} as Menu;
        if (menuItem) {
            this.menu = Object.assign({}, menuItem);
        }
        this.showDialog(this.menuDialog);
    }

    deleteMenu(menuItem) {
        this.confirmModel = {
            title: 'Delete Menu?',
            message: `Are you sure you want to delete the ${menuItem.name} menu?`,
            onOk: () => {
                this.navService.deleteMenu(menuItem);
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

    showPageDialog(menuItem) {
        this.page = {} as Page;
        if (menuItem) {
            this.page.menuItemId = menuItem.id;
            this.page.index = menuItem.pages.length;
        }
        this.showDialog(this.pageDialog);
    }

    addMenu(): void {
        if (this.menu.id) {
            for (let i = 0; i < this.menu.pages.length; i++) {
                this.menu.pages[i].index = i;
            }
            this.navService.saveMenu(this.menu);
        } else {
            this.navService.addMenu(this.menu);
        }
    }

    addPage(): void {
        this.navService.addPage(this.page);
    }

    isEdit() {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    toggleEditMode() {
        if (this.authService.isEdit()) {
            this.authService.setEdit(false);
        } else {
            this.authService.setEdit(true);
        }
    }

}
