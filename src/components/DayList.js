import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const day = props.days.map((day) => {
    return (
      <DayListItem
        setDay={props.setDay}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        key={day.name}
      />
    );
  });

  return <ul>{day}</ul>;
}
