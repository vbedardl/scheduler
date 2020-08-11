import {getDayObjectById, getDayObjectByName, getNewArrayOfDays, getNumberOfSpots} from '../helpers/selectors'


const SET_DAY = "SET_DAY"
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
const SET_INTERVIEW = "SET_INTERVIEW"

export const reducer = (state, action) => {
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
      
        const newState = {...state, appointments}
        const today = getDayObjectByName(state.days, state.day)
        const newToday = {...today, spots:getNumberOfSpots(today, newState)}
        const newDays = getNewArrayOfDays(state.days, state.day, newToday)

      return { ...state, appointments, days:newDays}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      )
  }
}
