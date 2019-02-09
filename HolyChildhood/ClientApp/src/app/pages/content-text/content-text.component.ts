import { Component, Input, OnInit } from '@angular/core';

import { PageContent } from '../../shared/models/page';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { PageContentBackup } from '../../shared/models/page-content';

@Component({
  selector: 'app-content-text',
  templateUrl: './content-text.component.html',
  styleUrls: ['./content-text.component.css']
})
export class ContentTextComponent implements OnInit {

    @Input() pageContent: PageContent;

    backups: PageContentBackup[];
    selectedBackup: PageContentBackup;

    options: Object = {
        imageUploadURL: '/api/image',
        imageManagerDeleteMethod: 'DELETE',
        imageManagerDeleteURL: '/api/image',
        imageManagerLoadURL: '/api/image'
    };

    constructor(private authService: AuthService, private pagesService: PagesService) { }

    ngOnInit() {
        this.loadBackups();
    }

    loadBackups() {
        this.pagesService.loadPageContentBackups(this.pageContent.id).subscribe((backups: PageContentBackup[]) => {
            this.backups = backups;
        });
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    editContent() {
        this.pageContent.editing = true;
    }

    saveContent() {
        this.pageContent.editing = false;
        this.pagesService.updatePageContent(this.pageContent).subscribe(() => {
            this.loadBackups();
        });
    }

    cancelEdit() {
        this.pageContent.editing = false;
    }

    restoreContent() {
        this.pagesService.restoreContent(this.selectedBackup.id).subscribe((pageContent: PageContent) => {
            this.cancelEdit();
            this.pageContent = pageContent;
            this.loadBackups();
        });
    }

    deleteContent() {
        const id = this.pageContent.id;
        console.log(`Delete Page Content Id: ${id}`);
        this.pagesService.deletePageContent(id).subscribe(() => {
            this.pagesService.reloadPage();
        });
    }
}
