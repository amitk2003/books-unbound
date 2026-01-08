import React,{useEffect,useState} from 'react'
import Sidebar from '../components/Profile/Sidebar.jsx'
import {Outlet} from 'react-router-dom'
// import { useSelector } from 'react-redux'
import axios from 'axios'
import Loader from '../components/Loader/Loader.jsx'
import { getBaseUrl } from '../utils/config.js';
// const BASE_URL=getBaseUrl()
export default function Profile() {
  // const isLoggedIn= useSelector();
  const [profile,setProfile]=useState(null);
  const headers={
    "id":localStorage.getItem("id"),
    "Authorization":`Bearer ${localStorage.getItem("token")}`
  };
   useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/get-userInfo", {
        headers: {
          "id": localStorage.getItem("id"),
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      setProfile(response.data); // ✔ DIRECT data, not response.data.data
    } catch (err) {
      console.error(err);
    }
  };

  fetchProfile();
}, []);

  return (
    <div className='bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-screen py-15 gap-8'>
      
      {!profile && (<div className=' w-full flex items-center justify-center'><Loader/></div>)}
      {profile &&<>
      <div className='w-full md:w-2/6'><Sidebar data={profile}/></div>
      <div className='w-full md:w-2/6'><Outlet/></div>
      </> }
      
      
      
      
      
      
    </div>
  )
}
