import { Component, OnInit } from '@angular/core';

import { TextContent} from '../shared/models/page-content';
import { PagesService } from '../pages/pages.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    main: TextContent;
    weeklySchedule: TextContent;
    contactInfo: TextContent;

    constructor(private authService: AuthService, private pagesService: PagesService) {}

    ngOnInit(): void {
        this.getMainText();
        this.getWeeklyScheduleText();
        this.getContactInformationText();
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    getMainText(): void {
        this.pagesService.getTextContent(1).subscribe((data: TextContent) => {
            this.main = data;
        });
    }

    getWeeklyScheduleText(): void {
        this.pagesService.getTextContent(2).subscribe((data: TextContent) => {
            this.weeklySchedule = data;
        });
    }

    getContactInformationText(): void {
        this.pagesService.getTextContent(3).subscribe((data: TextContent) => {
            this.contactInfo = data;
        });
    }
}

