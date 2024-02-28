import { CalendarEvent, EventID } from "./CalendarEvent";
import { EventsRepository } from "./EventsRepository";

interface StorageItem {
    events: [EventID, CalendarEvent][],//Map<EventID, CalendarEvent>,
    lastId: number
}

export class StorageEventsRepository implements EventsRepository {

    private readonly storageName = "calendar-events";
    private events: Map<EventID, CalendarEvent>;
    private storage: Storage;
    private lastId: number;

    constructor() {
        this.storage = window.localStorage;

        const storageItem = this.storage.getItem(this.storageName);

        if (storageItem) {
            const item: StorageItem = JSON.parse(storageItem);
            const entries: [EventID, CalendarEvent][] = item.events.map(entry => {
                const id: EventID = entry[0];
                const event: CalendarEvent = {
                    ...entry[1],
                    startDate: new Date(entry[1].startDate),
                    endDate: new Date(entry[1].endDate),
                }
                return [id, event];
            })
            this.events = new Map(entries);
            this.lastId = item.lastId;
        }
        else {
            this.events = new Map();
            this.lastId = 0;
            this.save();
        }
    }

    private save(): boolean {
        const item: StorageItem = {
            events: Array.from(this.events.entries()),
            lastId: this.lastId
        }
        
        try {
            this.storage.setItem(this.storageName, JSON.stringify(item));
            return true;
        }
        catch {
            return false;
        }
    }
    
    addEvent(event: CalendarEvent): CalendarEvent {
        const e = {
            ...event,
            id: this.lastId
        }
        this.events.set(this.lastId, e);
        this.lastId++;
        if(this.save()) return e;
        this.events.delete(this.lastId-1);
        return e;
    }

    removeEvent(eventId: EventID): boolean {
        this.events.delete(eventId);
        return this.save();
    }

    findAllEvents(): CalendarEvent[] {
        return Array.from(this.events.values());
    }

    findEventsByDate(date: Date): CalendarEvent[] {
        const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
        return this.findAllEvents().filter(event => {
            return new Date(event.startDate).setHours(0) <= checkDate.getTime() && new Date(event.endDate).setHours(0) >= checkDate.getTime();
        });
    }

    findEventsByMonth(month: number, year: number): CalendarEvent[] {
        return this.findAllEvents().filter(event => {
            return (event.startDate.getFullYear() === year || event.endDate.getFullYear() === year) && (event.startDate.getMonth() === month || event.endDate.getMonth() === month);
        });
    }
    
}