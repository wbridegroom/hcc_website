import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ModalModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';

import { MessageService} from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/primeng';

import { MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';

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
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
        SelectButtonModule,
        RadioButtonModule,
        ToastModule,
        NgbModule,
        PdfViewerModule,
        MatSelectModule,
        MatButtonModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CalendarModule
    ],
    providers: [
        PagesService,
        EventService,
        MessageService
    ],
    exports: [
        ContentTextComponent
    ]
})
export class PagesModule { }
