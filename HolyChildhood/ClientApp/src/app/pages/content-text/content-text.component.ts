import { Component, Input, OnInit } from '@angular/core';

import {PageContent, TextContent} from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { TextContentBackup } from '../../shared/models/page-content';

@Component({
  selector: 'app-content-text',
  templateUrl: './content-text.component.html',
  styleUrls: ['./content-text.component.css']
})
export class ContentTextComponent implements OnInit {

    @Input() pageContent: PageContent;

    backups: TextContentBackup[];
    selectedBackup: TextContentBackup;

    options: Object = {
        imageUploadURL: '/api/image',
        imageManagerDeleteMethod: 'DELETE',
        imageManagerDeleteURL: '/api/image',
        imageManagerLoadURL: '/api/image',
        placeholderText: 'Enter text here...',
        tabSpaces: 4,
        theme: 'gray'
    };

    constructor(private authService: AuthService, private pagesService: PagesService) { }

    ngOnInit() {
        this.loadBackups();
    }

    loadBackups() {
        this.pagesService.loadTextContentBackups(this.pageContent.textContent.id).subscribe((backups: TextContentBackup[]) => {
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
        this.pagesService.updateTextContent(this.pageContent.textContent).subscribe(() => {
            this.loadBackups();
        });
    }

    cancelEdit() {
        this.pageContent.editing = false;
    }

    restoreContent() {
        this.pagesService.restoreContent(this.selectedBackup.id).subscribe((textContent: TextContent) => {
            this.cancelEdit();
            this.pageContent.textContent = textContent;
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
