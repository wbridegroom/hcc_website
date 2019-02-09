export interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
    allDay: boolean;
}
