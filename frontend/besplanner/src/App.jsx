import { useState } from 'react'
import Navbar from './componets/Navbar'
import Main from './componets/Main'
import Onboarding from './componets/Onboarding'
import Tax from './componets/Tax'
import SignUp from './componets/sign-up'
import Guildplan1 from './componets/guildplan1'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './componets/dashboard'


function App() {
  return (
    <Router>
      <>       
        <Navbar/>
          <Routes>
            <Route path="/" element={<Main />} /> {/*route to the main page*/}
            <Route path="/onbroading" element={<Onboarding />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/callback" element={<SignUp />} />
            <Route path="/guild" element={<Guildplan1 />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Add more routes here as needed */}
          </Routes>
      </>
    </Router>

  )
}

export default App
