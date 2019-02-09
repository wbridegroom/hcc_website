import {Component, OnInit} from '@angular/core';

import { ConfirmationService } from 'primeng/api';

import {Page} from '../../shared/models/page';
import {NavService} from '../../shared/services/nav.service';
import {AuthService} from '../../shared/services/auth.service';
import {Menu} from '../../shared/models/menu';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    displayMenuDialog = false;
    displayPageDialog = false;
    page: Page = {} as Page;
    menu: Menu = {} as Menu;

    constructor(private authService: AuthService,
                private confirmService: ConfirmationService,
                public navService: NavService) { }

    ngOnInit() {
        this.getMenu();
    }

    getMenu() {
        this.navService.loadMenu();
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

    getUserName(): string {
        const auth = this.authService.getAuth();
        return auth.userName;
    }

    showMenuDialog(menuItem) {
        this.menu = {} as Menu;
        if (menuItem) {
            this.menu = Object.assign({}, menuItem);
        }
        this.displayMenuDialog = true;
    }

    deleteMenu(menuItem) {
        this.confirmService.confirm({
            message: `Are you sure you want to delete the ${menuItem.name} menu?`,
            accept: () => {
                this.navService.deleteMenu(menuItem);
            }
        });
    }

    showPageDialog(menuItem) {
        this.page = {} as Page;
        if (menuItem) {
            this.page.menuItemId = menuItem.id;
        }
        this.displayPageDialog = true;
    }

    addMenu(): void {
        this.displayMenuDialog = false;
        if (this.menu.id) {
            this.navService.saveMenu(this.menu);
        } else {
            this.navService.addMenu(this.menu);
        }
    }

    addPage(): void {
        this.displayPageDialog = false;
        this.navService.addPage(this.page);
    }

    isEdit() {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    getEditMenuItem() {
        if (this.authService.isEdit()) {
            return 'Turn off Editing';
        } else {
            return 'Turn on Editing';
        }
    }

    toggleEditMode() {
        if (this.authService.isEdit()) {
            this.authService.setEdit(false);
        } else {
            this.authService.setEdit(true);
        }
    }

}
