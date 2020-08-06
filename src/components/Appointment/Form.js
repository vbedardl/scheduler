import React, { useState } from 'react'
import Button from 'components/Button'
import InterviewerList from 'components/InterviewerList'

export default function Form(props) {
const [name, setName] = useState(props.name || '')
const [interviewer, setInterviewer] = useState(props.interviewer || null)


const reset = () => {
  setName('')
  setInterviewer(null)
}
const cancel = () => {
  props.onCancel()
  reset()
}
const save = () => {
  props.onSave(name, interviewer)
}

  return(
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            /*
              This must be a controlled component
            */
          />
        </form>
        <InterviewerList 
        interviewer={interviewer} 
        interviewers={props.interviewers} 
        value={interviewer} 
        setInterviewer={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={save}>Save</Button>
        </section>
      </section>
    </main>
  )
}