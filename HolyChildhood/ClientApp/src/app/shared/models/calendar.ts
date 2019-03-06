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
    recurrenceMonthlyType: string;
    recurrenceMonthlyWeek: number;
    updateRecurrence: boolean;

    // support EventViewModel
    startYear: number;
    startMonth: number;
    startDay: number;
    startHour: number;
    startMinute: number;
    hasEndTime: boolean;
    endHour: number;
    endMinute: number;

    // other support properties
    isEditing: boolean;
    startTime: Date;
    endTime: Date;
}
