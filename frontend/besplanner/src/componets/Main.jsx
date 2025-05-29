import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getuid } from './getuid'

function Main() {

  
  const uid =getuid()
  console.log(uid)

  
  return (<>
    <div className='main-continer'>
      <Link to='/onbroading'>
        <button>build a business</button>
      </Link>
    </div>
  </>
  )
}

export default Main