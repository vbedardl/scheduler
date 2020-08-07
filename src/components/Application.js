import React from "react";

import "components/Application.scss";
import Appointment from 'components/Appointment'
import DayList from "./DayList";
import helper from '../helpers/selectors'
import useApplicationData from '../hooks/useApplicationData'


export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData()

  const interviewersMap = helper.getInterviewersForDay(state, state.day)

  const appointmentsMap = helper.getAppointmentsForDay(state, state.day).map(
    elm => {
      return(
        <Appointment
          key={elm.id}
          id={elm.id}
          time={elm.time}
          interview={helper.getInterview(state, elm.interview)}
          interviewers={interviewersMap}
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      )
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            interviewers={state.interviewers}
            setDay={setDay}
            />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsMap}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
