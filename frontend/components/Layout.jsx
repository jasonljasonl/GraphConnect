import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="max-w-3xl mx-auto min-h-screen">
      {children}
    </div>
  )
}

export default Layout