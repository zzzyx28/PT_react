import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import AppRoutes from './routes/AppRoutes'

export default function AppWrapper() {
  const location = useLocation()

  // 不显示 Navbar 的路径
  const hideNavbarPaths = ['/', '/register']
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <AppRoutes />
    </>
  )
}
