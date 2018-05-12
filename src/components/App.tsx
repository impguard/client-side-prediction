import * as React from 'react'

interface AppProps {
  message: string
}

const App = (props: AppProps) => {
  return <div>Hello World! {props.message} </div>
}

export default App
