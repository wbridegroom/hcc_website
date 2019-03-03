import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { FileContent } from '../../shared/models/page-content';
import { Pdf } from '../../shared/models/file';
import { Confirm } from '../../shared/models/confirm';
import { AuthService } from '../../shared/services/auth.service';
import { PagesService } from '../pages.service';
import { PageComponent } from '../page/page.component';

import * as moment from 'moment';

@Component({
  selector: 'app-content-files',
  templateUrl: './content-files.component.html',
  styleUrls: ['./content-files.component.css']
})
export class ContentFilesComponent implements OnInit {

    @Input() pageComponent: PageComponent;
    @Input() pageContentId: number;
    @Input() fileContent: FileContent;

    @ViewChild('uploadDialog') uploadDialog: ElementRef;
    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    public currentPdf: String;
    bulletins: Pdf[];
    selectedBulletin: Pdf;

    uploadFileLabel = 'Choose File...';
    uploadFiles: File[];
    uploadFileName: string;
    uploadCreationDate: Date;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private modalService: BsModalService,
                private http: HttpClient) { }

    ngOnInit() {
        this.loadBulletins();
    }

    loadBulletins() {
        this.http.get<Pdf[]>('/api/file').subscribe(bulletins => {
            this.bulletins = bulletins;
            if (bulletins.length > 0) {
                this.bulletins[0].title = 'Current Week';
                this.selectedBulletin = this.bulletins[0];
                this.currentPdf = `/files/${this.selectedBulletin.id}.pdf`;
            }
        });
    }

    loadBulletin() {
        this.currentPdf = `/files/${this.selectedBulletin.id}.pdf`;
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

    showUploadFileDialog() {
        this.uploadFileName = '';
        this.uploadCreationDate = null;
        this.uploadFileLabel = 'Choose file...';
        this.showDialog(this.uploadDialog);
    }

    fileSelectionChanged(uploadFiles: File[]) {
        this.uploadFiles = uploadFiles;
        this.uploadFileLabel = uploadFiles[0].name;
    }

    uploadFile() {
        const uploadDate = moment(this.uploadCreationDate);
        this.uploadFileName = uploadDate.format('MMMM D, YYYY');

        const formData = new FormData();
        Array.from(this.uploadFiles).forEach(f => formData.append('files', f));
        formData.append('name', this.uploadFileName);
        formData.append('date', this.uploadCreationDate.toLocaleDateString());
        formData.append('fileContentId', this.fileContent.id.toString());
        this.http.post('/api/File', formData).subscribe(() => {
            this.loadBulletins();
        });
    }

    downloadFile() {
        window.open(`${this.currentPdf}`);
    }

    deleteFile() {
        this.confirmModel = {
            title: 'Delete PDF?',
            message: `Are you sure you want to delete the ${this.selectedBulletin.title} PDF?`,
            onOk: () => {
                const url = `/api/File/${this.selectedBulletin.id}`;
                this.http.delete(url).subscribe(() => {
                    this.loadBulletins();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

    deleteContent() {
        this.confirmModel = {
            title: 'Delete File Content?',
            message: `Are you sure you want to delete this file content? It cannot be undone.`,
            onOk: () => {
                this.pagesService.deletePageContent(this.pageContentId).subscribe(() => {
                    this.pageComponent.loadPage();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

}
