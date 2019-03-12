import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { SelectItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { Page } from '../../shared/models/page';
import { Confirm } from '../../shared/models/confirm';
import { CalendarContent, FileContent, PageContent, TabContent, TextContent } from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { NavService } from '../../shared/services/nav.service';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    @ViewChild('editPageDialog') editPageDialog: ElementRef;
    @ViewChild('pdfTypeDialog') pdfTypeDialog: ElementRef;
    @ViewChild('addSubPageDialog') addSubPageDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    pageId: string | number;
    page: Page;
    content: PageContent;

    pageEdit = {} as Page;
    pageAdd = {} as Page;

    pdfTypes: SelectItem[] = [
        {label: 'Select PDF Type', value: null},
        {label: 'Bulletin', value: 'bulletin'},
        {label: 'Other', value: 'other'}
    ];

    constructor(private authService: AuthService,
                public pagesService: PagesService,
                private route: ActivatedRoute,
                private router: Router,
                private nav: NavService,
                private modalService: BsModalService) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.pageId = params.get('id');
            this.loadPage();
        });
    }

    loadPage() {
        this.pagesService.getPage(this.pageId).subscribe(page => this.page = page);
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    deletePage() {
        this.confirmModel = {
            title: 'Delete Page?',
            message: 'Are you sure you want to delete this page?',
            onOk: () => {
                this.pagesService.deletePage(this.pageId).subscribe(() => {
                    this.nav.loadMenu();
                    if (this.page.parent) {
                        this.router.navigate([`/pages/${this.page.parent.id}`]).then();
                    } else {
                        this.router.navigate(['/home']).then();
                    }
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

    createContent(contentType) {
        this.content = {} as PageContent;
        this.content.contentType = contentType;
        this.content.page = this.page;
        if (contentType === 'Text') {
            this.content.textContent = {} as TextContent;
            this.addContent();
        } else if (contentType === 'Tabs') {
            this.content.tabContent = {} as TabContent;
            this.addContent();
        } else if (contentType === 'Files') {
            this.content.fileContent = {} as FileContent;
            this.showDialog(this.pdfTypeDialog);
        } else if (contentType === 'Calendar') {
            // @TODO Replace calendarId with specified id
            this.content.calendarContent = { calendarId: 1 } as CalendarContent;
            this.addContent();
        }
    }

    addContent() {
        this.pagesService.addPageContent(this.content).subscribe(() => {
            this.loadPage();
        });
    }

    deleteContent(id) {
        this.confirmModel = {
            title: 'Delete Content?',
            message: `Are you sure you want to delete this content? It cannot be undone.`,
            onOk: () => {
                this.pagesService.deletePageContent(id).subscribe(() => {
                    this.loadPage();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

    moveContentUp(id) {
        this.pagesService.moveContentUp(id).subscribe(() => {
            this.loadPage();
        });
    }

    moveContentDown(id) {
        this.pagesService.moveContentDown(id).subscribe(() => {
            this.loadPage();
        });
    }

    editPage() {
        this.pageEdit = Object.assign({}, this.page);
        this.showDialog(this.editPageDialog);
    }

    updatePage() {
        this.pagesService.updatePage(this.pageEdit).subscribe(() => {
            this.nav.loadMenu();
            this.loadPage();
        });
    }

    isSubPage(): boolean {
        return this.page.parent != null;
    }

    showAddSubPageDialog() {
        this.pageAdd = {} as Page;
        this.pageAdd.parent = this.page;
        this.showDialog(this.addSubPageDialog);
    }

    addSubPage() {
        this.pagesService.addPage(this.pageAdd).subscribe(res => {
            this.nav.loadMenu();
            this.router.navigate([`/pages/${res.id}`]).then();
        });
    }

}
