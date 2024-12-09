import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import './assets/styles/global.scss'
import './assets/styles/components.scss'
import './App.css'
import ScrollTop from './components/scrolltop.'
import Routes from './routes'
import { GirafProvider } from './giraff'
function App() {
  return (
    <ScrollTop>
      <GirafProvider>
        <Routes />
      </GirafProvider>
    </ScrollTop>
  )
}

export default App
