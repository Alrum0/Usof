import Logov2 from '../assets/Icon/Logo.png';

import HomeIcon from '../assets/Icon/home-icon.svg?react';
import SearchIcon from '../assets/Icon/search-icon.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import LikeIcon from '../assets/Icon/like-icon.svg?react';
import ProfileIcon from '../assets/Icon/profile-icon.svg?react';
import MoreVertical from '../assets/Icon/more-vertical-icon.svg?react';
import AdminIcon from '../assets/Icon/star-admin-icon.svg?react';

import AuthRequiredModel from '../components/AuthRequiredModel';

import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import {
  ADMIN_ROUTE,
  MAIN_ROUTE,
  PROFILE_ROUTE,
  SEARCH_ROUTE,
} from '../utils/consts';

export default function Header() {
  const [isAuthModelOpen, setIsAuthModelOpen] = useState(false);
  const isAdmin = false;
  const isAuth = false;

  const handleProtectedAction = () => {
    if (!isAuth) {
      setIsAuthModelOpen(true);
    }
  };

  return (
    <header className='fixed left-0 top-0 w-20 h-screen flex flex-col justify-between items-center py-6 transition-all duration-300 z-50'>
      <a href={MAIN_ROUTE}>
        <img
          src={Logov2}
          alt='Usof Logo'
          className='w-16 h-16 hover:scale-110 transition-all duration-300'
        />
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
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[var(--color-background-secondary)] ${
                  isActive ? 'text-white' : 'text-[#4d4d4d]'
                }`
              }
            >
              <SearchIcon className='w-7 h-7 transition-all duration-200' />
            </NavLink>
          </li>
          <li>
            <button
              className='group rounded-lg bg-[var(--color-background-secondary)] px-3.5 py-2 transition-all duration-200 cursor-pointer'
              onClick={handleProtectedAction}
            >
              <PlusIcon className='w-7 h-7 text-[#4d4d4d] group-hover:text-white transition-all duration-200 ' />
            </button>
          </li>
          <li>
            <NavLink
              onClick={(e) => {
                if (!isAuth) {
                  e.preventDefault();
                  handleProtectedAction();
                }
              }}
              to='/admin'
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[var(--color-background-secondary)] ${
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
              onClick={(e) => {
                if (!isAuth) {
                  e.preventDefault();
                  handleProtectedAction();
                }
              }}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[var(--color-background-secondary)] ${
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
                  `flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[var(--color-background-secondary)] ${
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
      <button className='group rounded-lg hover:bg-[var(--color-background-secondary)] px-3.5 py-2 transition-all duration-200 cursor-pointer'>
        <MoreVertical className='w-7 h-7 text-[#4d4d4d] group-hover:text-white transition-all duration-200' />
      </button>

      <AuthRequiredModel
        isOpen={isAuthModelOpen}
        onClose={() => setIsAuthModelOpen(false)}
      />
    </header>
  );
}
