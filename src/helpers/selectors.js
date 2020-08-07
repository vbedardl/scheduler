function getAppointmentsForDay(state, day) {

  const selectedDayAppointments = state.days.find(elm => elm.name === day)

  let result = []

  if(selectedDayAppointments){
    const appointmentArray = selectedDayAppointments.appointments
    const filteredArray = Object.keys(state.appointments).filter(elm => {
      return appointmentArray.includes(Number(elm))
    })
    
    filteredArray.forEach(elm => {
      result.push(state.appointments[elm])
    })
  }
  
  return result
}
exports.getAppointmentsForDay = getAppointmentsForDay


function getInterview(state, interview){
  let interviewObj = null

  if(interview){
    const student = interview.student
    const interviewer = state.interviewers[interview.interviewer]
    interviewObj = {student, interviewer}
  }
  return interviewObj
}
exports.getInterview = getInterview



function getInterviewersForDay(state, day) {

   const selectedDayInterviewers = state.days.find(elm => elm.name === day)

   let result = []

   if(selectedDayInterviewers){
     const interviewersArray = selectedDayInterviewers.interviewers
     const filteredArray = Object.keys(state.interviewers).filter(elm => {
       return interviewersArray.includes(Number(elm))
     })
    
     filteredArray.forEach(elm => {
       result.push(state.interviewers[elm])
     })
   }
  
  return result
}
exports.getInterviewersForDay = getInterviewersForDay

function getDayObjectByName(days, day){
  return days.filter(elm => {
    if(elm.name === day){
      return elm
    }
  })[0]
}
exports.getDayObjectByName = getDayObjectByName

function getNewArrayOfDays(days, today, newToday){
  const newDays = [...days]
if(today === 'Monday'){
  newDays[0] = newToday
}else if(today === 'Tuesday'){
  newDays[1] = newToday
}else if(today === 'Wednesday'){
  newDays[2] = newToday
}else if(today === 'Thursday'){
  newDays[3] = newToday
}else if(today === 'Friday'){
  newDays[4] = newToday
}
return newDays
}
exports.getNewArrayOfDays = getNewArrayOfDays


const getNumberOfSpots = (day, state) => {
  const spots = day.appointments.filter(elm => {
    return state.appointments[elm].interview === null
  })
  return spots.length
}
exports.getNumberOfSpots = getNumberOfSpots