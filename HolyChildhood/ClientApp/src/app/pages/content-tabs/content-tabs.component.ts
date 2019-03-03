import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { Confirm } from '../../shared/models/confirm';
import { Tab, TabContent, TextContent } from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { PageComponent } from '../page/page.component';

@Component({
  selector: 'app-content-tabs',
  templateUrl: './content-tabs.component.html',
  styleUrls: ['./content-tabs.component.css']
})
export class ContentTabsComponent {

    @Input() pageComponent: PageComponent;
    @Input() pageContentId: number;
    @Input() tabContent: TabContent;

    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    @ViewChild('tabDialog') tabDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    tab = {} as Tab;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private modalService: BsModalService) { }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deleteContent() {
        const id = this.pageContentId;
        this.pagesService.deletePageContent(id).subscribe(() => {
            this.pageComponent.loadPage();
        });
    }

    beforeTabChange($event: NgbTabChangeEvent) {
        if ($event.nextId === 'addTab') {
            this.showTabDialog(null);
            $event.preventDefault();
        }
    }

    showTabDialog(tab) {
        this.tab = {} as Tab;
        if (tab) {
            this.tab = Object.assign({}, tab);
        }
        this.showDialog(this.tabDialog);
    }

    updateTab() {
        if (this.tab.id) {
            this.pagesService.saveTab(this.tab).subscribe(() => {
                this.pageComponent.loadPage();
            });
        } else {
            this.tab.tabContentId = this.tabContent.id;
            this.tab.textContent = {} as TextContent;
            this.pagesService.addTab(this.tab).subscribe(() => {
                this.pageComponent.loadPage();
            });
        }
    }

    deleteTab(tab) {
        this.confirmModel = {
            title: 'Delete Tab?',
            message: `Are you sure you want to delete the ${tab.title} tab`,
            onOk: () => {
                this.pagesService.deleteTab(tab).subscribe(() => {
                    this.pageComponent.loadPage();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

}
