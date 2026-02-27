import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
//   const GClient_id=import.meta.env.VITE_GOOGLE_CLIENT_ID;
 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    Username: "",
    Email: "",
    password: "",
    address: "",
  });
//   const [googleError, setGoogleError] = useState('');
//   const [scriptLoaded, setScriptLoaded] = useState(false); // Track if Google script is ready

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

//   const handleGoogleSuccess = useCallback(async (response) => {
//     const token = response.credential;
//     try {
//       const res = await api.post(`/api/sign-up/google`, { token });
//       if (res.data.success) {
//         localStorage.setItem('token', res.data.token);
//         alert("Google signup successful!");
//         navigate('/dashboard');
//       } else {
//         setGoogleError('Google signup failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setGoogleError('Google signup failed');
//     }
//   }, [navigate,api]);

//   const handleGoogleError = useCallback(() => {
//     setGoogleError('Google signup cancelled or failed');
//   }, []);

//   const initializeGoogleSignIn = useCallback(() => {
//     if (!window.google?.accounts?.id) {
//       console.warn('Google Identity Services not available');
//       setGoogleError('Google services unavailable. Please refresh the page.');
//       return;
//     }

//     window.google.accounts.id.initialize({
//       client_id: GClient_id,
//       callback: handleGoogleSuccess,
//       auto_select: false,
//       cancel_on_tap_outside: true,
//     });

//     const buttonDiv = document.getElementById('google-signup-button');
//     if (buttonDiv) {
//       window.google.accounts.id.renderButton(buttonDiv, {
//         type: 'standard',
//         theme: 'outline',
//         size: 'large',
//         text: 'signup_with',
//         shape: 'rectangular',
//         logo_alignment: 'left',
//       });
//       setScriptLoaded(true);
//     }
//   }, [handleGoogleSuccess]);

//     // Cleanup: Remove script on unmount (optional)
//     // return () => {
//     //   if (script && script.parentNode) {
//     //     script.parentNode.removeChild(script);
//     //   }
//     // };
// // In useEffect remove duplicate appending
//     // Load Google script once on mount
// useEffect(() => {
//   const existingScript = document.querySelector(
//     'script[src="https://accounts.google.com/gsi/client"]'
//   );

//   if (existingScript) {
//     initializeGoogleSignIn();
//     return;
//   }

//   const script = document.createElement('script');
//   script.src = 'https://accounts.google.com/gsi/client';
//   script.async = true;
//   script.defer = true;
//   script.onload = initializeGoogleSignIn;
//   script.onerror = () => {
//     setGoogleError(
//       'Failed to load Google services. Please check your connection.'
//     );
//   };

//   document.body.appendChild(script);

// }, [initializeGoogleSignIn]);


  const submit = async (e) => {
    e.preventDefault();
    console.log("clicked");
    try {
      if (values.Username === "" || values.Email === "" || values.password === "" || values.address === "") {
        alert("Please fill all the fields");
        return;
      } else {
        const response = await api.post(`/api/sign-up`, values);
        console.log(response.data);
        if (response.status === 200) {
          alert("user created successfully");
          navigate('/login');
        }
      }
    } catch (err) {
      console.error(err);
      alert("sign up failed, please try again");
    }
  };
return (
    <div className='h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center mt-20'>
      <div className='bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-1/2 lg:w-2/6'>
        <p className='text-zinc-200 text-xl'>Sign-up</p>

        {/* ✅ Wrap inputs in a form */}
        <form onSubmit={submit} className='mt-4'>
          <div>
            <label className='text-zinc-400'>Username</label>
            <input
              type='text'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='UserName'
              name='Username'
              value={values.Username}
              onChange={change}
              required
            />
          </div>

          <div className='mt-4'>
            <label className='text-zinc-400'>Email</label>
            <input
              type='email'
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='ex: yourname@gmail.com'
              value={values.Email}
              name='Email'
              onChange={change}
              required
            />
          </div>

          <div className='mt-4 relative'>
            <label className='text-zinc-400'>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none pr-10'
              placeholder='password'
              name='password'
              value={values.password}
              onChange={change}
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-[70%] transform -translate-y-1/2 text-gray-500'
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={30} />
              ) : (
                <AiOutlineEye size={30} />
              )}
            </button>
          </div>

          <div className='mt-4'>
            <label className='text-zinc-400'>Address</label>
            <textarea
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none'
              placeholder='address'
              name='address'
              onChange={change}
              value={values.address}
              required
              rows='3'
            />
          </div>

          <button
            type='submit'
            className='mt-4 w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-zinc-400'
          >
            Sign-up
          </button>
        </form>

        <p className='flex mt-4 items-center justify-center text-zinc-200 font-semibold'>Or</p>

        {/* <div id='google-signup-button' className='mt-4'>
          {!scriptLoaded && <p className='text-zinc-400 text-center'>Loading Google Sign-In...</p>}
        </div> */}

        {/* {googleError && <p className='text-red-500 text-center mt-2'>{googleError}</p>} */}

        <p className='flex mt-4 items-center justify-center text-zinc-500 font-semibold'>
          Already have an Account? &nbsp;
          <Link to='/login' className='hover:text-blue-500'><u>Login</u></Link>
        </p>
      </div>
    </div>
  );
  
}