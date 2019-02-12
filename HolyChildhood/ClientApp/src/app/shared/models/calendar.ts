export interface Calendar {
    id: number;
    name: string;
    events: Event[];
}

export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    notes: string;
    start: Date;
    end: Date;
    allDay: boolean;
}
