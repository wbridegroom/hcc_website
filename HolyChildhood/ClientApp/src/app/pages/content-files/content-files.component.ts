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
import {View} from 'fullcalendar/src/exports';

@Component({
  selector: 'app-content-files',
  templateUrl: './content-files.component.html',
  styleUrls: ['./content-files.component.css']
})
export class ContentFilesComponent implements OnInit {

    @Input() pageComponent: PageComponent;
    @Input() pageContentId: number;
    @Input() fileContent: FileContent;

    @ViewChild('uploadPdfDialog') uploadPdfDialog: ElementRef;
    @ViewChild('uploadBulletinDialog') uploadBulletinDialog: ElementRef;
    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    public currentPdf: String;
    pdfs: Pdf[];
    selectedPdf: Pdf;

    uploadFileLabel = 'Choose File...';
    uploadFiles: File[];
    uploadFileName: string;
    uploadCreationDate: Date;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private modalService: BsModalService,
                private http: HttpClient) { }

    ngOnInit() {
        this.loadPdfs();
    }

    loadPdfs() {
        const url = `/api/file/${this.fileContent.id}`;
        this.http.get<Pdf[]>(url).subscribe(pdfs => {
            this.pdfs = pdfs;
            if (pdfs.length > 0) {
                this.selectedPdf = this.pdfs[0];
                this.currentPdf = `/files/${this.selectedPdf.id}.pdf`;
            }
        });
    }

    loadBulletin() {
        this.currentPdf = `/files/${this.selectedPdf.id}.pdf`;
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
        if (this.fileContent.fileType === 'bulletin') {
            this.showDialog(this.uploadBulletinDialog);
        } else {
            this.showDialog(this.uploadPdfDialog);
        }
    }

    fileSelectionChanged(uploadFiles: File[]) {
        this.uploadFiles = uploadFiles;
        this.uploadFileLabel = uploadFiles[0].name;
    }

    uploadFile() {
        if (this.fileContent.fileType === 'bulletin') {
            const uploadDate = moment(this.uploadCreationDate);
            this.uploadFileName = uploadDate.format('MMMM D, YYYY');
        } else {
            this.uploadCreationDate = new Date();
        }

        const formData = new FormData();
        Array.from(this.uploadFiles).forEach(f => formData.append('files', f));
        formData.append('name', this.uploadFileName);
        formData.append('date', this.uploadCreationDate.toISOString());
        formData.append('fileContentId', this.fileContent.id.toString());
        this.http.post('/api/File', formData).subscribe(() => {
            this.loadPdfs();
        });
    }

    downloadFile() {
        window.open(`${this.currentPdf}`);
    }

    deleteFile() {
        this.confirmModel = {
            title: 'Delete PDF?',
            message: `Are you sure you want to delete the ${this.selectedPdf.title} PDF?`,
            onOk: () => {
                const url = `/api/File/${this.selectedPdf.id}`;
                this.http.delete(url).subscribe(() => {
                    this.loadPdfs();
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
