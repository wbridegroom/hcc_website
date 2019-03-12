import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Event, EventType} from '../models/calendar';

const options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EventService {

    constructor(private httpClient: HttpClient) { }

    public getEvents(): Observable<Event[]> {
        return this.httpClient.get<Event[]>('/api/event');
    }

    public getEventTypes(): Observable<EventType[]> {
        return this.httpClient.get<EventType[]>('/api/event/types');
    }

    public getUpcomingEvents(count: number): Observable<Event[]> {
        const url = `/api/event/upcoming/${count}`;
        return this.httpClient.get<Event[]>(url);
    }

    public saveEvent(event: Event) {
        if (event.isEditing) {
            return this.httpClient.put<Event>(`/api/event/${event.id}`, event, options);
        } else {
            return this.httpClient.post<Event>('/api/event', event, options);
        }
    }

    public deleteEvent(event: Event) {
        return this.httpClient.delete(`/api/event/${event.id}/${event.updateRecurrence}`, options);
    }

    public saveEventType(eventType: EventType) {
        const url = `/api/event/eventtype/${eventType.id}`;
        return this.httpClient.post<EventType>(url, eventType, options);
    }
}
