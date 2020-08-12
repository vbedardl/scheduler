import { updatedDayList } from "../helpers/selectors";

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

//Reducer function
export const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY: {
      return { ...state, day: action.value };
    }
    case SET_APPLICATION_DATA: {
      return { ...state, ...action.value };
    }
    case SET_INTERVIEW: {
      const { id, interview } = action.value;

      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };
      if (interview === null) {
        appointment.interview = null;
      }
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      const newDays = updatedDayList(state);

      return { ...state, appointments, days: newDays };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};
