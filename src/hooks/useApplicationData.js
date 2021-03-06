import axios from "axios";
import { useEffect, useReducer } from "react";
import {
  reducer,
  SET_APPLICATION_DATA,
  SET_DAY,
  SET_INTERVIEW,
} from "../reducers/application";

//Main Application Logic
export default function useApplicationData() {
  //Setting the state/reducer
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  //Axios request to 3 data endpoints
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          interviewers: all[2].data,
          days: all[0].data,
          appointments: all[1].data,
        },
      });
    });
  }, []);

  //Websocket Set Up
  useEffect(() => {
    const ws =
      process.env.NODE_ENV === "test"
        ? new WebSocket("ws://localhost:8001")
        : new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type === "SET_INTERVIEW") {
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id: message.id,
            interview: message.interview,
          },
        });
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  //Cancelling interview request to the database
  const cancelInterview = (id) => {
    return axios.delete(`/api/appointments/${id}`).then(() => {
      process.env.NODE_ENV === "test" &&
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview: null,
          },
        });
    });
  };

  //Booking interview request to the database
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      process.env.NODE_ENV === "test" &&
        dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview,
          },
        });
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
