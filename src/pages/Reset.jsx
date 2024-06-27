import React from 'react'
import { Link } from 'react-router-dom'

const Reset = () => {
  return (
    <div className="w-100  d-flex flex-column justify-content-center shadow-lg align-items-center"style={{height:"100vh"}}>
      <h2>A Recovery Email has been sent to your registered email.</h2>
      <p>If you dont have an account <Link to="/register">Create an Account</Link></p>
    </div>
  )
}

export default Reset
