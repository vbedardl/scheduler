import React, { useState, useEffect } from "react";
import axios from 'axios'

import "components/Application.scss";
import Appointment from 'components/Appointment'
import DayList from "./DayList";
import helper from '../helpers/selectors'


export default function Application(props) {
  const interviewers = [
    { id: 1, name: "Sylvia Palmer", avatar: "https://i.imgur.com/LpaY82x.png" },
    { id: 2, name: "Tori Malcolm", avatar: "https://i.imgur.com/Nmx0Qxo.png" },
    { id: 3, name: "Mildred Nazir", avatar: "https://i.imgur.com/T2WwVfS.png" },
    { id: 4, name: "Cohana Roy", avatar: "https://i.imgur.com/FK8V841.jpg" },
    { id: 5, name: "Sven Jones", avatar: "https://i.imgur.com/twYrpay.jpg" }
  ];

  const [state, setState] = useState({
    day:"Monday",
    days:[],
    appointments: {},
    interviewers:{}
  })

  const setDay = day => setState({...state, day })
  const setDays = days => setState(prev => ({...prev, days}))
  const setAppointments = appointments => setState(prev => ({...prev, appointments}))
  const setInterviewers = interviewers => setState(prev => ({...prev, interviewers}))

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setInterviewers(all[2].data)
      setDays(all[0].data)
      setAppointments(all[1].data)
    })
  }, [])

  const appointmentsMap = helper.getAppointmentsForDay(state, state.day).map(elm => {
    const interview = helper.getInterview(state, elm.interview)
    const interviewers = helper.getInterviewersForDay(state, state.day)
    return(
    <Appointment
      key={elm.id}
      id={elm.id}
      time={elm.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
    />
    )
  })

  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
      interview:null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    console.log('appoint:',appointment)
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment)
    .then(() => setState({...state, appointments}))
    .catch(e => console.log('error in app:',e))
  }

  function bookInterview(id, interview){
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => setState({...state, appointments}))
    .catch(e => console.log(e))
  }

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
            interviewers={interviewers}
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
      </section>
    </main>
  );
}
