import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { HomeComponent } from './home/home.component';
import { UiModule } from './ui/ui.module';
import { AuthService } from './shared/services/auth.service';
import { AuthInterceptor } from './shared/services/auth.interceptor';
import { PagesModule } from './pages/pages.module';
import { SettingsComponent } from './settings/settings.component';
import { SettingsService } from './shared/services/settings.service';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from './shared/services/user.service';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { CardModule } from 'primeng/primeng';
import { ToastModule } from 'primeng/toast';
import { TooltipModule} from 'primeng/primeng';
import { ColorPickerModule } from 'primeng/primeng';

import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { ModalModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SettingsComponent,
        ProfileComponent
    ],
    imports: [
        AppRouting,
        BrowserModule,
        UiModule,
        PagesModule,
        FroalaEditorModule,
        FroalaViewModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        TableModule,
        InputTextModule,
        InputMaskModule,
        PasswordModule,
        DropdownModule,
        ButtonModule,
        SelectButtonModule,
        CheckboxModule,
        ColorPickerModule,
        ToastModule,
        TooltipModule,
        MatButtonModule,
        MatIconModule,
        ModalModule,
        TabsModule.forRoot(),
        PopoverModule.forRoot()
    ],
    providers: [
        SettingsService,
        UserService,
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
