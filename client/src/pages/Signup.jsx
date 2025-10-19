import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import { getBaseUrl } from '../utils/config.js';
export default function Signup() {
  const BASE_URL=getBaseUrl();
  const [showPassword,setShowPassword]=useState(false);
  const navigate=useNavigate();
  const [values,setValues]=useState({
    Username:"",
    Email:"",
    password:"",
    address:"",

  })
  const change=(e)=>{
    const {name,value}=e.target;
    setValues({...values,[name]:value});
  }
  const submit=async(e)=>{
    e.preventDefault();
    console.log("clicked")
    try{
      if(values.Username==="" || values.Email==="" || values.password==="" || values.address===""){
        alert("Please fill all the fields")
        return;
      }
      // console.log(values)
      else{
          const response = await axios.post(BASE_URL+"/api/sign-up", values);
          console.log(response.data);
          navigate('/login');
          if(response.status==200){
            alert("user created successfully");
            navigate('/login');
          }
      }
      

    }catch(err){
      console.error(err)
      alert("sign up failed, please try again");
    }
  }
 return (
    <div  className='h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center mt-20'>
      <div className='bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-1/2 lg:w-2/6'>
      <p className='text-zinc-200 text-xl'>Sign-up</p>
      <div className='mt-4'>
        <div>

        <label htmlFor='' className='text-zinc-400'>
          Username
        </label>
        <input type='text' className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none' placeholder="UserName" name='Username' value={values.Username} onChange={change} required/>
        </div>
        <div className='mt-4'>

        <label htmlFor='' className='text-zinc-400'>
          Email
        </label>
        <input type='email' className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none' placeholder="ex: yourname@gmail.com" value={values.Email} name='Email' onChange={change} required/>
        </div>
        <div className="mt-4 relative"> {/* Added relative here */}
            <label htmlFor='' className="text-zinc-400">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none pr-10" // Added padding-right
              placeholder="password"
              name="password"
              value={values.password}
              onChange={change}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={30} />
              ) : (
                <AiOutlineEye size={30} />
              )}
            </button>
          </div>
        <div className='mt-4'>

        <label htmlFor='' className='text-zinc-400'>
          Address
        </label>
        <textarea  className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none' placeholder="address" name='address' onChange={change} value={values.address} required rows="3"/>
        </div>
        <div className='mt-4'>
          <button className='w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-zinc-400 ' onChange={submit}>  <Link to='/login' className='hover:text-blue-500'>Sign-up</Link></button>
        </div>
        <p className='flex mt-4 items-center justify-center text-zinc-200 font-semibold'>Or</p>
        <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold'>Already have an Account? &nbsp;
          <Link to='/login' className='hover:text-blue-500'><u>Login</u></Link>
        </p>
      </div>
      </div>
    
    </div>
  )
}
