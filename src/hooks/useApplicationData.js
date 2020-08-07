import axios from 'axios'
import { useEffect, useReducer} from 'react'
import {getDayObjectByName, getNewArrayOfDays, getNumberOfSpots} from '../helpers/selectors'
import dotenv from 'dotenv'
dotenv.config()

const SET_DAY = "SET_DAY"
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
const SET_INTERVIEW = "SET_INTERVIEW"

const reducer = (state, action) => {
  switch(action.type){
    case SET_DAY:{
      return { ...state, day: action.value }
    }
    case SET_APPLICATION_DATA:{
      return { ...state, ...action.value }
    }
    case SET_INTERVIEW:{
      const {id, interview} = action.value

        const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        };
        if(interview===null){
           appointment.interview = null
        }
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
      
        const today = getDayObjectByName(state.days, state.day)
        const newToday = state.appointments[id].interview ? today : {...today, spots:getNumberOfSpots(today, state)}
        const newDays = getNewArrayOfDays(state.days, state.day, newToday)

      return { ...state, appointments, days:newDays}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      )
  }
}

export default function useApplicationData(){

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => dispatch({ type: SET_DAY, value: day })

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value:{
          interviewers: all[2].data,
          days: all[0].data,
          appointments: all[1].data
        }
      })
    })
  }, [])

  useEffect(() => {

    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    ws.onopen = e => ws.send('ping')
    ws.onmessage = e => {

      const message = JSON.parse(e.data)
      if(message.type === 'SET_INTERVIEW'){
        if(message.interview){
          bookInterview(message.id, message.interview)
        }else{
          cancelInterview(message.id)
        }
      }
    }
  }, [])

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      dispatch({
        type:SET_INTERVIEW,
        value:{
          id,
          interview:null
        }
      })
    })
  } 

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      dispatch({
        type: SET_INTERVIEW,
        value:{
          id,
          interview
        }
      })
    })
  }

return {state, setDay, bookInterview, cancelInterview}
} 