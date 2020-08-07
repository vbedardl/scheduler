import React from 'react'
import "components/InterviewerList.scss";
import InterviewerListItem from 'components/InterviewerListItem'



export default function InterviewerList(props) {

  let int = props.interviewers.map(elm => {
    return (
      <li>
        <InterviewerListItem
          key={elm.id}
          name={elm.name}
          avatar={elm.avatar}
          setInterviewer={(event) => props.setInterviewer(elm.id)}
          selected={elm.id===props.interviewer}
          interviewer={props.interviewer}
        />
      </li>
    )
  }) 
  return(
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {int}
      </ul>
    </section>

  )
}