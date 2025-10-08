import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

const Sidebar = ({ data }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className='bg-zinc-800 p-3 rounded flex flex-col items-center justify-center'>
      <div className='flex items-center flex-col justify-center'>
        <img
          src={data?.avatar || '/default-avatar.png'}
          alt="User Avatar"
          className='h-[12vh] mx-auto rounded-full'
        />
        <p className='mt-3 text-xl text-zinc-300 font-semibold'>{data?.Username || "Username"}</p>
        <p className='mt-1 text-normal text-zinc-300 font-semibold'>{data?.Email || "email@example.com"}</p>
        <div className='w-full bg-zinc-500 py-0.5 hidden lg:block mt-2'></div>
      </div>

      <div className='w-full flex-col items-center justify-center hidden lg:flex mt-3'>
        <Link to="/profile" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-500 rounded transition-all duration-300">
          Favourites
        </Link>
        <Link to="/profile/orderHistory" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300">
          Order History
        </Link>
        <Link to="/profile/settings" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-900 rounded transition-all duration-300">
          Settings
        </Link>
      </div>

      <button onClick={handleLogout} className='bg-zinc-900 w-3/4 lg:w-full mt-4 lg:mt-0 text-white font-semibold flex items-center justify-between hover:bg-zinc-700 transition-all duration-300'>
        Log Out <FaArrowRightFromBracket className='ms-4' />
      </button>
    </div>
  );
};

export default Sidebar;
