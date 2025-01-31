import { NavLink } from 'react-router'

export default function NotFound() {
  return (
    <div className='col'>
      <div className='about-page mt-5'>
        <h3 className='mb-1'>404 Not Found</h3>
        <p>The page you are looking for does not exist. Go to <NavLink to="/">Home</NavLink> or <NavLink to="/login">Login</NavLink>.</p>
      </div>
    </div>
  )
}
