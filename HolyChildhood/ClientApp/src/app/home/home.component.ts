import { Component, OnInit } from '@angular/core';

import { TextContent} from '../shared/models/page-content';
import { PagesService } from '../pages/pages.service';
import { AuthService } from '../shared/services/auth.service';
import { EventService } from '../shared/services/event.service';
import { Event } from '../shared/models/calendar';

import * as moment from 'moment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    main: TextContent;
    weeklySchedule: TextContent;
    contactInfo: TextContent;
    upcomingEvents: Event[];

    constructor(private authService: AuthService, private pagesService: PagesService, private eventService: EventService) {}

    ngOnInit(): void {
        this.getMainText();
        this.getWeeklyScheduleText();
        this.getContactInformationText();
        this.getUpcomingEvents();
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

    getUpcomingEvents(): void {
        this.eventService.getUpcomingEvents(8).subscribe(events => {
            this.upcomingEvents = events;
        });
    }

    getDate(dateStr) {
        const date = moment(dateStr);
        return date.format('MMMM Do YYYY');
    }

    getTime(dateStr) {
        const date = moment(dateStr);
        return date.format('hh:mm a');
    }
}

