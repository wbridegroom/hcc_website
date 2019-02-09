import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService} from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

import { MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { PagesService } from './pages.service';
import { EventService } from '../shared/services/event.service';
import { PageComponent } from './page/page.component';
import { ContentCalendarComponent } from './content-calendar/content-calendar.component';
import { ContentFilesComponent } from './content-files/content-files.component';
import { ContentTabsComponent } from './content-tabs/content-tabs.component';
import { ContentTextComponent } from './content-text/content-text.component';

import 'jquery';

@NgModule({
    declarations: [
        PageComponent,
        ContentCalendarComponent,
        ContentFilesComponent,
        ContentTabsComponent,
        ContentTextComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        FroalaEditorModule,
        FroalaViewModule,
        DialogModule,
        ConfirmDialogModule,
        InputTextModule,
        FileUploadModule,
        DropdownModule,
        ToastModule,
        NgbModule,
        NgxExtendedPdfViewerModule,
        PdfViewerModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule
    ],
    providers: [
        PagesService,
        EventService,
        ConfirmationService,
        MessageService
    ]
})
export class PagesModule { }
