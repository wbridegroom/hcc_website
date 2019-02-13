import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import { Page } from '../../shared/models/page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

    displayEditPageDialog = false;

    pageEdit: Page;

    constructor(private authService: AuthService,
                public pagesService: PagesService,
                private confirmService: ConfirmationService,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const pageId = params.get('id');
            this.pagesService.loadPage(pageId);
        });
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deletePage() {
        this.confirmService.confirm({
            message: 'Are you sure you want to delete this page?',
            key: 'pageDelete',
            accept: () => {
                this.pagesService.deletePage();
            }
        });
    }

    addContent(contentType) {
        this.pagesService.addPageContent(contentType);
    }

    editPage() {
        this.pageEdit = Object.assign({}, this.pagesService.page);
        this.displayEditPageDialog = true;
    }

    updatePage() {
        this.pagesService.updatePage(this.pageEdit);
        this.displayEditPageDialog = false;
    }

}
