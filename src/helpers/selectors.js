//Get the list of appointments for a specific day
export function getAppointmentsForDay(state, day) {
  const selectedDayObject = getDayObjectByName(state, day);
  const finalAppointmentsList = [];

  if (selectedDayObject) {
    const appointmentsArray = selectedDayObject.appointments;
    const filteredArray = Object.keys(state.appointments).filter((elm) => {
      return appointmentsArray.includes(Number(elm));
    });

    filteredArray.forEach((elm) =>
      finalAppointmentsList.push(state.appointments[elm])
    );
  }

  return finalAppointmentsList;
}

//Get an interview object from interview data
export function getInterview(state, interview) {
  let interviewObj = null;

  if (interview) {
    const student = interview.student;
    const interviewer = state.interviewers[interview.interviewer];
    interviewObj = { student, interviewer };
  }
  return interviewObj;
}

//Get the interviewers for a specific day
export function getInterviewersForDay(state, day) {
  const selectedDayObject = getDayObjectByName(state, day);
  const finalInterviewersList = [];

  if (selectedDayObject) {
    const interviewersArray = selectedDayObject.interviewers;
    const filteredArray = Object.keys(state.interviewers).filter((elm) => {
      return interviewersArray.includes(Number(elm));
    });
    filteredArray.forEach((elm) =>
      finalInterviewersList.push(state.interviewers[elm])
    );
  }

  return finalInterviewersList;
}

//Get a day object by its name
export function getDayObjectByName(state, day) {
  return state.days.find((elm) => elm.name === day);
}

//Get a new array of day objects with an updated day object
export function getNewArrayOfDays(days, today, newToday) {
  const newDays = [...days];
  if (today === "Monday") {
    newDays[0] = newToday;
  } else if (today === "Tuesday") {
    newDays[1] = newToday;
  } else if (today === "Wednesday") {
    newDays[2] = newToday;
  } else if (today === "Thursday") {
    newDays[3] = newToday;
  } else if (today === "Friday") {
    newDays[4] = newToday;
  }
  return newDays;
}

//Get the number of spots available for a specific day
export const getNumberOfSpots = (state, dayObj) => {
  const spots = dayObj.appointments.filter((elm) => {
    return state.appointments[elm].interview === null;
  });
  return spots.length;
};

//Get a new list of day objects
export const updatedDayList = (state) => {
  const today = getDayObjectByName(state, state.day);
  const newToday = { ...today, spots: getNumberOfSpots(state, today) };
  const updatedDayList = getNewArrayOfDays(state.days, state.day, newToday);
  return updatedDayList;
};
