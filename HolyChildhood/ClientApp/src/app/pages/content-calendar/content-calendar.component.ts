import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { SelectItem } from 'primeng/api';

import { CalendarContent } from '../../shared/models/page-content';
import { PagesService } from '../pages.service';
import { AuthService } from '../../shared/services/auth.service';
import { EventService } from '../../shared/services/event.service';
import { Event } from '../../shared/models/calendar';
import { PageComponent } from '../page/page.component';

import 'fullcalendar';
import * as moment from 'moment';
import {Confirm} from '../../shared/models/confirm';

@Component({
    selector: 'app-content-calendar',
    templateUrl: './content-calendar.component.html',
    styleUrls: ['./content-calendar.component.css']
})
export class ContentCalendarComponent implements OnInit {

    @Input() pageComponent: PageComponent;
    @Input() pageContentId: number;
    @Input() calendarContent: CalendarContent;

    @ViewChild('confirmationDialog') confirmDialog: ElementRef;
    @ViewChild('addEventDialog') addEventDialog: ElementRef;
    modalRef: BsModalRef;
    confirmModel: Confirm;

    event: Event;

    calendar: any;

    eventTypes: SelectItem[];
    recurrenceTypes: SelectItem[];
    monthlyWeeks: SelectItem[];
    daysOfTheWeek: SelectItem[];

    defaultDate: Date;

    constructor(private authService: AuthService,
                private pagesService: PagesService,
                private eventService: EventService,
                private modalService: BsModalService,
                private http: HttpClient) {

        this.defaultDate = new Date();
        this.defaultDate.setHours(8);
        this.defaultDate.setMinutes(0);

        this.eventTypes = [
            { label: 'Standard', value: 1 },
            { label: 'Meeting', value: 2 },
            { label: 'Mass', value: 3 },
            { label: 'Holiday', value: 4}
        ];

        this.recurrenceTypes = [
            { label: 'Annually', value: 'annually' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Weekly', value: 'weekly' }
        ];
        this.monthlyWeeks = [
            { label: 'First', value: '1' },
            { label: 'Second', value: '2' },
            { label: 'Third', value: '3' },
            { label: 'Fourth', value: '4' },
            { label: 'Last', value: '5' }
        ];
        this.daysOfTheWeek = [
            { label: 'Sunday', value: 'sunday' },
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' }
        ];
    }

    ngOnInit() {
        $('#calendar').fullCalendar({
            themeSystem: 'bootstrap4',
            events: (start, end, timezone, callback) => this.getEvents(start, end, callback),
            eventRender: (event, element) => this.renderEvent(event, element),
            eventClick: (event) => this.onClick(event)
        });
    }

    updateDefault() {
        if (this.event) {
            this.defaultDate.setHours(this.event.startTime.getHours());
            this.defaultDate.setMinutes(this.event.startTime.getMinutes());
        }
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
            content: this.getTooltip(event),
            trigger: 'hover',
            placement: 'top',
            container: 'body',
            html: true
        });
    }

    getTooltip(event) {
        let tooltip = '<p style="width: 400px">';
        tooltip += '<b>Date:</b> ' + event.start.format('MMMM Do YYYY');
        if (!event.allDay) {
            tooltip += '<br />';
            tooltip += '<b>Time: </b> ' + event.start.format('h:mm a');
            if (event.end != null) {
                tooltip += ' - ' + event.end.format('h:mm a');
            }
        }
        if (event.location) {
            tooltip += '<br />';
            tooltip += '<b>Location: </b> ' + event.location;
        }
        if (event.description) {
            tooltip += '<br />';
            tooltip += '<b>Description:</b><br />';
            tooltip += event.description;
        }
        if (this.isAuthenticated()) {
            tooltip += '<br /><br /><i style="color:darkred">(Click on event to edit)</i>';
        }
        tooltip += '</p>';
        return tooltip;
    }

    onClick(calEvent) {
        if (this.isAuthenticated()) {
            this.editEvent(calEvent);
        }
    }

    editEvent(calEvent) {
        const startDate = new Date(
            calEvent.start.year(),
            calEvent.start.month(),
            calEvent.start.date(),
            calEvent.start.hours(),
            calEvent.start.minutes(),
            0
        );
        let endDate = null;
        if (calEvent.end != null) {
            endDate = new Date(
                calEvent.end.year(),
                calEvent.end.month(),
                calEvent.end.date(),
                calEvent.end.hours(),
                calEvent.end.minutes(),
                0
            );
        }

        this.event = {
            id: calEvent.id,
            eventTypeId: calEvent.eventTypeId,
            title: calEvent.title,
            start: startDate,
            startTime: startDate,
            endTime: endDate,
            description: calEvent.description,
            location: calEvent.location,
            allDay: calEvent.allDay,
            isRecurring: calEvent.isRecurring,
            recurrenceId: calEvent.recurrenceId,
            updateRecurrence: false,
            isEditing: true
        } as Event;

        this.showDialog(this.addEventDialog);
    }

    addEvent() {
        const startTime = new Date();
        startTime.setHours(8);
        startTime.setMinutes(0);
        this.event = {
            title: null,
            start: null,
            startTime: startTime,
            end: null,
            endTime: null,
            description: null,
            location: null,
            allDay: false,
            isRecurring: false,
            recurrenceType: 'annually',
            recurrenceMonthlyType: 'date',
            recurrenceMonthlyWeek: 1,
            eventTypeId: 1
        } as Event;
        this.showDialog(this.addEventDialog);
    }

    getDayoftheMonth(jsDate) {
        if (jsDate) {
            const date = moment(jsDate);
            return date.format('Do');
        }
        return '';
    }

    getDayoftheWeek(jsDate) {
        if (jsDate) {
            const date = moment(jsDate);
            return date.format('dddd');
        }
        return '';
    }

    saveEvent() {
        const date = this.event.start;
        const time = this.event.startTime;
        this.event.startYear = date.getFullYear();
        this.event.startMonth = date.getMonth() + 1;
        this.event.startDay = date.getDate();
        this.event.startHour = time.getHours();
        this.event.startMinute = time.getMinutes();
        if (this.event.endTime != null) {
            this.event.hasEndTime = true;
            this.event.endHour = this.event.endTime.getHours();
            this.event.endMinute = this.event.endTime.getMinutes();
        }
        this.eventService.saveEvent(this.event).subscribe(
            () => $('#calendar').fullCalendar('refetchEvents')
        );
    }

    deleteEvent() {
        this.eventService.deleteEvent(this.event).subscribe(
            () => $('#calendar').fullCalendar('refetchEvents')
        );
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }

    isEditOn(): boolean {
        return this.isAuthenticated() && this.authService.isEdit();
    }

    deleteContent() {
        this.confirmModel = {
            title: 'Delete Content?',
            message: `Are you sure you want to delete this content? It cannot be undone.`,
            onOk: () => {
                this.pagesService.deletePageContent(this.pageContentId).subscribe(() => {
                    this.pageComponent.loadPage();
                });
            }
        } as Confirm;
        this.showDialog(this.confirmDialog);
    }

}
