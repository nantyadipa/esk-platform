'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'

export type CalendarHandle = {
  getApi: () => unknown
}

type Event = {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  extendedProps: { schedule: unknown }
}

type Props = {
  events: Event[]
  onDateClick: (date: Date) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEventClick: (schedule: any) => void
}

const ScheduleCalendar = forwardRef<{ getApi: () => unknown }, Props>(
  function ScheduleCalendar({ events, onDateClick, onEventClick }, ref) {
    const calendarRef = useRef<FullCalendar>(null)

    useImperativeHandle(ref, () => ({
      getApi: () => calendarRef.current?.getApi(),
    }))

    return (
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        locale="id"
        buttonText={{
          today: 'Hari Ini',
          month: 'Bulan',
          week: 'Minggu',
          day: 'Hari',
        }}
        weekends={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        dateClick={(info: DateClickArg) => {
          onDateClick(info.date)
        }}
        eventClick={(info: EventClickArg) => {
          onEventClick(info.event.extendedProps.schedule)
        }}
        height="auto"
        aspectRatio={1.8}
        eventDisplay="block"
        dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
        titleFormat={{ month: 'long', year: 'numeric' }}
        nowIndicator={true}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        allDaySlot={false}
        slotDuration="01:00:00"
      />
    )
  }
)

export default ScheduleCalendar