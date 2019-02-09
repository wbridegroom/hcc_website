import { Component, OnInit, Input } from '@angular/core';

import { PageContent } from '../../shared/models/page';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/event';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import 'fullcalendar';

@Component({
    selector: 'app-content-calendar',
    templateUrl: './content-calendar.component.html',
    styleUrls: ['./content-calendar.component.css'],
    providers: [NgbDatepickerConfig]
})
export class ContentCalendarComponent implements OnInit {

    @Input() pageContent: PageContent;

    options: any;
    header: any;
    events: any[];
    showEventDialog = false;
    showAddEvent = false;
    newEvent: any;
    selectedEvent: any;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private eventService: EventService,
                dateConfig: NgbDatepickerConfig) {

        dateConfig.firstDayOfWeek = 7;
    }

    ngOnInit() {

        this.loadEvents();
        this.header = {
            left: 'prev,next today',
            center: 'title',
            right: 'month, agendaWeek,agendaDay,listMonth'
        };
    }

    loadEvents() {
        this.eventService.getEvents().subscribe(events => {
            this.events = events;
            $('#calendar').fullCalendar({
                header: this.header,
                events: this.events,
                eventClick: (calEvent, jsEvent, view) => this.onClick(calEvent, jsEvent, view),
                eventRender: this.renderEvent
            });
        });
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

    onClick(calEvent, jsEvent, view) {
        this.selectedEvent = calEvent;
        this.showEventDialog = true;
    }

    addEvent() {
        this.newEvent = {
            title: null,
            startDate: null,
            startTime: { 'hour': 8, 'minute': 0 },
            endDate: null,
            endTime: null,
            description: null,
            location: null,
            allDay: false
        };
        this.showAddEvent = true;
    }

    cancelAddEvent() {
        this.showAddEvent = false;
        this.loadEvents();
    }

    createEvent() {
        this.showAddEvent = false;
        const date = this.newEvent.startDate;
        const time = this.newEvent.startTime;
        const event = {
            id: 0,
            title: this.newEvent.title,
            description: this.newEvent.description,
            location: this.newEvent.location,
            start: new Date(date.year, date.month - 1, date.day, time.hour, time.minute, 0, 0),
            end: null,
            allDay: false
        } as Event;
        this.eventService.addEvent(event).subscribe(() => this.loadEvents());
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deleteContent() {
        const id = this.pageContent.id;
        console.log(`Delete Page Content Id: ${id}`);
        this.pagesService.deletePageContent(id).subscribe(() => {
            this.pagesService.reloadPage();
        });
    }

}
