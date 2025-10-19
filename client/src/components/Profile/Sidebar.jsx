import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRightFromBracket, FaBars } from 'react-icons/fa6';

const Sidebar = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='bg-zinc-800 p-4 rounded flex flex-col items-center justify-center w-full lg:w-64'>
      <div className='flex items-center flex-col justify-center w-full'>
        <img
          src={data?.avatar || '/default-avatar.png'}
          alt="User Avatar"
          className='h-24 w-24 mx-auto rounded-full'
        />
        <p className='mt-3 text-lg text-zinc-300 font-semibold'>{data?.Username || "Username"}</p>
        <p className='mt-1 text-sm text-zinc-300 font-semibold'>{data?.Email || "email@example.com"}</p>
        <div className='w-full bg-zinc-500 h-0.5 hidden lg:block mt-2'></div>
      </div>

      {/* Menu Toggle for Mobile */}
      <button onClick={toggleMenu} className='lg:hidden mt-4 text-zinc-100 font-semibold flex items-center justify-center w-full'>
        <FaBars className='mr-2' /> Menu
      </button>

      {/* Links Section */}
      <div className={`w-full flex-col items-center justify-center ${isOpen ? 'flex' : 'hidden'} lg:flex mt-3`}>
        <Link to="/profile" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-700 rounded transition-all duration-300 block">
          Favourites
        </Link>
        <Link to="/profile/orderHistory" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-700 rounded transition-all duration-300 block">
          Order History
        </Link>
        <Link to="/profile/settings" className="text-zinc-100 font-semibold w-full py-2 text-center hover:bg-zinc-700 rounded transition-all duration-300 block">
          Settings
        </Link>
      </div>

      <button onClick={handleLogout} className='bg-zinc-900 w-full mt-4 text-white font-semibold flex items-center justify-between hover:bg-zinc-700 transition-all duration-300 py-2 px-4 rounded'>
        Log Out <FaArrowRightFromBracket className='ml-2' />
      </button>
    </div>
  );
};

export default Sidebar;