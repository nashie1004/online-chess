import React from 'react'
import { NavLink } from 'react-router'

export default function NotFound() {
  return (
    <div className='col'>
      <h3 className='mt-5'>404 Not Found</h3>
      <p>The page you are looking for does not exist. Go to <NavLink to="/">Home</NavLink> or <NavLink to="/login">Login</NavLink>.</p>
    </div>
  )
}
