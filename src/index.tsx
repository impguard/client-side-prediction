import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Game from './components/Game'
import './style.css'

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<Game />, root)
