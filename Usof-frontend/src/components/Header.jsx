import Logo from '../assets/Icon/Logo.png';

import HomeIcon from '../assets/Icon/home-icon.svg?react';
import SearchIcon from '../assets/Icon/search-icon.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import LikeIcon from '../assets/Icon/like-icon.svg?react';
import ProfileIcon from '../assets/Icon/profile-icon.svg?react';
import MoreVertical from '../assets/Icon/more-vertical-icon.svg?react';
import AdminIcon from '../assets/Icon/star-admin-icon.svg?react';
import Star from '../assets/Icon/stars2.png';

import AuthRequiredModel from '../components/AuthRequiredModel';
import CreatePostModel from './CreatePostModel';
import StarsModal from './StarsModal';

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';

import {
  ADMIN_ROUTE,
  MAIN_ROUTE,
  PROFILE_ROUTE,
  SEARCH_ROUTE,
  NOTIFICATIONS_ROUTE,
} from '../utils/consts';

export default function Header() {
  const [isAuthModelOpen, setIsAuthModelOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExitModelOpen, setIsExitModelOpen] = useState(false);
  const [isStarsModelOpen, setIsStarsModelOpen] = useState(false);

  const isAdmin = useSelector((state) => state.auth.user?.role === 'ADMIN');
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userId = useSelector((state) => state.auth.user?.id);

  const dispatch = useDispatch();

  const handleProtectedAction = () => {
    if (!isAuth) {
      setIsAuthModelOpen(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleStarsAction = () => {
    setIsStarsModelOpen(true);
    setIsExitModelOpen(false);
  };

  return (
    <>
      <CreatePostModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {/* Desktop Header - Vertical Left */}
      <header className='hidden md:fixed md:flex md:left-0 md:top-0 md:w-20 md:h-screen md:flex-col md:justify-between md:items-center md:py-6 transition-all duration-300 z-40'>
        <a href={MAIN_ROUTE}>
          <img
            src={Logo}
            alt='Usof Logo'
            className='w-16 h-16 hover:scale-110 transition-all duration-300'
          />
        </a>
        <nav className='-mt-12'>
          <ul className='flex-col gap-4 flex'>
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
              {isAuth ? (
                <NavLink
                  to={NOTIFICATIONS_ROUTE}
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
              ) : (
                <button
                  className='flex items-center rounded-lg px-3.5 py-2 transition-all duration-200 hover:bg-[var(--color-background-secondary)] text-[#4d4d4d]'
                  onClick={handleProtectedAction}
                >
                  <LikeIcon className='w-7 h-7 transition-all duration-200' />
                </button>
              )}
            </li>
            <li>
              <NavLink
                to={PROFILE_ROUTE + `/${userId}`}
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
        <button
          onClick={() => setIsExitModelOpen((prev) => !prev)}
          className='group rounded-lg hover:bg-[var(--color-background-secondary)] px-3.5 py-2 transition-all duration-200 cursor-pointer realative'
        >
          <MoreVertical className='w-7 h-7 text-[#4d4d4d] group-hover:text-white transition-all duration-200' />
        </button>
        {isExitModelOpen && (
          <div className='absolute bottom-12 left-20 mt-12 w-48 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-lg shadow-lg px-2'>
            <ul className='py-2'>
              <li className='hover:bg-[var(--color-background-secondary)] rounded-lg'>
                <button
                  className='flex justify-center items-center w-full px-4 py-2 text-sm text-white gap-2'
                  onClick={handleStarsAction}
                >
                  <img src={Star} alt='Star' className='w-6 h-6' />
                  <span className='ml-2'>Мої зірки</span>
                </button>
              </li>
              <li className='hover:bg-[var(--color-background-secondary)] rounded-lg'>
                <button
                  onClick={() => {
                    dispatch(logout());
                    setIsExitModelOpen(false);
                  }}
                  className='block w-full px-4 py-2 text-sm text-red-600 text-center'
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Mobile Header - Horizontal Bottom */}
      <header className='md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-background-secondary)] border-t border-[var(--color-border)] z-40'>
        <nav className='px-2 py-3'>
          <ul className='flex justify-around items-center gap-2'>
            <li>
              <NavLink
                to={MAIN_ROUTE}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                    isActive ? 'text-white bg-[#1d1d1d]' : 'text-[#4d4d4d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <HomeIcon
                    className='w-6 h-6 transition-all duration-200'
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={SEARCH_ROUTE}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-[var(--color-background-secondary)]'
                      : 'text-[#4d4d4d]'
                  }`
                }
              >
                <SearchIcon className='w-6 h-6 transition-all duration-200' />
              </NavLink>
            </li>
            <li>
              <button
                className='group rounded-lg bg-[#1d1d1d] px-3 py-2 transition-all duration-200 cursor-pointer'
                onClick={handleProtectedAction}
              >
                <PlusIcon className='w-6 h-6 text-[#4d4d4d] group-hover:text-white transition-all duration-200' />
              </button>
            </li>
            <li>
              {isAuth ? (
                <NavLink
                  to={NOTIFICATIONS_ROUTE}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-[#4d4d4d]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <LikeIcon
                      className='w-6 h-6 transition-all duration-200'
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                  )}
                </NavLink>
              ) : (
                <button
                  className='flex items-center rounded-lg px-3 py-2 transition-all duration-200 text-[#4d4d4d]'
                  onClick={handleProtectedAction}
                >
                  <LikeIcon className='w-6 h-6 transition-all duration-200' />
                </button>
              )}
            </li>
            <li>
              <NavLink
                to={PROFILE_ROUTE + `/${userId}`}
                onClick={(e) => {
                  if (!isAuth) {
                    e.preventDefault();
                    handleProtectedAction();
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-[#4d4d4d]'
                  }`
                }
              >
                {({ isActive }) => (
                  <ProfileIcon
                    className={`w-6 h-6 transition-all duration-200 ${
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
                    `flex items-center rounded-lg px-3 py-2 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-[#4d4d4d]'
                    }`
                  }
                >
                  <AdminIcon className='w-6 h-6 transition-all duration-200' />
                </NavLink>
              </li>
            )}
            <li>
              <button
                onClick={() => setIsExitModelOpen((prev) => !prev)}
                className='group rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer relative'
              >
                <MoreVertical className='w-6 h-6 text-[#4d4d4d] group-hover:text-white transition-all duration-200' />
              </button>
              {isExitModelOpen && (
                <div className='absolute bottom-16 right-2 w-48 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-lg shadow-lg px-2'>
                  <ul className='py-2'>
                    <li className='hover:bg-[var(--color-background-secondary)] rounded-lg'>
                      <button
                        className='flex justify-center items-center w-full px-4 py-2 text-sm text-white gap-2'
                        onClick={handleStarsAction}
                      >
                        <img src={Star} alt='Star' className='w-6 h-6' />
                        <span className='ml-2'>Мої зірки</span>
                      </button>
                    </li>
                    <li className='hover:bg-[var(--color-background-secondary)] rounded-lg'>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsExitModelOpen(false);
                        }}
                        className='block w-full px-4 py-2 text-sm text-red-600 text-center'
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </header>

      <AuthRequiredModel
        isOpen={isAuthModelOpen}
        onClose={() => setIsAuthModelOpen(false)}
      />
      <StarsModal
        isOpen={isStarsModelOpen}
        onClose={() => setIsStarsModelOpen(false)}
      />
    </>
  );
}
