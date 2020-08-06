import React from 'react'

import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import useVisualMode from 'hooks/useVisualMode'
import Form from 'components/Appointment/Form'
import Status from 'components/Appointment/Status'

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";


export default function Appointment(props) {
  const {interview} = props

  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  function save(name, interviewer){
    const interview = {
      student:name,
      interviewer
    }
    transition(SAVING)
    props.bookInterview(props.id, interview)
    .then(() => transition('SHOW'))

  }

  function ondelete(id){
    transition(SAVING)
    props.cancelInterview(id)
    .then(() => transition('EMPTY'))
    .catch(e => console.log('error in on delete:',e))
  }

  return(
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition('CREATE')} />}
      {mode === SHOW && (
        <Show
        id={props.id}
        interviewer={interview.interviewer} 
        student={interview.student}
        onDelete={() => ondelete(props.id)}
        />
      )}
      {mode === CREATE && (
        <Form onCancel={() => back()} interviewers={props.interviewers} onSave={save} />
      )}
      {mode === SAVING && (
        <Status message='Saving...' />
      )}
    </article>
  )
}