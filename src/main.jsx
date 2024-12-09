import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ProSidebarProvider } from 'react-pro-sidebar'
import {BrowserRouter} from 'react-router-dom'
import {GirafProvider} from './giraff'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <ProSidebarProvider>
      <GirafProvider>
      <App/>
      </GirafProvider>
    </ProSidebarProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
