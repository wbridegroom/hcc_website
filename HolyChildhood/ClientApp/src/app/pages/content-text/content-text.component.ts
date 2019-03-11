import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { TextContent} from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { TextContentBackup } from '../../shared/models/page-content';
import {PageComponent} from '../page/page.component';
import {Confirm} from '../../shared/models/confirm';

@Component({
  selector: 'app-content-text',
  templateUrl: './content-text.component.html',
  styleUrls: ['./content-text.component.css']
})
export class ContentTextComponent implements OnInit {

    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    @Input() pageComponent: PageComponent;
    @Input() textContent: TextContent;
    @Input() pageContentId: number;

    editing: boolean;
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

    constructor(private authService: AuthService, private pagesService: PagesService, private modalService: BsModalService) { }

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

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
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

    deleteContent() {
        this.confirmModel = {
            title: 'Delete Content?',
            message: `Are you sure you want to delete this content? It cannot be undone.`,
            onOk: () => {
                this.pagesService.deletePageContent(this.pageContentId).subscribe(() => {
                    this.pageComponent.loadPage();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }
}
