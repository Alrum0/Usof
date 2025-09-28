import { NavLink } from 'react-router-dom';
import { LOGIN_ROUTE } from '../utils/consts';

export default function LoginButton() {
  const isAuth = false;
  return (
    <>
      {!isAuth && (
        <div className='fixed right-0 top-0'>
          <NavLink
            to={LOGIN_ROUTE}
            className=' absolute right-8 top-8 bg-white px-3.5 py-2 rounded-lg font-semibold cursor-pointer'
          >
            Увійти
          </NavLink>
        </div>
      )}
    </>
  );
}
