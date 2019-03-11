import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/calendar';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EventService {

    events: Event[];

    constructor(private httpClient: HttpClient) { }

    public loadEvents() {
        this.httpClient.get<Event[]>('/api/event').subscribe(events => this.events = events);
    }

    public getEvents(): Observable<Event[]> {
        return this.httpClient.get<Event[]>('/api/event');
    }

    public getUpcomingEvents(count: number): Observable<Event[]> {
        const url = `/api/event/upcoming/${count}`;
        return this.httpClient.get<Event[]>(url);
    }

    public saveEvent(event: Event) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        console.log(event);
        if (event.isEditing) {
            return this.httpClient.put<Event>(`/api/event/${event.id}`, event, options);
        } else {
            return this.httpClient.post<Event>('/api/event', event, options);
        }
    }

    public deleteEvent(event: Event) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };

        return this.httpClient.delete(`/api/event/${event.id}/${event.updateRecurrence}`, options);
    }
}
