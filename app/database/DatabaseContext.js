import React, { useState } from 'react'

const DatabaseContext = React.createContext([{}, () => {}])

const DatabaseContextProvider = (props) => {
  const [state, setState] = useState(0)
  const { children } = props

  const updateDatabaseState = () => {
    setState(state + 1)
  }

  return (
    <DatabaseContext.Provider value={{ updateDatabaseState: updateDatabaseState }}>
      {console.log(state)}
      {children}
    </DatabaseContext.Provider>
  )
}

export { DatabaseContext, DatabaseContextProvider }
