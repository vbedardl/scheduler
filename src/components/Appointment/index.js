import React from 'react'

import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import useVisualMode from 'hooks/useVisualMode'
import Form from 'components/Appointment/Form'
import Status from 'components/Appointment/Status'
import Confirm from 'components/Appointment/Confirm'

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";


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

  //OPEN CONFIRM BOX FOR DELETE
  function ondelete(id){
    transition(CONFIRM)
  }

  //CONFIRM THE DELETION AND MAKE THE REQUEST
  function realDelete(id){
    transition(DELETING)
    props.cancelInterview(id)
    .then(() => transition('EMPTY'))
    .catch(e => console.log('error in on delete:',e))
  }

  //CANCEL THE DELETION
  function cancelDelete(){
    back()
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
        onDelete={() => ondelete()}
        />
      )}
      {mode === CREATE && (
        <Form onCancel={() => back()} interviewers={props.interviewers} onSave={save} />
      )}
      {mode === SAVING && (
        <Status message='Saving...' />
      )}
      {mode === DELETING && (
        <Status message='Deleting...' />
      )}
      {mode === CONFIRM && (
        <Confirm onCancel={()=>cancelDelete()} onConfirm={() => realDelete(props.id)} />
      )}
    </article>
  )
}