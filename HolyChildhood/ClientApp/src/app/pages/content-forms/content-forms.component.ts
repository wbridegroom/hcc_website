import { Component, OnInit, Input } from '@angular/core';
import {PageComponent} from '../page/page.component';
import {FormContent, PageContent} from '../../shared/models/page-content';
import {AuthService} from '../../shared/services/auth.service';
import {Child, FormFields} from '../../shared/models/form';
import {FormControl} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Page} from '../../shared/models/page';

@Component({
    selector: 'app-content-forms',
    templateUrl: './content-forms.component.html',
    styleUrls: ['./content-forms.component.css']
})
export class ContentFormsComponent implements OnInit {
    @Input() pageComponent: PageComponent;
    @Input() pageContent: PageContent;
    @Input() formContent: FormContent;

    formFields: FormFields  = {
        firstName: '',
        middleName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        homePhone: '',
        mobilePhone: '',
        emailAddress: '',
        hasChildren: null,
        talkToPastor: null,
        children: [] as Child[],
        bestTimeDay: '',
        interests: [] as string[],
        interestsOther: '',
        heardHow: '',
        heardHowOther: '',
        comments: ''
    } as FormFields;

    interests = new FormControl();
    interestOptions: string[] = [
        'Becoming a member',
        'School information',
        'PSR',
        'Mass Schedule',
        'Religious Education/Spiritual Opportunities',
        'Adult Organizations',
        'Youth Organizations',
        'Parish Ministries',
        'Parish Facilities',
        'Other'
    ];
    
    heardAboutOptions: string[] = [
        'Current parishioner',
        'Church Bulletin',
        'Visit or call from parish rep',
        'Internet',
        'Flyer',
        'Mailing',
        'Radio',
        'Other'
    ];
    
    formSent = false;

    constructor(private authService: AuthService, private http: HttpClient) {}

    ngOnInit(): void { }

    addChild() {
        this.formFields.children.push({
            firstName: '',
            middleName: '',
            lastName: '',
            birthday: '',
            school: '',
            grade: ''
        } as Child);
    }

    removeChildren() {
        this.formFields.children = [];
    }

    onSubmit() {
        const http_options = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        const url = '/api/form/inquire/';
        if (this.formFields.hasChildren === null) {
            this.formFields.hasChildren = false;
        }
        if (this.formFields.talkToPastor === null) {
            this.formFields.talkToPastor = false;
        }
        if (this.interests.value) {
            this.formFields.interests = this.interests.value;
        }
        this.http.post<Page>(url, this.formFields, http_options).subscribe(() => {
            this.formSent = true;
        });
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit() && (this.authService.isAdministrator() || this.authService.isEditor());
    }

}
