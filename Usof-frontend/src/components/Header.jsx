import SearchIcon from '../assets/Icon/search-icon.svg';
import ProfileIcon from '../assets/Icon/profile-icon.svg';
import LikeIcon from '../assets/Icon/like-icon.svg';
import PlusIcon from '../assets/Icon/plus-icon.svg';
import HomeIcon from '../assets/Icon/home-icon.svg';
import Logo from '../assets/Icon/logo.svg';
import MoreVertical from '../assets/Icon/more-vertical-icon.svg';
import { MAIN_ROUTE, PROFILE_ROUTE, SEARCH_ROUTE } from '../utils/consts';

//bg-gray-50

export default function Header() {
  return (
    <header className=' w-20 h-screen flex flex-col justify-between items-center py-6 transition-all duration-300 overflow-hidden relative'>
      <img src={Logo} alt='Usof Logo' className='w-12 h-12' />
      <nav className='-mt-12 '>
        <ul className='flex-col gap-5 flex '>
          <li className='rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200'>
            <a href={MAIN_ROUTE}>
              <img
                src={HomeIcon}
                alt='Home Icon'
                className='w-9 h-9 unselectable'
                draggable='false'
              />
            </a>
          </li>
          <li className='rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200'>
            <a href={SEARCH_ROUTE}>
              <img
                src={SearchIcon}
                alt='Search Icon'
                className='w-9 h-9 unselectable'
                draggable='false'
              />
            </a>
          </li>
          <li className='rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200'>
            <button>
              <img
                src={PlusIcon}
                alt='Plus Icon'
                className='w-9 h-9 unselectable'
                draggable='false'
              />
            </button>
          </li>
          <li className='rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200'>
            <img
              src={LikeIcon}
              alt='Like Icon'
              className='w-9 h-9 unselectable'
              draggable='false'
            />
          </li>
          <li className='rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200'>
            <a href={PROFILE_ROUTE}>
              <img
                src={ProfileIcon}
                alt='Profile Icon'
                className='w-9 h-9 unselectable'
                draggable='false'
              />
            </a>
          </li>
        </ul>
      </nav>
      <button className='rounded-lg hover:bg-[#1d1d1d] px-3.5 py-2 transition-all duration-200'>
        <img
          src={MoreVertical}
          alt='More Options'
          className='w-9 h-9 unselectable'
          draggable='false'
        />
      </button>
    </header>
  );
}
