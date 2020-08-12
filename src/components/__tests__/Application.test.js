import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  xit("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    //await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    console.log(prettyDOM(appointments));

    // const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'))
    //   console.log(prettyDOM(day))
    //expect(getByText(day, /no spot remaining/i)).toBeInTheDocument()
  });

  xit("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, /confirm/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, /confirm/i));
    expect(getByText(appointment, /deleting.../i)).toBeInTheDocument();
    console.log(prettyDOM(appointment));

    await waitForElement(() => getByAltText(appointment, "Add"));
    // const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'))
    //   console.log(prettyDOM(day))
    //expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument()
  });

  xit("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Vincent Bedard" },
    });
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Vincent Bedard"));
    expect(getByText(appointment, /Vincent Bedard/i)).toBeInTheDocument();
  });

  xit("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Vincent Bedard" },
    });
    fireEvent.click(getByText(appointment, "Save"));
    await waitForElement(() => getByText(appointment, "Error"));
    expect(
      getByText(
        appointment,
        /Sorry we were unable to save the appointment. Try again/i
      )
    ).toBeInTheDocument();
  });

  xit("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, /confirm/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, /confirm/i));
    expect(getByText(appointment, /deleting.../i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));
    expect(
      getByText(
        appointment,
        /Sorry we were unable to delete the appointment. Try again./i
      )
    ).toBeInTheDocument();
  });
});
