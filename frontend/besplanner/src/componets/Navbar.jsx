import React, { useEffect,useState } from 'react'
import { Link ,useLocation} from 'react-router-dom'
import './nav-bar.css'
import { supabase } from './sign-up'

function Navbar() {
  const [session, setSession] = useState(null)
  const location = useLocation()

  async function signOut() {
  const { error } = await supabase.auth.signOut()
  }

  useEffect(() => {
    // Check session on component mount and route changes
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }

    checkSession()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [location.pathname]) 

  const authcheck = () => {
    //get the token if auth is done
    if (session) {
    return (
      <ul>
        <li><Link to='/'>dashboard</Link></li>
        <li><a onClick={signOut}>log out</a></li>
      </ul>  
    )
    }
    else {
      return (
        <ul>
          <li><Link to='/'>home</Link></li>
          <li><Link to='/signup'>login / sign in</Link></li>
        </ul>
      )
    }
  }

  return (<> 

    <nav className='nav-bar'>
        <img src="/" alt="logo"/>
        {authcheck()}
       {/* { <ul>
            <li>home</li>
            <li>Log in</li>
            <li>Sign in</li>
        </ul>} */}
    </nav>
    </>

  )
}

export default Navbar;