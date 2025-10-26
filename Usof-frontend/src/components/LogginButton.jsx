import { NavLink } from 'react-router-dom';
import { REGISTER_ROUTE } from '../utils/consts';

export default function LoginButton() {
  const isAuth = true;
  return (
    <>
      {!isAuth && (
        <div className='fixed right-0 top-0 z-50'>
          <NavLink
            to={REGISTER_ROUTE}
            className='absolute right-4 md:right-8 top-4 md:top-8 bg-white px-3 md:px-3.5 py-1.5 md:py-2 rounded-lg font-semibold cursor-pointer text-sm md:text-base'
          >
            Увійти
          </NavLink>
        </div>
      )}
    </>
  );
}
