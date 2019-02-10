import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Page, PageContent } from '../shared/models/page';
import { NavService } from '../shared/services/nav.service';
import {PageContentBackup} from '../shared/models/page-content';

const http_options = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PagesService {
    public page: Page;

    constructor(private http: HttpClient, private router: Router, private nav: NavService) { }

    public loadPage(id) {
        this.getPage(id).subscribe(page => this.page = page);
    }

    public reloadPage() {
        this.loadPage(this.page.id);
    }

    public getPage(id: number | string): Observable<Page> {
        const url = `/api/page/${id}`;
        return this.http.get<Page>(url);
    }

    public updatePage(page: Page) {
        const url = `/api/page`;
        this.http.put(url, page, http_options).subscribe(() => {
            this.nav.loadMenu();
            this.loadPage(page.id);
        });
    }

    public deletePage() {
        const url = `/api/page/${this.page.id}`;
        this.http.delete<Page>(url).subscribe(() => {
            this.nav.loadMenu();
            this.router.navigate(['/home']).then();
        });
    }

    public addPageContent(contentType) {
        const url = `/api/pagecontent`;
        const newContent = { contentType: contentType, page: this.page} as PageContent;
        this.http.post(url, newContent, http_options).subscribe(() => {
            this.reloadPage();
        });
    }

    public updatePageContent(pageContent: PageContent) {
        const url = `/api/pagecontent/${pageContent.id}`;
        return this.http.put(url, pageContent, http_options);
    }

    public deletePageContent(id: number | string) {
        const url = `/api/pagecontent/${id}`;
        return this.http.delete(url);
    }

    public loadPageContentBackups(id: number | string): Observable<PageContentBackup[]> {
        const url = `/api/pagecontentbackup/${id}`;
        return this.http.get<PageContentBackup[]>(url);
    }

    public restoreContent(id: number | string): Observable<PageContent> {
        const url = `/api/pagecontentbackup/${id}`;
        return this.http.post<PageContent>(url, null, http_options);
    }
}
