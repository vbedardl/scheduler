import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";
import PropTypes from "prop-types";

export default function InterviewerList(props) {
  InterviewerList.propTypes = {
    interviewer: PropTypes.number,
    setInterviewer: PropTypes.func.isRequired,
  };

  //INTERVIEWERS SNIPPET FROM INTERVIEWERS DATA MAPPING
  const interviewersMap = props.interviewers.map((elm) => {
    return (
      <InterviewerListItem
        key={elm.id}
        name={elm.name}
        avatar={elm.avatar}
        setInterviewer={(event) => props.setInterviewer(elm.id)}
        selected={elm.id === props.interviewer}
        interviewer={props.interviewer}
      />
    );
  });
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersMap}</ul>
    </section>
  );
}
