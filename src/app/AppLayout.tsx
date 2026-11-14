import { Outlet } from 'react-router'
import { NavBar } from '../components/NavBar'

/** Wraps every route so the navbar is available on every page, including "not found". */
export function AppLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}