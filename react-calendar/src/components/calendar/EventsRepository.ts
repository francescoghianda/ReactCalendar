import { CalendarEvent, EventID } from "./CalendarEvent";

 
export interface EventsRepository {

    addEvent(event: CalendarEvent): CalendarEvent;
    removeEvent(eventId: EventID): boolean;
    findAllEvents(): CalendarEvent[];
    findEventsByDate(date: Date): CalendarEvent[];
    findEventsByMonth(month: number, year: number): CalendarEvent[];

}