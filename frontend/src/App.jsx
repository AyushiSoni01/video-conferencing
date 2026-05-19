import React from 'react'
import { Route, Routes } from "react-router-dom"
import Lobby from './screens/Lobby'
import Room from './screens/Room'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Lobby />} />
      <Route path='/room/:roomid' element={<Room />} />
    </Routes>
    // <h1 className="text-green-500 text-3xl">Tailwind Working</h1>
  )
}

export default App
