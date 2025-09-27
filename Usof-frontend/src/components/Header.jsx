import Logo from '../assets/Icon/logo.svg';

import HomeIcon from '../assets/Icon/home-icon.svg?react';
import SearchIcon from '../assets/Icon/search-icon.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import LikeIcon from '../assets/Icon/like-icon.svg?react';
import ProfileIcon from '../assets/Icon/profile-icon.svg?react';
import MoreVertical from '../assets/Icon/more-vertical-icon.svg?react';
import AdminIcon from '../assets/Icon/star-admin-icon.svg?react';

import {
  ADMIN_ROUTE,
  MAIN_ROUTE,
  PROFILE_ROUTE,
  SEARCH_ROUTE,
} from '../utils/consts';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const isAdmin = false;

  return (
    <header className='w-20 h-screen flex flex-col justify-between items-center py-6 transition-all duration-300 overflow-hidden relative'>
      <a href={MAIN_ROUTE}>
        <img src={Logo} alt='Usof Logo' className='w-12 h-12' />
      </a>
      <nav className='-mt-12 '>
        <ul className='flex-col gap-4 flex '>
          <li>
            <NavLink
              to={MAIN_ROUTE}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[#1d1d1d] ${
                  isActive ? ' text-white' : 'text-[#4d4d4d]'
                }`
              }
            >
              {({ isActive }) => (
                <HomeIcon
                  className='w-7 h-7 transition-all duration-200'
                  fill={isActive ? 'currentColor' : 'none'}
                />
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={SEARCH_ROUTE}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[#1d1d1d] ${
                  isActive ? 'text-white' : 'text-[#4d4d4d]'
                }`
              }
            >
              <SearchIcon className='w-7 h-7 transition-all duration-200' />
            </NavLink>
          </li>
          <li>
            <button className='group rounded-lg bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200 cursor-pointer'>
              <PlusIcon className='w-7 h-7 text-[#4d4d4d] group-hover:text-white transition-all duration-200 ' />
            </button>
          </li>
          <li>
            <NavLink
              to='/admin'
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[#1d1d1d] ${
                  isActive ? ' text-white' : 'text-[#4d4d4d]'
                }`
              }
            >
              {({ isActive }) => (
                <LikeIcon
                  className='w-7 h-7 transition-all duration-200'
                  fill={isActive ? 'currentColor' : 'none'}
                />
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={PROFILE_ROUTE + '/1'}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[#1d1d1d] ${
                  isActive ? ' text-white' : 'text-[#4d4d4d]'
                }`
              }
            >
              {({ isActive }) => (
                <ProfileIcon
                  className={`w-7 h-7 transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-[#4d4d4d]'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                />
              )}
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink
                to={ADMIN_ROUTE}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[#1d1d1d] ${
                    isActive ? ' text-white' : 'text-[#4d4d4d]'
                  }`
                }
              >
                <AdminIcon className='w-7 h-7 transition-all duration-200' />
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      <button className='group rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200 cursor-pointer'>
        <MoreVertical className='w-7 h-7 text-[#4d4d4d] group-hover:text-white transition-all duration-200' />
      </button>
    </header>
  );
}
