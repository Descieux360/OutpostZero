import { Outlet, useLocation } from 'react-router'
import { NavBar } from '../components/NavBar'

/** Keep the welcome screen immersive; show navigation throughout the learning and mission flow. */
export function AppLayout() {
  const { pathname } = useLocation()
  return (
    <>
      {pathname !== '/' && <NavBar />}
      <Outlet />
    </>
  )
}
