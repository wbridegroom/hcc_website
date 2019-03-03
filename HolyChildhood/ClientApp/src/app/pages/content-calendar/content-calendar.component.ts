import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import {SelectItem} from 'primeng/api';

import { CalendarContent } from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/calendar';
import { PageComponent } from '../page/page.component';

import 'fullcalendar';

@Component({
    selector: 'app-content-calendar',
    templateUrl: './content-calendar.component.html',
    styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit {

    @Input() pageComponent: PageComponent;
    @Input() pageContentId: number;
    @Input() calendarContent: CalendarContent;

    @ViewChild('addEventDialog') addEventDialog: ElementRef;
    modalRef: BsModalRef;

    newEvent: any;

    calendar: any;

    recurrenceTypes: SelectItem[];

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private eventService: EventService,
                private modalService: BsModalService,
                private http: HttpClient) {

        this.recurrenceTypes = [
            { label: 'Annually', value: 'annually' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Weekly', value: 'weekly' }
        ];
    }

    ngOnInit() {
        $('#calendar').fullCalendar({
            themeSystem: 'bootstrap4',
            events: (start, end, timezone, callback) => this.getEvents(start, end, callback),
            eventRender: (event, element) => this.renderEvent(event, element)
        });
    }

    getEvents(start, end, success) {
        this.http.get(`/api/event/${start.toISOString()}/${end.toISOString()}`).subscribe(events => {
            success(events);
        });
    }

    showDialog(dialog) {
        this.modalRef = this.modalService.show(dialog);
    }

    renderEvent(event, element) {
        element.popover({
            title: event.title,
            content: event.description + '<br>' + event.location,
            trigger: 'hover',
            placement: 'top',
            container: 'body',
            html: true
        });
    }
    //
    // onClick(calEvent, jsEvent, view) {
    //     this.selectedEvent = calEvent;
    //     this.showEventDialog = true;
    // }

    addEvent() {
        const startTime = new Date();
        startTime.setHours(8);
        startTime.setMinutes(0);
        this.newEvent = {
            title: null,
            startDate: null,
            startTime: startTime,
            endDate: null,
            endTime: null,
            description: null,
            location: null,
            allDay: false,
            isRecurring: false,
            recurrenceType: 'annually'
        };
        this.showDialog(this.addEventDialog);
    }

    createEvent() {
        const date = this.newEvent.startDate;
        const time = this.newEvent.startTime;
        const event = {
            calendarId: 1,
            title: this.newEvent.title,
            description: this.newEvent.description,
            location: this.newEvent.location,
            startYear: date.getFullYear(),
            startMonth: date.getMonth() + 1,
            startDay: date.getDate(),
            startHour: time.getHours(),
            startMinute: time.getMinutes(),
            end: null,
            allDay: this.newEvent.allDay,
            isRecurring: this.newEvent.isRecurring,
            eventTypeId: 1
        } as Event;
        this.eventService.addEvent(event).subscribe(() => this.calendar.refetchEvents());
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

}
