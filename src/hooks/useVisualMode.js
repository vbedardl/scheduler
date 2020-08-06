import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial])

  function transition(newMode, replace = false){
    if(replace){
      history.pop()
      setHistory([...history, mode])
    }else{
      setHistory([...history, newMode])
    }
    setMode(newMode)
  }

  function back(){
    if(history.length > 1){
      history.pop()
    }
    const lastElm = history[history.length-1]
    setMode(lastElm)
  }
  return { mode, transition, back};
}