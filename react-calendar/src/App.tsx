import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Calendar } from './components/calendar/Calendar';
import { CalendarEvent } from './components/calendar/CalendarEvent';
import { StorageEventsRepository } from './components/calendar/StorageEventsRepository';

function App() {

  interface EventFormValues {
    startDate: string;
    endDate: string;
    title: string;
    description?: string;
    color: string;
  }

  const [eventFormValues, setEventFormValues] = useState<EventFormValues>({
    startDate: "",
    endDate: "",
    title: "",
    color: "#000000"
  });

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const repo = new StorageEventsRepository();

  const testEvent0: CalendarEvent = {
      id: 0,
      startDate: new Date(1996, 9, 27, 2),
      endDate: new Date(1996, 9, 27, 2),
      title: "L'inizio",
      color: '#5e03fc'
  }

  const testEvent1: CalendarEvent = {
      id: 1,
      startDate: new Date(2024, 1, 25, 4),
      endDate: new Date(2024, 2, 1, 16),
      title: "Test Event 1 evento con un titolo molto lungo anzi lunghissimo",
      color: '#ff0000'
  }

  const testEvent2: CalendarEvent = {
      id: 2,
      startDate: new Date(2024, 1, 20, 13),
      endDate: new Date(2024, 2, 5, 18),
      title: "Test Event 2",
      color: '#0000ff'
  }

  //const events = [testEvent0, testEvent1, testEvent2]

  useEffect(() => {
    setEvents(repo.findAllEvents());
  }, []);

  const eventClickHandler = (event: CalendarEvent) => {
    if(repo.removeEvent(event.id)) {
      setEvents(events.filter(e => e.id !== event.id));
    }
  }

  const addEventHandler = () => {
    if(eventFormValues.startDate.length > 0 && eventFormValues.endDate.length > 0 && eventFormValues.title.length > 0) {

      const newEvent = repo.addEvent({
        id: 0,
        startDate: new Date(eventFormValues.startDate),
        endDate: new Date(eventFormValues.endDate),
        title: eventFormValues.title,
        description: eventFormValues.description ?? "",
        color: eventFormValues.color ?? "#000"
      });

      if(newEvent) {
        setEvents([...events, newEvent])
      }
    }
  }

  return (
    <div className="App">
      <Calendar events={events} onEventClick={eventClickHandler}/>
      <form style={{width: '200px', display: 'flex', flexDirection:'column'}}>
        <label htmlFor='startDate'>From</label>
        <input required type='date' name='startDate' value={eventFormValues.startDate} onChange={e => setEventFormValues({...eventFormValues, startDate: e.target.value})}/>
        <label htmlFor='endDate'>To</label>
        <input required type='date' name='endDate' value={eventFormValues.endDate} onChange={e => setEventFormValues({...eventFormValues, endDate: e.target.value})}/>
        <label htmlFor="title">Title</label>
        <input required type='text' name='title' value={eventFormValues.title} onChange={e => setEventFormValues({...eventFormValues, title: e.target.value})}/>
        <label htmlFor='description'>Description</label>
        <input type='text' name='description' value={eventFormValues.description} onChange={e => setEventFormValues({...eventFormValues, description: e.target.value})}/>
        <label htmlFor="color">Color</label>
        <input type="color" name='color' value={eventFormValues.color} onChange={e => setEventFormValues({...eventFormValues, color: e.target.value})}/>
        <button type='submit' onClick={(e) => {
          addEventHandler();
          e.preventDefault();
        }}>
          Add Event
        </button>
      </form>
    </div>
  );
}

export default App;
