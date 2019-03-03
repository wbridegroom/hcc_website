export interface Calendar {
    id: number;
    name: string;
    events: Event[];
}

export interface Event {
    id: number;
    calendarId: number;
    title: string;
    description: string;
    location: string;
    notes: string;
    start: Date;
    end: Date;
    allDay: boolean;
    eventTypeId: number;
    eventTypeName: string;
    color: string;

    // Recurrence Data
    isRecurring: boolean;
    recurrenceId: string;
    recurrenceType: string;
    updateRecurrence: boolean;

    // support EventViewModel
    startYear: number;
    startMonth: number;
    startDay: number;
    startHour: number;
    startMinute: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    endHour: number;
    endMinute: number;
}
