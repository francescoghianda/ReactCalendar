import { useState } from 'react'
import './Calendar.css'

type CalendarMode = "day" | "month" | "year"

export function Calendar() {

    const [date, setDate] = useState(new Date(new Date().setDate(1)));
    const [mode, setMode] = useState<CalendarMode>("month")

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

    const getMonthString = (from = date) => {
        const opt: Intl.DateTimeFormatOptions = { month: 'long' };
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

    const DayView = (date: Date) => {
        
        return (
        <div className='day-view'>
            {Array.apply(null, Array(24)).map((v, hour) => {

                const hourDate = new Date(date.setHours(hour));
                const hourStr = getHourString(hourDate);

                return (
                    <div className='hour' data-hour={hourStr} key={date.getTime() + "-" + hour}>
                        
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
                            <div key={date.getTime()}>
                                <p
                                    style={{
                                        fontWeight: '800',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setMonthMode(date)}
                                >{getMonthString(date)}</p>
                                <div style={{pointerEvents: "none"}}>
                                    {MonthGrid(date, true, false)}
                                </div>
                                
                            </div>
                        )
                    })
                }
            </div>
        )

    }

    const MonthGrid = (date: Date, showOtherMonths: boolean = true, showDaysName: boolean = true) => {

        const normDate = new Date(date.setDate(1)); // normalized at first of the month
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
            loopDate = new Date(loopDate.setDate(loopDate.getDate() + 1));
            return d;
        });

        /*const days = Array.apply(null, Array(calendarRows*7)).map((v, i) => { 

            let index = i + 1;

            if (index < startDate) {
                return prevMonthLastDate - (startDate - 1) + index;
            }
            else if (index >= startDate && index < monthLastDate+startDate) {
                return index - (startDate - 1)
            }
            else {
                return index - (monthLastDate+startDate) + 1;
            }
        });

        return (
            <div className='calendar-grid'>
                {
                    showDaysName && dayStrs.map((day, i) => {
                        return <div key={i} className={`day-cell disabled day-name ${i+1 > 5 ? 'weekend' : ''}`}>{day}</div>
                    })
                }
                {
                    days.map((day, i) => {

                        if (i+1 >= startDate && i+1 < monthLastDate+startDate) {
                            return (
                            <div className='day-cell' key={`${date.getFullYear()}-${date.getMonth()}-${day}`}>
                                {day}
                            </div>
                            )
                        }
                        else {
                            const key = `${date.getFullYear()}-${day < 14 ? date.getMonth()+1 : date.getMonth()+1}-${day}`
                            return (
                                <div className='day-cell disabled' key={key}>{showOtherMonths ? day : ""}</div>
                            )
                        }
                    })
                }
            </div>
        )*/


        return (
            <div className='calendar-grid'>
                {
                    showDaysName && dayStrs.map((day, i) => {
                        return <div key={i} className={`day-cell disabled day-name ${i+1 > 5 ? 'weekend' : ''}`}>{day}</div>
                    })
                }
                {
                    days.map((day, i) => {

                        if (day.prevMonth || day.nextMonth) {
                            return <div className='day-cell disabled' key={day.date.getTime()}>{showOtherMonths ? day.date.getDate() : ""}</div>
                        }
                        else {
                            return (
                                <div className='day-cell' key={day.date.getTime()} onClick={() => setDayMode(day.date)}>
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