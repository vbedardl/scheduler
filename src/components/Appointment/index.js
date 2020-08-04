import React from 'react'

import 'components/Appointment/styles.scss'
import Header from 'components/Appointment/Header'
import Show from 'components/Appointment/Show'
import Empty from 'components/Appointment/Empty'

export default function Appointment(props) {
  const {interview} = props

  return(
    <article className='appointment'>
      <Header time={props.time} />
      {props.interview ? <Show interviewer={interview.interviewer} student={interview.student} /> : <Empty />}
    </article>
  )
}