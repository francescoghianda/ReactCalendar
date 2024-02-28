export type EventID = number | string;

export interface CalendarEvent {
    readonly id: EventID,
    readonly startDate: Date,
    readonly endDate: Date,
    readonly title: string,
    readonly description?: string,
    readonly color?: string
}