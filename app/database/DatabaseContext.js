import React, { useState } from 'react'

const DatabaseContext = React.createContext([{}, () => {}])

const DatabaseContextProvider = props => {
  const [state, setState] = useState(0)
  const { children } = props
  return <DatabaseContext.Provider value={[state, setState]}>{children}</DatabaseContext.Provider>
}

export { DatabaseContext, DatabaseContextProvider }
