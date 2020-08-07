import React, { useEffect } from 'react'

import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'
import useVisualMode from 'hooks/useVisualMode'
import Form from 'components/Appointment/Form'
import Status from 'components/Appointment/Status'
import Confirm from 'components/Appointment/Confirm'
import Error from 'components/Appointment/Error'

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


export default function Appointment(props) {
  const {interview} = props

  const {mode, transition, back} = useVisualMode(
    interview ? SHOW : EMPTY
  )

  useEffect(() => {
    if (interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [interview, transition, mode]);

   
  function save(name, interviewer){
    if(!interviewer || !name){
      transition(ERROR_SAVE)
      return
    }
    const interview = {
      student:name,
      interviewer
    }
    transition(SAVING)

    props
      .bookInterview(props.id, interview)
      .then(() => transition('SHOW'))
      .catch((e) => transition('ERROR_SAVE', true))
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
    .catch((e) => transition('ERROR_DELETE', true))
  }

  //CANCEL THE DELETION
  function cancelDelete(){
    back()
  }

  function edit(){
    transition('EDIT')
  }

  return(
    <article className='appointment'>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition('CREATE')} />}
      {mode === SHOW && interview && (
        <Show
        id={props.id}
        interviewer={interview.interviewer} 
        student={interview.student}
        onEdit={() => edit()}
        onDelete={() => ondelete()}
        />
      )}
      {mode === EDIT && (
        <Form 
        onCancel={() => back()} 
        interviewers={props.interviewers} 
        onSave={save} 
        id={props.id}
        interviewer={interview.interviewer.id} 
        name={interview.student}
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
      {mode === ERROR_DELETE && (
        <Error message={'Sorry we were unable to delete the appointment. Try again.'} onClose={() => back()} />
      )}
      {mode === ERROR_SAVE && (
        <Error message={'Sorry we were unable to save the appointment. Try again.'} onClose={() => back()} />
      )}
    </article>
  )
}