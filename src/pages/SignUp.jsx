import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const SignUp = () => {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:5000/register', {name,email,password})
        .then(result=>{console.log(result)
          navigate('/login')  

        })
        .catch(err=>console.log(err))
    }
  return (
    <div className="w-100 h-100  d-flex flex-column mt-5 align-items-center justify-content-center">
      <h2>Register Yourself</h2>
      <div className="d-flex border rounded-lg mt-5 shadow-lg w-75 h-100 justify-content-between gap-32">
      <form onSubmit={handleSubmit}>
      <div className="form-group">
    <label htmlFor="exampleInputName">Name</label>
    <input type="text" className="form-control" id="exampleInputName"
    onChange={(e)=>{
        setName(e.target.value);
    }}/>
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
    onChange={(e)=>{
        setEmail(e.target.value);
    }}
    />
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div className="form-group">
    <label htmlFor="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1"
    onChange={(e)=>{
        setPassword(e.target.value);
    }}
    />
  </div>
  
 <div className="d-flex mb-6 items-center gap-5">
 <button type="submit" className="btn w-25 btn-primary">Submit</button>
 <p >Already have an account,<Link to="/login"style={{marginLeft:"5px",marginBottom:"2px"}}>Login</Link></p>
 </div>
</form>
<img style={{width:"400px"}} src="/images/form.svg"/>
      </div>
    </div>
  )
}

export default SignUp
