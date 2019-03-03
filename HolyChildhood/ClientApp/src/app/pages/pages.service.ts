import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from '../shared/models/page';
import { PageContent, TextContent } from '../shared/models/page-content';
import { TextContentBackup} from '../shared/models/page-content';

const http_options = {
    headers: new HttpHeaders({
        'Content-Type':  'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class PagesService {
    constructor(private http: HttpClient) { }

    public addPage(page: Page) {
        const url = '/api/page';
        return this.http.post<Page>(url, page, http_options);
    }

    public getPage(id: number | string): Observable<Page> {
        const url = `/api/page/${id}`;
        return this.http.get<Page>(url);
    }

    public updatePage(page: Page) {
        const url = `/api/page/${page.id}`;
        return this.http.put(url, page, http_options);
    }

    public deletePage(id) {
        const url = `/api/page/${id}`;
        return this.http.delete<Page>(url);
    }

    public addPageContent(content) {
        const url = `/api/pagecontent`;
        return this.http.post(url, content, http_options);
    }

    public updatePageContent(pageContent: PageContent) {
        const url = `/api/pagecontent/${pageContent.id}`;
        return this.http.put(url, pageContent, http_options);
    }

    public getTextContent(id: number | string): Observable<TextContent> {
        const url = `/api/textContent/${id}`;
        return this.http.get<TextContent>(url, http_options);
    }

    public updateTextContent(textContent: TextContent) {
        const url = `/api/textContent/${textContent.id}`;
        return this.http.put(url, textContent, http_options);
    }

    public deletePageContent(id: number | string) {
        const url = `/api/pagecontent/${id}`;
        return this.http.delete(url);
    }

    public loadTextContentBackups(id: number | string): Observable<TextContentBackup[]> {
        const url = `/api/textcontentbackup/${id}`;
        return this.http.get<TextContentBackup[]>(url);
    }

    public restoreContent(id: number | string): Observable<TextContent> {
        const url = `/api/textcontentbackup/${id}`;
        return this.http.post<TextContent>(url, null, http_options);
    }

    public addTab(tab) {
        const url = '/api/tab';
        return this.http.post(url, tab, http_options);
    }

    public saveTab(tab) {
        const url = `/api/tab/${tab.id}`;
        return this.http.put(url, tab, http_options);
    }

    public deleteTab(tab) {
        const url = `/api/tab/${tab.id}`;
        return this.http.delete(url, http_options);
    }

}
