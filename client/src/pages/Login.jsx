import React, { useState, useEffect } from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {authActions} from  "../store/auth";
import { useDispatch } from 'react-redux';
import api from "../api/axios"

export default function Login() {
  const G_clientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const BASE_URL=getBaseUrl()
  const dispatch=useDispatch();
  const [showPassword,setShowPassword]=useState(false);
  const navigate=useNavigate();
  const [values,setValues]=useState({Username:"",password:""});
  const [googleError, setGoogleError] = useState('');

  const change=(e)=>{
    const {name,value}=e.target;
    setValues({...values,[name]:value});
  }

  const handleGoogleSuccess = async (response) => {
    const token = response.credential;
    try {
      const res = await api.post(`/api/sign-in/google`, { token });
      if (res.data.success) {
        dispatch(authActions.login());
        dispatch(authActions.changeRole(res.data.role));
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        alert("Google login successful");
        navigate("/profile");
      } else {
        setGoogleError('Google login failed');
      }
    } catch (err) {
      console.error(err);
      setGoogleError('Google login failed');
    }
  };

  const handleGoogleError = () => {
    setGoogleError('Google login cancelled or failed');
  };

  useEffect(() => {
    // Load Google Identity Services script if not loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Initialize after script loads
        window.google.accounts.id.initialize({
          client_id:G_clientId,
          callback: handleGoogleSuccess,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          }
        );
      };
    } else {
      // If already loaded, initialize
      window.google.accounts.id.initialize({
        client_id: G_clientId,
        callback: handleGoogleSuccess,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-login-button'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (values.Username === "" || values.password === "") {
      alert("Please fill all the fields");
      return;
    }

    const response = await api.post(`/api/login`, values);

    if (response.status === 200) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(response.data.role));
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      alert("Login successful");
      navigate("/profile");
    }

  } catch (err) {
    console.log(err);
    if (err.response && err.response.status === 400) {
      alert("Invalid username or password");
    } else {
      alert("Something went wrong");
    }
  }
};

  
  return (
   <div  className='h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center mt-20'>
         <div className='bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-1/2 lg:w-2/6'>
         <p className='text-zinc-200 text-xl'>Login</p>
         <div className='mt-4'>
           <div>
   
           <label htmlFor=''className='text-zinc-400'>
             Username
           </label>
           <input type='text' className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none' placeholder="UserName" name='Username'value={values.Username} onChange={change} required/>
           </div>
          
           <div className="mt-4 relative"> {/* Added relative here */}
               <label htmlFor="password" className="text-zinc-400">
                 Password
               </label>
               <input
                 type={showPassword ? "text" : "password"}
                 className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none pr-10" // Added padding-right
                 placeholder="password"
                 name="password" value={values.password} onChange={change} 
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
             <button className='w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-zinc-400 ' onClick={handleSubmit}>Login</button>
           </div>
           <p className='flex mt-4 items-center justify-center text-zinc-200 font-semibold'>Or</p>
           <div id="google-login-button" className="mt-4"></div>
           {googleError && <p className="text-red-500 text-center mt-2">{googleError}</p>}
           <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold'>create a new account? &nbsp;
             <Link to='/sign-up' className='hover:text-blue-500'><u>SignUp</u></Link>
           </p>
         </div>
         </div>
       
       </div>
  )
}