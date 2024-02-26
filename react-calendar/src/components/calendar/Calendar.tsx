import { useState } from 'react'
import './Calendar.css'

type CalendarMode = "day" | "month" | "year"

interface CalendarEvent {
    startDate: Date,
    endDate: Date,
    title: string,
    description?: string,
    color?: string
}

export function Calendar() {

    const testEvent0: CalendarEvent = {
        startDate: new Date(1996, 9, 27, 2),
        endDate: new Date(1996, 9, 27, 2),
        title: "L'inizio",
        color: '#5e03fc'
    }

    const testEvent1: CalendarEvent = {
        startDate: new Date(2024, 1, 25, 4),
        endDate: new Date(2024, 2, 1, 16),
        title: "Test Event 1",
        color: '#ff0000'
    }

    const testEvent2: CalendarEvent = {
        startDate: new Date(2024, 1, 20, 13),
        endDate: new Date(2024, 2, 5, 18),
        title: "Test Event 2",
        color: '#0000ff'
    }

    const [date, setDate] = useState(new Date(new Date().setDate(1)));
    const [mode, setMode] = useState<CalendarMode>("month");
    const [events, setEvents] = useState<CalendarEvent[]>([testEvent0, testEvent1, testEvent2]);

    const prev = () => {
        let newDate;
        switch(mode) {
            case "day":
                newDate = new Date(date.setDate(date.getDate() - 1));
                break;
            case "month":
                newDate = new Date(date.setMonth(date.getMonth() - 1));
                break;
            case "year":
                newDate = new Date(date.setFullYear(date.getFullYear() - 1));
                break;
        }
        setDate(newDate);
    }

    const next = () => {
        let newDate;
        switch(mode) {
            case "day":
                newDate = new Date(date.setDate(date.getDate() + 1));
                break;
            case "month":
                newDate = new Date(date.setMonth(date.getMonth() + 1))
                break;
            case "year":
                newDate = new Date(date.setFullYear(date.getFullYear() + 1))
                break;
        }
        setDate(newDate);
    }

    const addEvent = (eventId: any, startDate: Date, endDate: Date, title: string, description?: string) => {
        const event: CalendarEvent = {startDate: startDate, endDate: endDate, title: title, description: description};
        setEvents([...events, event]);
    }

    const getEvents = (date: Date, checkHours: boolean = false, from = events) => {
        const checkDate = checkHours ? date : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0);
        return from.filter(event => {
            return checkHours ? event.startDate.getTime() <= checkDate.getTime() && event.endDate.getTime() >= checkDate.getTime() : 
                                new Date(event.startDate).setHours(0) <= checkDate.getTime() && new Date(event.endDate).setHours(0) >= checkDate.getTime()
        });
    }

    const getMonthEvents = (month: number) => {
        return events.filter(event => {
            return event.startDate.getMonth() === month || event.endDate.getMonth() === month;
        })
    }

    const getMonthString = (from = date, format: "long" | "short" | "narrow" | "numeric" | "2-digit" = 'long' ) => {
        const opt: Intl.DateTimeFormatOptions = { month: format };
        let monthStr = from.toLocaleDateString(undefined, opt);
        return monthStr.charAt(0).toUpperCase() + monthStr.substring(1);
    }

    const getDayString = (from = date, format: "long" | "short" | "narrow" = "short") => {
        const opt: Intl.DateTimeFormatOptions = { weekday: format};
        let dayStr = from.toLocaleDateString(undefined, opt);
        return dayStr.charAt(0).toUpperCase() + dayStr.substring(1);
    }

    const getHourString = (from = date) => {
        const opt: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit"};
        const strs = from.toLocaleDateString(undefined, opt).split(" ");
        return strs.length > 2 ? `${strs[1]} ${strs[2]}` : strs[1];
    }

    const setMonthMode = (date: Date) => {
        setDate(date);
        setMode("month");
    }

    const setDayMode = (date: Date) => {
        setDate(date);
        setMode("day");
    }

    const dayStrs = Array.apply(null, Array(7)).map((v, i) => {
        const date = new Date('1970-06-01');
        return getDayString(new Date(date.setDate(i+1))).toUpperCase();
    });

    const randomRGB = () => {
        return `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
    }

    const DayView = (date: Date) => {

        const dayEvents = getEvents(date);
        
        return (
        <div className='day-view'>
            {Array.apply(null, Array(24)).map((v, hour) => {

                const hourDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);
                const hourStr = getHourString(hourDate);
                const hourEvents = getEvents(hourDate, true, dayEvents);

                return (
                    <div className='hour' data-hour={hourStr} key={date.getTime() + "-" + hour}>
                        {hourEvents.map((event, i) => {
                            return i < 12 && <p key={`${event.title}-${hour}`}>{event.title}</p> // 12 is the max rappresentable events in a day cell
                        })}
                    </div>
                )
            })}
        </div>)
    }

    const YearGrid = (date: Date) => {

        const months = Array.apply(null, Array(12)).map((v, i) => new Date(date.getFullYear(), i, 1));
        
        return (
            <div className='year-grid'>
                {
                    months.map((date: Date) => {
                        return(
                            <div key={date.getTime()} onClick={() => setMonthMode(date)} style={{cursor: 'pointer'}}>
                                <p
                                    style={{
                                        fontWeight: '800',
                                        fontSize: '1.5em',
                                        margin: '.5em'
                                    }}
                                >{getMonthString(date, 'short').toUpperCase()}</p>
                                <div style={{pointerEvents: "none"}}>
                                    {MonthGrid(date, false, false, false)}
                                </div>
                                
                            </div>
                        )
                    })
                }
            </div>
        )

    }

    const MonthGrid = (date: Date, showOtherMonths: boolean = true, showDaysName: boolean = true, showEvents: boolean = true) => {

        const normDate = new Date(date.getFullYear(), date.getMonth(), 1); // normalized at first of the month
        const startDate = normDate.getDay() === 0 ? 7 : normDate.getDay();
        const monthLastDate = (new Date(date.getFullYear(), date.getMonth()+1, 0)).getDate();
        const prevMonthLastDate = (new Date(date.getFullYear(), date.getMonth(), 0)).getDate();

        const calendarRows = 6;

        const day = startDate === 1 ? 1 : prevMonthLastDate - (startDate - 1) + 1;
        const month = startDate === 1 ? date.getMonth() : (date.getMonth() > 0 ? date.getMonth() - 1 : 11);
        const year = startDate === 1 ? date.getFullYear() : (date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear());

        let loopDate = new Date(year, month, day);

        const days = Array.apply(null, Array(calendarRows * 7)).map((v, i) => {
            const d = {
                date: new Date(loopDate),
                prevMonth: i+1 < startDate,
                nextMonth: i+1 > monthLastDate +  (startDate - 1)
            };
            loopDate.setDate(loopDate.getDate() + 1);
            return d;
        });

        const monthEvents = getMonthEvents(date.getMonth());

        return (
            <div className='calendar-grid'>
                {
                    showDaysName && dayStrs.map((day, i) => {
                        return <div key={i} className={`day-name ${i+1 > 5 ? 'weekend' : ''}`}>{day}</div>
                    })
                }
                {
                    days.map((day, i) => {

                        
                        const dayEvents = (
                            <div className='day-events'>
                                {getEvents(day.date, false, monthEvents).map(event => {
                                    //return <div key={event.title} style={{backgroundColor: day.nextMonth || day.prevMonth ? '#c8c8c8' : event.color ?? '#000'}}></div>
                                    return <div key={event.title} style={{backgroundColor: event.color ?? '#000'}}></div>
                                })}
                            </div>);
                        
                        const isWeekend = i%7+1 > 5;

                        if (day.prevMonth || day.nextMonth) {
                            return (showOtherMonths ? 
                                <div className={`day-cell disabled ${isWeekend && 'weekend'}`} key={day.date.getTime()} onClick={() => setDayMode(day.date)}>
                                    {showEvents && dayEvents}{day.date.getDate()}
                                </div> : 
                                <div></div>)
                        }
                        else {
                            return (
                                <div className={`day-cell ${isWeekend && 'weekend'}`} key={day.date.getTime()} onClick={() => setDayMode(day.date)}>
                                    {showEvents && dayEvents}
                                    {day.date.getDate()}
                                </div>
                            )
                        }
                    })
                }
            </div>)

    }

    const CalendarHeaderDate = () => {

        if (mode === "day") {
            let dateStr = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric"});
            dateStr = dateStr.charAt(0).toUpperCase() + dateStr.substring(1);
            return (
                <>
                    <p onClick={e => {setMode("month")}} style={{cursor: "pointer"}}> {getMonthString(date)} </p>
                    <p>{dateStr}</p>
                </>
            )
        }

        if (mode === "month") {
            return (
                <>
                    <p onClick={e => {setMode("year")}} style={{cursor: "pointer"}}> {date.getFullYear()} </p>
                    <p>{getMonthString(date)}</p>
                </>
            )
        }

        if (mode === "year") {
            return (
                <>
                    <p style={{cursor: "pointer"}}> {date.getFullYear()} </p>
                </>
            )
        }

    }

    const CalendarBody = () => {
        if (mode === "day") return DayView(date);

        if (mode === "month") return MonthGrid(date)

        if (mode === "year") return YearGrid(date)
    }

    return (
        <div className="calendar">
            <div className='calendar-header'>
                <button
                    onClick={prev}
                    style={{
                        transform: 'rotate(180deg)'

                        }}      
                >
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 330 330" xmlSpace='preserve'>
                        <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
                            c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
                            C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
                            C255,161.018,253.42,157.202,250.606,154.389z"/>
                    </svg>
                </button>
                <div className='calendar-header-date'>
                    {CalendarHeaderDate()}
                </div>
                
                <button
                    onClick={next}
                >
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 330 330" xmlSpace='preserve'>
                        <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
                            c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
                            C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
                            C255,161.018,253.42,157.202,250.606,154.389z"/>
                    </svg>
                </button>
            </div>
            { CalendarBody() }
        </div>
    )
}