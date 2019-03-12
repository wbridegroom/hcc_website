import { Component, Input, OnInit } from '@angular/core';

import {PageContent, TextContent} from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { TextContentBackup } from '../../shared/models/page-content';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-content-text',
  templateUrl: './content-text.component.html',
  styleUrls: ['./content-text.component.css']
})
export class ContentTextComponent implements OnInit {

    @Input() pageComponent: PageComponent;
    @Input() pageContent: PageContent;
    @Input() textContent: TextContent;

    editing: boolean;
    backups: TextContentBackup[];
    selectedBackup: TextContentBackup;

    options: Object = {
        imageUploadURL: '/api/image',
        imageManagerDeleteMethod: 'DELETE',
        imageManagerDeleteURL: '/api/image',
        imageManagerLoadURL: '/api/image',
        fileUploadURL: '/api/embeddedFile',
        placeholderText: 'Enter text here...',
        tabSpaces: 4,
        theme: 'gray'
    };

    constructor(private authService: AuthService, private pagesService: PagesService) { }

    ngOnInit() {
        if (this.textContent) {
            this.loadBackups();
        }
    }

    loadBackups() {
        this.pagesService.loadTextContentBackups(this.textContent.id).subscribe((backups: TextContentBackup[]) => {
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
        this.editing = true;
    }

    saveContent() {
        this.editing = false;
        this.pagesService.updateTextContent(this.textContent).subscribe(() => {
            this.loadBackups();
        });
    }

    cancelEdit() {
        this.editing = false;
    }

    restoreContent() {
        this.pagesService.restoreContent(this.selectedBackup.id).subscribe((textContent: TextContent) => {
            this.cancelEdit();
            this.textContent = textContent;
            this.loadBackups();
        });
    }
}
