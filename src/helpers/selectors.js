//Get a day object by its name
export const getDayObjectByName = (state, day) => {
  return state.days.find((elm) => elm.name === day);
};

//Get the list of appointments for a specific day
export const getAppointmentsForDay = (state, day) => {
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
};

//Get an interview object from interview data
export const getInterview = (state, interview) => {
  let interviewObj = null;

  if (interview) {
    const student = interview.student;
    const interviewer = state.interviewers[interview.interviewer];
    interviewObj = { student, interviewer };
  }
  return interviewObj;
};

//Get the interviewers for a specific day
export const getInterviewersForDay = (state, day) => {
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
};

//Get number of spots for specific day
export const getSpotsForDay = (day, appointments) =>
  day.appointments.length -
  day.appointments.reduce(
    (count, id) => (appointments[id].interview ? count + 1 : count),
    0
  );
