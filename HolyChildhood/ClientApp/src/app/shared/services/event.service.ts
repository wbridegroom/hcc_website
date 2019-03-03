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

    public addEvent(event: Event) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json'
            })
        };
        console.log(event);
        return this.httpClient.post<Event>('/api/event', event, options);
    }
}
