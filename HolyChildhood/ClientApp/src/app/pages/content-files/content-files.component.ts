import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PageContent} from '../../shared/models/page-content';
import {AuthService} from '../../shared/services/auth.service';
import {PagesService} from '../pages.service';
import {File} from '../../shared/models/file';

@Component({
  selector: 'app-content-files',
  templateUrl: './content-files.component.html',
  styleUrls: ['./content-files.component.css']
})
export class ContentFilesComponent implements OnInit {

    @Input() pageContent: PageContent;
    public currentPdf: String;
    bulletins: File[];
    selectedBulletin: File;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private http: HttpClient) { }

    ngOnInit() {
        if (this.isEditOn()) {
            this.loadBulletins();
        }
    }

    loadBulletins() {
        this.http.get<File[]>('/api/file').subscribe(bulletins => {
            this.bulletins = bulletins;
            this.bulletins[0].title = 'Current Week';
            this.selectedBulletin = this.bulletins[0];
            this.currentPdf = `/files/${this.selectedBulletin.id}.pdf`;
        });
    }

    loadBulletin() {
        this.currentPdf = `http://localhost:57084/files/${this.selectedBulletin.id}.pdf`;
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deleteContent() {
        const id = this.pageContent.id;
        this.pagesService.deletePageContent(id).subscribe(() => {
            this.pagesService.reloadPage();
        });
    }

}
