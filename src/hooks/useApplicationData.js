import axios from 'axios'
import { useEffect, useReducer} from 'react'
import {getDayObjectByName, getNewArrayOfDays, getNumberOfSpots} from '../helpers/selectors'
import {reducer} from '../reducers/application'

import dotenv from 'dotenv'
dotenv.config()

const SET_DAY = "SET_DAY"
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
const SET_INTERVIEW = "SET_INTERVIEW"


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

    const ws = new WebSocket('ws://localhost:8001')
    ws.onopen = e => ws.send('ping')
    ws.onmessage = e => {

      const message = JSON.parse(e.data)
      if(message.type === 'SET_INTERVIEW'){
        if(message.interview){
          dispatch({
            type: SET_INTERVIEW,
            value:{
              id: message.id,
              interview: message.interview
            }
          })
        }else{
          dispatch({
            type:SET_INTERVIEW,
            value:{
              id: message.id,
              interview:null
            }
          })
        }
      }
    }
  }, [])

  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`)
    // .then(() => {
    //   dispatch({
    //     type:SET_INTERVIEW,
    //     value:{
    //       id,
    //       interview:null
    //     }
    //   })
    // })
  } 

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios.put(`/api/appointments/${id}`, appointment)
    // .then(() => {
    //   dispatch({
    //     type: SET_INTERVIEW,
    //     value:{
    //       id,
    //       interview
    //     }
    //   })
    // })
  }

return {state, setDay, bookInterview, cancelInterview}
} 