import { useState } from 'react'
import Navbar from './componets/Navbar'
import Main from './componets/Main'
import Onboarding from './componets/Onboarding'
import Tax from './componets/Tax'
import SignUp from './componets/sign-up'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


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

            {/* Add more routes here as needed */}
          </Routes>
      </>
    </Router>

  )
}

export default App
