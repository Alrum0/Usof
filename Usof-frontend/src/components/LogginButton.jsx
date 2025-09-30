import { NavLink } from 'react-router-dom';
import { REGISTER_ROUTE } from '../utils/consts';

export default function LoginButton() {
  const isAuth = true;
  return (
    <>
      {!isAuth && (
        <div className='fixed right-0 top-0'>
          <NavLink
            to={REGISTER_ROUTE}
            className=' absolute right-8 top-8 bg-white px-3.5 py-2 rounded-lg font-semibold cursor-pointer'
          >
            Увійти
          </NavLink>
        </div>
      )}
    </>
  );
}
