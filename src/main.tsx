import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PosProvider } from './PosContext'
import './styles.css'
import './motion.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><PosProvider><App /></PosProvider></React.StrictMode>,
)
