import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Page } from '../models/page';
import { Menu } from '../models/menu';

const options = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class NavService {

    public menuItems: Menu[];

    constructor(private http: HttpClient, private router: Router) { }

    public loadMenu() {
        const url = '/api/menu';
        this.http.get(url).subscribe((menuItems: Menu[]) => {
            this.menuItems = menuItems;
        });
    }

    public addMenu(menu: Menu) {
        const url = '/api/menu';
        this.http.post<Menu>(url, menu, options).subscribe(() => {
           this.loadMenu();
        });
    }

    public saveMenu(menu: Menu) {
        const url = `/api/menu/${menu.id}`;
        this.http.put<Menu>(url, menu, options).subscribe(() => {
            this.loadMenu();
        });
    }

    public deleteMenu(menu: Menu) {
        const url = `/api/menu/${menu.id}`;
        this.http.delete(url).subscribe(() => {
           this.loadMenu();
        });
    }

    public addPage(page: Page) {
        const url = '/api/page';
        this.http.post<Page>(url, page, options).subscribe(res => {
            this.loadMenu();
            this.router.navigate([`/pages/${res.id}`]).then();
        });
    }
}
